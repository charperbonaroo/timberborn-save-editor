import { DemoSave, UnknownEntity } from "../DemoSave";
import { IEditorPlugin } from "../IEditorPlugin";
import { Canvas } from '@react-three/fiber'
import { useMemo, useState } from "react";
import lodash from "lodash";
import { MapControls } from "@react-three/drei";
import './MapPlugin.scss';
import { Navbar } from "../Navbar";
import { BoxGeometry, ConeBufferGeometry, Mesh, MeshStandardMaterial, PlaneBufferGeometry } from "three";
import { EffectComposer, SSAO as _SSAO } from "@react-three/postprocessing";

const SSAO = _SSAO as any;
const { BlendFunction } = require("postprocessing") as any;
const BufferGeometryUtils = require('three/examples/jsm/utils/BufferGeometryUtils.js') as any;

export const MapPlugin: IEditorPlugin<DemoSave, DemoSave> = {
  id: "MapPlugin",
  name: "Map",
  position: 2,
  group: "General",
  enabled: true,

  read: (saveData) => saveData,
  write: (saveData, data) => data,

  Preview: ({ saveData }) => <div>
    A 3D Map
  </div>,

  Editor: ({ initialData, onSubmit, onClose }) => {

    // X: Left/Right
    // Y: Up (+), Down (-)
    // Z: Front (+), Far (-)

    const {Singletons} = initialData;
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
            <SlowBoxesHeightMap initialData={initialData} />
            <SlowBoxesWaterMap initialData={initialData} />
            <TreesMap initialData={initialData} />
            <PathsMap initialData={initialData} />
            <BeaversMap initialData={initialData} />
          </group>
        </group>
        <MapControls />
      </Canvas>
    </div>;
  }
}

function BeaversMap({ initialData }: { initialData: DemoSave }) {
  const beavers = useMemo(() => lodash(initialData.Entities)
    .filter((_) => ["BeaverAdult", "BeaverChild"].includes(_.TemplateName)).toJSON(), [initialData.Entities]);

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

function PathsMap({ initialData }: { initialData: DemoSave }) {
  const paths = useMemo(() => {
    const paths = lodash(initialData.Entities)
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
  }, [initialData.Entities]);

  return <primitive object={paths} />;
}

function TreesMap({ initialData }: { initialData: DemoSave }) {
  const {greenTrees, brownTrees} = useMemo(() => {
    const trees = lodash(initialData.Entities)
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
  }, [initialData.Entities]);

  return <group>
    <primitive object={greenTrees} />
    <primitive object={brownTrees} />
  </group>;
}

function SlowBoxesWaterMap({initialData}: {initialData: DemoSave}) {
  const {Singletons} = initialData;
  const mesh = useMemo(() => {
    const mapSizeY = Singletons.MapSize.Size.Y;

    const heights = Singletons.TerrainMap.Heights.Array.split(" ").map(_ => parseInt(_, 10));

    const geoms = lodash(Singletons.WaterMap.WaterDepths.Array)
      .split(" ")
      .map((y) => parseFloat(y))
      .map((y, i) => y > 0 ? y + heights[i] : 0)
      .map((y, i) => y > 0 ? ({ x: i % mapSizeY, y, z: Math.floor(i / mapSizeY) }) : null)
      .compact()
      .map(({ x, y, z}) => new PlaneBufferGeometry(1, 1, 1, 1).rotateX(-Math.PI/2).translate(x, y, z))
      .toJSON()

    const geom = BufferGeometryUtils.mergeBufferGeometries(geoms)
    const mat = new MeshStandardMaterial({ color: "#0044cc" });
    return new Mesh(geom, mat);
  }, [Singletons.TerrainMap.Heights.Array, Singletons.WaterMap.WaterDepths.Array, Singletons.MapSize.Size.Y])

  return <primitive object={mesh} />;
}

function SlowBoxesHeightMap({initialData}: {initialData: DemoSave}) {
  const {Singletons} = initialData;

  const {wetLand, dryLand} = useMemo(() => {
    const mapSizeY = Singletons.MapSize.Size.Y;
    const wetLevels = Singletons.SoilMoistureSimulator.MoistureLevels.Array.split(" ").map(_ => parseFloat(_));

    const allBoxes = lodash(Singletons.TerrainMap.Heights.Array)
      .split(" ")
      .map(_ => parseInt(_, 10))
      .map((y, i) => ({ x: i % mapSizeY, y, z: Math.floor(i / mapSizeY) }))
      .map(({ x, y, z}) => new BoxGeometry(1, y, 1, 1, 1, 1).translate(x, y / 2, z));

    const wetBoxes = allBoxes.filter((_, i) => wetLevels[i] > 0).toJSON();
    const dryBoxes = allBoxes.filter((_, i) => wetLevels[i] === 0).toJSON();

    return {
      wetLand: meshWithColorFromGeoms(wetBoxes, "#8BC34A"),
      dryLand: meshWithColorFromGeoms(dryBoxes, "#795548")
    }
  }, [Singletons.TerrainMap.Heights.Array, Singletons.MapSize.Size.Y, Singletons.SoilMoistureSimulator.MoistureLevels.Array])

  return <group>
    <primitive object={wetLand} />
    <primitive object={dryLand} />
  </group>;
}
