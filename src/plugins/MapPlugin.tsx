import { BeaverAdultEntity, DemoSave, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";
import { Canvas } from '@react-three/fiber'
import { FormEvent, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import lodash, { compact, get, set, toPairs, uniq } from "lodash";
import { MapControls } from "@react-three/drei";
import './MapPlugin.css';
import { Navbar } from "../Navbar";
import { BoxBufferGeometry, BufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, Mesh, MeshStandardMaterial, PlaneBufferGeometry } from "three";
import { deepCopy } from "../deepCopy";
import { StockpileUtil } from "../StockpileUtil";
import { entities } from "../allEntities";

const BufferGeometryUtils = require('three/examples/jsm/utils/BufferGeometryUtils.js') as any;
const { TREE_ENTITIES, BEAVER_ENTITIES, PATH_ENTITIES, PLATFORM_ENTITIES, STORAGE_ENTITIES: STOCKPILE_ENTITIES } = entities;

interface State {
  saveData: DemoSave;
  mapData: MapData;
  entityData: EntityData;
}

interface MutableState extends State {
  setEntity: (entity: UnknownEntity) => void;
  selectEntityId: (id: string | null) => void;
  selectedEntity: UnknownEntity | null;
}

interface MapData {
  i2x: (i: number) => number,
  i2y: (i: number) => number,
  i2xy: (i: number) => [number, number],
  i2xyz: (i: number, y: number) => [number, number, number],
  heightMap: Uint8Array;
  waterDepthMap: Float32Array;
  moistureMap: Float32Array;
  mapSizeX: number;
  mapSizeY: number;
}

interface EntityData {
  deleteIds: string[];
  updateIds: string[];
  entitiesByIds: Record<string, UnknownEntity>;
  entitiesIdsByTemplate: Record<string, string[]>;
}

const EDITABLE_ENTITIES = [
  ...STOCKPILE_ENTITIES, ...TREE_ENTITIES, ...BEAVER_ENTITIES, ...PATH_ENTITIES,
  ...PLATFORM_ENTITIES,
];

const useEntitiesOfTypes = (entityData: EntityData, templateIds: string[]) => {
  const { entitiesIdsByTemplate, entitiesByIds } = entityData;
  return useMemo(() => lodash(templateIds)
    .map(_ => entitiesIdsByTemplate[_])
    .flatten()
    .map((id) => entitiesByIds[id])
    .compact()
    .toJSON(), [templateIds, entitiesIdsByTemplate, entitiesByIds]);
}

function readEntityData(saveData: DemoSave) {
  return lodash(saveData.Entities)
    .filter(_ => EDITABLE_ENTITIES.includes(_.Template))
    .reduce((acc, entity) => {
      acc.entitiesByIds[entity.Id] = entity;
      if (!acc.entitiesIdsByTemplate[entity.Template]) {
        acc.entitiesIdsByTemplate[entity.Template] = [];
      }
      acc.entitiesIdsByTemplate[entity.Template].push(entity.Id);
      return acc;
    }, {
      deleteIds: [],
      updateIds: [],
      entitiesByIds: {},
      entitiesIdsByTemplate: {}
    } as EntityData)
}

function readMapData(saveData: DemoSave) {
  const { Singletons } = saveData;
  const mapSizeX = Singletons.MapSize.Size.X;
  const mapSizeY = Singletons.MapSize.Size.Y;

  return {
    i2x: (index: number) => index % mapSizeY,
    i2y: (index: number) => Math.floor(index / mapSizeY),
    i2xy: (index: number) => [index % mapSizeY, Math.floor(index / mapSizeY)] as [number, number],
    i2xyz: (index: number, y: number) => [index % mapSizeY, y, Math.floor(index / mapSizeY)] as [number, number, number],
    mapSizeX,
    mapSizeY,
    heightMap: Uint8Array.from(Singletons.TerrainMap.Heights.Array.split(" ").map(_ => parseInt(_, 10))),
    moistureMap: Float32Array.from(Singletons.SoilMoistureSimulator.MoistureLevels.Array.split(" ").map(_ => parseFloat(_))),
    waterDepthMap: Float32Array.from(Singletons.WaterMap.WaterDepths.Array.split(" ").map(_ => parseFloat(_))),
  }
}


export const MapPlugin: IEditorPlugin<State, State> = {
  id: "MapPlugin",
  name: "Map",
  position: 2,
  group: "General",
  enabled: true,

  read: (saveData) => ({
    mapData: readMapData(saveData),
    entityData: readEntityData(saveData),
    saveData
  }),

  write: (saveData, state) => {
    return {
      ...saveData,
      Entities: compact(saveData.Entities.map((entity) => {
        if (state.entityData.deleteIds.includes(entity.Id)) {
          return null;
        } else if (state.entityData.updateIds.includes(entity.Id)) {
          return state.entityData.entitiesByIds[entity.Id];
        } else {
          return entity;
        }
      }))
    }
  },

  Preview: ({ saveData }) => <div>
    An interactive 3D Map that will take a while to load.
  </div>,

  Editor: ({ initialData, onSubmit, onClose }) => {
    const [state, setState] = useState(initialData);
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const selectedEntity = (selectedEntityId && state.entityData.entitiesByIds[selectedEntityId]) || null;
    const { mapSizeX, mapSizeY } = state.mapData;

    const setEntity = (entity: UnknownEntity) => {
      const oldEntity: UnknownEntity | undefined = state.entityData.entitiesByIds[entity.Id];
      const newState = {
        ...state,
        entityData: {
          ...state.entityData,
          updateIds: uniq(state.entityData.updateIds.concat([entity.Id])),
          entitiesByIds: {
            ...state.entityData.entitiesByIds,
            [entity.Id]: entity,
          },
        }
      }

      if (!oldEntity || oldEntity.Template !== entity.Template) {
        newState.entityData.entitiesIdsByTemplate = {
          ...newState.entityData.entitiesIdsByTemplate,
          [oldEntity.Template]: (newState.entityData.entitiesIdsByTemplate[oldEntity.Template] || [])
            .filter(_ => !oldEntity || (oldEntity && _ !== oldEntity.Id)),
          [entity.Template]: [...newState.entityData.entitiesIdsByTemplate[entity.Template], entity.Id]
        };
      }

      setState(newState);
    }

    const selectEntityId = useCallback((id: string | null) => {
      if (selectedEntityId && id) {
        return;
      }
      setSelectedEntityId(id);
    }, [selectedEntityId, setSelectedEntityId])

    return <div className="Map__Editor">
      <Navbar onHome={onClose} />
      <Gui {...state} onSubmit={onSubmit} onClose={onClose} selectEntityId={selectEntityId} selectedEntity={selectedEntity} setEntity={setEntity} />

      <Canvas className="Map__Canvas" camera={{ position: [32, 64, -64] }}>
        <EffectComposer>
          {/* <SSAO
            blendFunction={BlendFunction.MULTIPLY}
            samples={50}
            radius={2}
            intensity={30}
          /> */}
        </EffectComposer>
        <axesHelper position={[0, 8, 0]} scale={[4, 4, 4]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={0.4} />
        <group scale={[1, 1, -1]}>
          <group position={[mapSizeX / -2, 0, mapSizeY / -2]}>
            <SlowBoxesHeightMap {...state} />
            <SlowBoxesWaterMap {...state} />
            <TreesMap {...state} />
            <PlatformsMap {...state} />
            <PathsMap {...state} />
            <StockpilesMap {...state} selectEntityId={selectEntityId} selectedEntity={selectedEntity} setEntity={setEntity} />
            <BeaversMap {...state} selectEntityId={selectEntityId} selectedEntity={selectedEntity} setEntity={setEntity} />
          </group>
        </group>
        <MapControls />
      </Canvas>
    </div>;
  }
}

interface GuiProps extends MutableState {
  onSubmit: (state: State) => void;
  onClose: () => void;
}

function Gui(state: GuiProps) {
  if (!state.selectedEntity) {
    return <div className="Map__Gui">
      <div className="Map__Gui__Right p-4">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Map Editor</h4>
            <p>A 3D view of the map. Red bars are beavers. Red boxes are warehouses. Click a red thing to edit. Use mouse to navigate camera.</p>
            <button className="btn btn-primary btn-sm" onClick={() => state.onSubmit(state)}>Save</button>
            {" "}
            <button className="btn btn-light btn-sm" onClick={() => state.onClose()}>Discard changes</button>
          </div>
        </div>
      </div>
    </div>;
  }

  return <div className="Map__Gui">
    <div className="Map__Gui__Right p-4">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{state.selectedEntity.Template}</h4>
          {STOCKPILE_ENTITIES.includes(state.selectedEntity.Template) ? <StockpileForm {...state} /> : null}
          {BEAVER_ENTITIES.includes(state.selectedEntity.Template) ? <BeaverForm {...state} /> : null}
        </div>
      </div>
    </div>
  </div>;
}

function BeaverForm({ selectedEntity, selectEntityId, setEntity }: MutableState) {
  const [beaver, setBeaver] = useState<BeaverAdultEntity>(selectedEntity as any);

  const getValue = (path: (string | number)[]) => get(beaver, path);
  const setValue = (path: (string | number)[], format: (val: string) => any = (x) => x) => (event: FormEvent) => setBeaver(set(deepCopy(beaver), path, format((event.target as any).value)))

  return <form onSubmit={(e) => { e.preventDefault(); setEntity(beaver); selectEntityId(null); }}>
    <div className="mb-1 row">
      <label htmlFor="name" className="col-sm-4 col-form-label p-1">Name</label>
      <div className="col-sm-8">
        <input type="text" id="name" className="form-control p-1" value={getValue(["Components", "Character", "Name"])} onChange={setValue(["Components", "Character", "Name"])} />
      </div>
    </div>

    {beaver.Components.NeedManager.Needs.map((need, index) => <div className="mb-1 row" key={index}>
      <label htmlFor={"need-" + index} className="col-sm-4 col-form-label px-1 py-0">{need.Name}</label>
      <div className="col-sm-8">
        <input type="range" min="0" max="1" step="0.001" id={"need-" + index} className="form-control p-1"
          value={getValue(["Components", "NeedManager", "Needs", index, "Points"])}
          onChange={setValue(["Components", "NeedManager", "Needs", index, "Points"], (val) => parseFloat(val))} />
      </div>
    </div>)}

    <div className="mt-2 row">
      <div className="col-sm-8 offset-sm-4">
        <button type="submit" className="btn btn-secondary btn-sm">OK</button>
        {" "}
        <button type="button" onClick={() => selectEntityId(null)} className="btn btn-light btn-sm">Discard</button>
      </div>
    </div>
  </form>
}

function StockpilesMap({ entityData, selectEntityId, selectedEntity }: MutableState) {
  const stockpiles = useEntitiesOfTypes(entityData, STOCKPILE_ENTITIES)

  return <group>
    {stockpiles.map((stockpile) => <Stockpile selected={selectedEntity === stockpile}
      key={stockpile.Id} stockpile={stockpile} selectEntityId={selectEntityId} />)}
  </group>
}

function Stockpile({ stockpile, selectEntityId, selected }: { selected: boolean, stockpile: UnknownEntity, selectEntityId: (id: string) => void }) {
  const [isHover, setIsHover] = useState(false);

  const onClick = () => { selectEntityId(stockpile.Id); }
  const onPointerEnter = () => { setIsHover(true); }
  const onPointerLeave = () => { setIsHover(false); }

  const pos = (stockpile.Components as any).BlockObject.Coordinates;
  const x: number = pos.X;
  const y: number = pos.Z;
  const z: number = pos.Y;

  const meshRef = useRef<Mesh>();
  const template = stockpile.Template;

  useLayoutEffect(() => {
    if (!meshRef.current) {
      return;
    }
    let sizeX = 3;
    let sizeY = 1;
    let sizeZ = 2;
    let geom: BufferGeometry | null = null;

    if (/UndergroundWarehouse/.test(template)) {
      sizeZ = 3;
      sizeY = 3;
    } else if (/Log/.test(template)) {
      sizeZ = 3;
      sizeY = 0.1;
    } else if (/LargeWarehouse/.test(template)) {
      sizeZ = 3;

      geom = BufferGeometryUtils.mergeBufferGeometries([
        new BoxBufferGeometry(sizeX, sizeY, sizeZ, 1.0, 1.0),
        new BoxBufferGeometry(1, sizeY, sizeZ, 1.0, 1.0).translate(0, 1, 0),
      ])
    } else if (/LargeWaterTank/.test(template)) {
      sizeY = 3
      geom = BufferGeometryUtils.mergeBufferGeometries([
        new CylinderBufferGeometry(1.0, 1.0, sizeY, 8, 8, false).translate(0.5, 0, 0),
        new BoxBufferGeometry(2, 1, 1, 1.0, 1.0).translate(-0.5, -1, 0.5),
      ])
    }

    if (!geom) {
      geom = new BoxBufferGeometry(sizeX, sizeY, sizeZ, 1.0, 1.0);
    }

    if (isHover || selected) {
      geom.scale(1.0 + 0.1 / sizeX, 1.0 + 0.1 / sizeY, 1.0 + 0.1 / sizeZ);
    }

    geom.translate(sizeX / 2 - 0.5, sizeY / 2, sizeZ / 2 - 0.5);
    rotate(geom, stockpile);

    meshRef.current.geometry = geom;
  }, [stockpile, template, selected, isHover]);

  return <mesh ref={meshRef} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onClick={onClick} key={stockpile.Id} position={[x, y, z]}>
    <meshStandardMaterial opacity={0.9} transparent color={selected ? "#651FFF" : (isHover ? "#FF8A65" : "#E64A19")} />
  </mesh>;
}

function BeaversMap({ entityData, selectEntityId, selectedEntity }: MutableState) {
  const beavers = useEntitiesOfTypes(entityData, BEAVER_ENTITIES)

  return <group>
    {beavers.map((beaver) => <Beaver selected={selectedEntity === beaver} key={beaver.Id}
      beaver={beaver} selectEntityId={selectEntityId} />)}
  </group>;
}

function Beaver({ beaver, selectEntityId, selected }: { selected: boolean, beaver: UnknownEntity, selectEntityId: (id: string) => void }) {
  const [isHover, setIsHover] = useState(false);

  const onClick = () => { selectEntityId(beaver.Id); }
  const onPointerEnter = () => { setIsHover(true); }
  const onPointerLeave = () => { setIsHover(false); }

  const pos = (beaver.Components as any).Character.Position;
  const isAdult = beaver.Template === "BeaverAdult";
  const x: number = pos.X - 0.5;
  const y: number = pos.Y + 0.1 + (isAdult ? 0.5 : 0.3);
  const z: number = pos.Z - 0.5;
  return <mesh onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onClick={onClick} key={beaver.Id} position={[x, y, z]}>
    <meshStandardMaterial color={selected ? "#651FFF" : (isHover ? "#FF8A65" : "#E64A19")} />
    <cylinderBufferGeometry args={[
      (isHover || selected) ? 0.4 : 0.2,
      (isHover || selected) ? 0.4 : 0.2,
      (beaver.Template === "BeaverAdult" ? 1.0 : 0.6) * (isHover || selected ? 1.2 : 1.0),
      8.0,
      1.0,
    ]} />
  </mesh>;
}

function StockpileForm({ selectedEntity, selectEntityId, setEntity }: MutableState) {
  const goodIds = useMemo(() => (selectedEntity as any).Components.GoodDesirer.DesiredGoods.map((_: any) => _.Good.Id), [selectedEntity]) as string[];
  const [countGoods, setCountGoods] = useState<Record<string, number>>(() => StockpileUtil.countGoods(selectedEntity!, {}));
  const capacity = StockpileUtil.getCapacity(selectedEntity!)!;
  const totalCounts = Object.values(countGoods).reduce((a, b) => a + b, 0);

  const doSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();
    const newEntity = deepCopy(selectedEntity) as any;
    newEntity.Components["Inventory:Stockpile"] = { Storage: { Goods: toPairs(countGoods).map(([Id, Amount]) => ({ Good: { Id }, Amount })) } };
    setEntity(newEntity);
    selectEntityId(null);
  }, [countGoods, selectEntityId, setEntity, selectedEntity]);

  return <form onSubmit={doSubmit}>
    {goodIds.map((goodId) => <div className="mb-1 row" key={goodId}>
      <label htmlFor={"good-" + goodId} className="col-sm-4 col-form-label col-form-label-sm">{goodId}</label>
      <div className="col-sm-8">
        <input type="number" id={"good-" + goodId} className="form-control form-control-sm" value={countGoods[goodId] || 0}
          onChange={(event) => setCountGoods({ ...countGoods, [goodId]: event.target.valueAsNumber || 0 })} />
      </div>
    </div>)}

    <div className="mt-2 row">
      <div className="col-sm-8 offset-sm-4">
        {totalCounts > capacity
          ? <div className="text-danger p-1">Warning: <strong>{totalCounts}</strong> storage exceeds capacity of <strong>{capacity}</strong>!</div>
          : <div className="p-1"><strong>{totalCounts}</strong> / <strong>{capacity}</strong></div>}

        <button type="submit" className="btn btn-secondary btn-sm">OK</button>
        {" "}
        <button type="button" onClick={() => selectEntityId(null)} className="btn btn-light btn-sm">Discard</button>
      </div>
    </div>
  </form>
}

function createTreeGeom({ dry, dead, adult, x, y, z }: {
  entity: any;
  dry: boolean;
  dead: boolean;
  adult: boolean;
  x: number;
  z: number;
  y: number;
}) {
  return new ConeBufferGeometry((adult ? 0.4 : 0.2) * (dead ? 0.5 : 1.0), adult ? 2.0 : 0.5, 4.0, 4.0)
    .translate(x, y + 0.5, z)
}

function meshWithColorFromGeoms(geometries: any[], color: string, opacity: number = 1.0) {
  if (geometries.length === 0) {
    return new Mesh();
  }
  const geom = BufferGeometryUtils.mergeBufferGeometries(geometries)
  const mat = new MeshStandardMaterial({ color, opacity, transparent: opacity <= 0.99 });
  return new Mesh(geom, mat);
}

function getEntityRotationY(entity: UnknownEntity): number {
  const orientationMatch = (entity as any).Components.BlockObject.Orientation?.Value?.match(/Cw(\d+)/);
  if (orientationMatch) {
    return parseFloat(orientationMatch[1]) / 180 * Math.PI;
  } else {
    return 0
  }
}

function rotate(geom: BufferGeometry, entity: UnknownEntity) {
  return geom.rotateY(getEntityRotationY(entity));
}

function PathsMap({ entityData }: State) {
  const paths = useEntitiesOfTypes(entityData, PATH_ENTITIES);
  const mesh = useMemo(() => meshWithColorFromGeoms(paths
    .map((_: any) => {
      let geom: BufferGeometry | null = null;
      if (/Slope|Stairs/.test(_.Template)) {
        geom = new PlaneBufferGeometry(1, 1.44, 1, 1).rotateX(-Math.PI / 4).translate(0, 0.6, 0)
        geom = rotate(geom, _);
      } else if (/DistrictGate/.test(_.Template)) {
        geom = BufferGeometryUtils.mergeBufferGeometries([
          new PlaneBufferGeometry(1, 1, 1, 1).rotateX(-Math.PI / 2).translate(0, 0.1, 0),
          rotate(new BoxBufferGeometry(0.8, 1, 0.1, 1, 1, 1).translate(0, 0.5, 0), _),
        ])
      } else {
        geom = new PlaneBufferGeometry(1, 1, 1, 1).rotateX(-Math.PI / 2).translate(0, 0.1, 0)
      }

      return geom ? geom.translate(
        _.Components.BlockObject.Coordinates.X,
        _.Components.BlockObject.Coordinates.Z,
        _.Components.BlockObject.Coordinates.Y
      ) : null;
    }).filter(_ => _), "#BCAAA4", 0.8), [paths]);

  return <primitive object={mesh} />;
}

function PlatformsMap({ entityData }: State) {
  const paths = useEntitiesOfTypes(entityData, PLATFORM_ENTITIES);
  const geom = useMemo(() => meshWithColorFromGeoms(paths
    .map((_: any) => {
      let geom: BufferGeometry | null = null;
      let height = 1;
      if (/DoublePlatform/.test(_.Template)) {
        height = 2;
      } else if (/TriplePlatform/.test(_.Template)) {
        height = 3;
      }
      height -= 0.05;
      geom = BufferGeometryUtils.mergeBufferGeometries([
        new BoxBufferGeometry(0.1, height, 0.1, 1, 1, 1).translate(-0.4, height / 2, -0.4),
        new BoxBufferGeometry(0.1, height, 0.1, 1, 1, 1).translate(0.4, height / 2, 0.4),
        new BoxBufferGeometry(0.1, height, 0.1, 1, 1, 1).translate(0.4, height / 2, -0.4),
        new BoxBufferGeometry(0.1, height, 0.1, 1, 1, 1).translate(-0.4, height / 2, 0.4),
        new BoxBufferGeometry(0.95, 0.05, 0.95, 1, 1, 1).translate(0, height + 0.025, 0),
      ]);

      return geom ? geom.translate(
        _.Components.BlockObject.Coordinates.X,
        _.Components.BlockObject.Coordinates.Z,
        _.Components.BlockObject.Coordinates.Y
      ) : null;
    }).filter(_ => _), "#A1887F"), [paths]);

  return <primitive object={geom} />;
}

function TreesMap({ entityData }: State) {
  const treeEntities = useEntitiesOfTypes(entityData, TREE_ENTITIES);

  const { greenTrees, brownTrees } = useMemo(() => {
    const trees = treeEntities.map((_: any) => ({
      entity: _,
      dry: _.Components.WateredNaturalResource.DryingProgress > 0.9999,
      dead: false, // _.Components.LivingNaturalResource.IsDead as boolean,
      adult: _.Components.Growable.GrowthProgress > 0.9999,
      x: _.Components.BlockObject.Coordinates.X as number,
      z: _.Components.BlockObject.Coordinates.Y as number,
      y: _.Components.BlockObject.Coordinates.Z as number,
    }));

    const greenTrees = meshWithColorFromGeoms(
      trees.filter(_ => !(_.dry || _.dead)).map(createTreeGeom), "#388E3C");
    const brownTrees = meshWithColorFromGeoms(
      trees.filter(_ => _.dry || _.dead).map(createTreeGeom), "#5D4037");

    return { greenTrees, brownTrees }
  }, [treeEntities]);

  return <group>
    <primitive object={greenTrees} />
    <primitive object={brownTrees} />
  </group>;
}

function SlowBoxesWaterMap({ mapData }: State) {
  const { i2x, i2y, heightMap, waterDepthMap } = mapData;

  const mesh = useMemo(() => {
    const geoms = lodash(waterDepthMap).reduce((acc, y, i) => {
      if (y > 0) {
        acc.push(new PlaneBufferGeometry(1, 1, 1, 1)
          .rotateX(-Math.PI / 2)
          .translate(i2x(i), y * 0.95 + 0.05 + heightMap[i], i2y(i)));
      }
      return acc;
    }, [] as BufferGeometry[]);

    return meshWithColorFromGeoms(geoms, "#0044cc", 0.8);
  }, [i2x, i2y, heightMap, waterDepthMap])

  return <primitive object={mesh} />;
}

function SlowBoxesHeightMap({ mapData }: State) {
  const { heightMap, moistureMap, i2x, i2y } = mapData;
  const { wetLand, dryLand } = useMemo(() => {
    const { wetBoxes, dryBoxes } = lodash(heightMap)
      .reduce((acc, height, index) => {
        const isWet = moistureMap[index] > 0;
        const box = new BoxBufferGeometry(1, height, 1, 1, 1, 1).translate(i2x(index), height / 2, i2y(index));
        (isWet ? acc.wetBoxes : acc.dryBoxes).push(box);
        return acc;
      }, { wetBoxes: [] as BufferGeometry[], dryBoxes: [] as BufferGeometry[] })

    return {
      wetLand: meshWithColorFromGeoms(wetBoxes, "#8BC34A"),
      dryLand: meshWithColorFromGeoms(dryBoxes, "#795548")
    }
  }, [i2x, i2y, heightMap, moistureMap])

  return <group>
    <primitive object={wetLand} />
    <primitive object={dryLand} />
  </group>;
}
