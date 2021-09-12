import { DemoSave, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";
import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from "react";
import lodash from "lodash";
import { MapControls } from "@react-three/drei";
import './MapPlugin.scss';
import { Navbar } from "../Navbar";
import { BoxBufferGeometry, BufferGeometry, ConeBufferGeometry, Mesh, MeshStandardMaterial, PlaneBufferGeometry } from "three";
import { EffectComposer, SSAO as _SSAO } from "@react-three/postprocessing";

const SSAO = _SSAO as any;
const { BlendFunction } = require("postprocessing") as any;
const BufferGeometryUtils = require('three/examples/jsm/utils/BufferGeometryUtils.js') as any;

interface State {
  saveData: DemoSave;
  mapData: MapData;
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

function readMapData(saveData: DemoSave) {
  const {Singletons} = saveData;
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
    saveData
  }),

  write: (_saveData, { saveData }) => saveData,

  Preview: ({ saveData }) => <div>
    A 3D Map
  </div>,

  Editor: ({ initialData: state, onSubmit, onClose }) => {
    const {Singletons} = state.saveData;
    const mapSizeX = Singletons.MapSize.Size.X;
    const mapSizeY = Singletons.MapSize.Size.Y;

    return <div className="Map__Editor">
      <Navbar onHome={onClose} />

      <Canvas camera={{position: [32, 64, -64]}}>
        <EffectComposer>
          <SSAO
            blendFunction={BlendFunction.MULTIPLY}
            samples={50}
            radius={2}
            intensity={30}
          />
        </EffectComposer>
        <axesHelper position={[0, 8, 0]} scale={[4, 4, 4]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 10]} intensity={0.4} />
        <group scale={[1, 1, -1]}>
          <group position={[mapSizeX/-2, 0, mapSizeY/-2]}>
            <SlowBoxesHeightMap {...state} />
            <SlowBoxesWaterMap {...state} />
            <TreesMap {...state} />
            <PathsMap {...state} />
            <BeaversMap {...state} />
          </group>
        </group>
        <MapControls />
      </Canvas>
    </div>;
  }
}

function BeaversMap({ saveData }: State) {
  const beavers = useMemo(() => lodash(saveData.Entities)
    .filter((_) => ["BeaverAdult", "BeaverChild"].includes(_.TemplateName)).toJSON(), [saveData.Entities]);

  return <group>
    {beavers.map((beaver: UnknownEntity) => <Beaver key={beaver.Id} beaver={beaver} />)}
  </group>;
}

function Beaver({ beaver }: { beaver: UnknownEntity }) {
  const [isHover, setIsHover] = useState(false);

  const onClick = () => {
    console.log(beaver);
  }

  const onPointerEnter = () => {
    setIsHover(true);
  }

  const onPointerLeave = () => {
    setIsHover(false);
  }

  const pos = (beaver.Components as any).Beaver.Position;
  const isAdult = beaver.TemplateName === "BeaverAdult";
  const x: number = pos.X;
  const y: number = pos.Y + 0.1 + (isAdult ? 0.5 : 0.3);
  const z: number = pos.Z;
  return <mesh onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} onClick={onClick} key={beaver.Id} position={[x, y, z]}>
    <meshStandardMaterial color={isHover ? "#FF8A65" : "#E64A19"} />
    <cylinderBufferGeometry args={[
      isHover ? 0.6 : 0.4,
      isHover ? 0.6 : 0.4,
      (beaver.TemplateName === "BeaverAdult" ? 1.0 : 0.6) * (isHover ? 1.2 : 1.0),
      8.0,
      1.0,
    ]} />
  </mesh>;
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

function meshWithColorFromGeoms(geometries: any[], color: string) {
  const geom = BufferGeometryUtils.mergeBufferGeometries(geometries)
  const mat = new MeshStandardMaterial({ color });
  return new Mesh(geom, mat);
}

function PathsMap({ saveData }: State) {
  const paths = useMemo(() => {
    const paths = lodash(saveData.Entities)
      .filter((_) => ["DirtPath"].includes(_.TemplateName))
      .map((_: any) => new PlaneBufferGeometry(1, 1, 1, 1)
        .rotateX(-Math.PI/2)
        .translate(
          _.Components.BlockObject.Coordinates.X,
          _.Components.BlockObject.Coordinates.Z + 0.1,
          _.Components.BlockObject.Coordinates.Y
        ),
      );

    return meshWithColorFromGeoms(paths.toJSON(), "#BCAAA4");
  }, [saveData.Entities]);

  return <primitive object={paths} />;
}

function TreesMap({ saveData }: State) {
  const {greenTrees, brownTrees} = useMemo(() => {
    const trees = lodash(saveData.Entities)
      .filter((_) => ["Maple", "Pine"].includes(_.TemplateName))
      .map((_: any) => ({
        entity: _,
        dry: _.Components.WateredObject.IsDry as boolean,
        dead: _.Components.LivingNaturalResource.IsDead as boolean,
        adult: _.Components.Growable.GrowthProgress > 0.9999,
        x: _.Components.BlockObject.Coordinates.X as number,
        z: _.Components.BlockObject.Coordinates.Y as number,
        y: _.Components.BlockObject.Coordinates.Z as number,
      }));

    const greenTrees = meshWithColorFromGeoms(
      trees.filter(_ => !(_.dry || _.dead)).map(createTreeGeom).toJSON(), "#388E3C");
    const brownTrees = meshWithColorFromGeoms(
      trees.filter(_ => _.dry || _.dead).map(createTreeGeom).toJSON(), "#5D4037");

    return {greenTrees, brownTrees}
  }, [saveData.Entities]);

  return <group>
    <primitive object={greenTrees} />
    <primitive object={brownTrees} />
  </group>;
}

function SlowBoxesWaterMap({mapData}: State) {
  const {i2x, i2y, heightMap, waterDepthMap} = mapData;

  const mesh = useMemo(() => {
    const geoms = lodash(waterDepthMap).reduce((acc, y, i) => {
      if (y > 0) {
        acc.push(new PlaneBufferGeometry(1, 1, 1, 1)
          .rotateX(-Math.PI/2)
          .translate(i2x(i), y + heightMap[i], i2y(i)));
      }
      return acc;
    }, [] as BufferGeometry[]);

    return meshWithColorFromGeoms(geoms, "#0044cc");
  }, [i2x, i2y, heightMap, waterDepthMap])

  return <primitive object={mesh} />;
}

function SlowBoxesHeightMap({mapData}: State) {
  const {heightMap, moistureMap, i2x, i2y} = mapData;
  const {wetLand, dryLand} = useMemo(() => {
    const {wetBoxes, dryBoxes} = lodash(heightMap)
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
