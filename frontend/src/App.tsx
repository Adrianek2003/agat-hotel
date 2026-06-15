import { useEffect, useRef } from "react";

import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  StandardMaterial,
  Color3,
  PointerEventTypes
} from "@babylonjs/core";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    scene.clearColor = new Color3(0.08, 0.09, 0.12).toColor4(1);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      15,
      new Vector3(0, 0, 0),
      scene
    );

    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 30;

    const light = new HemisphericLight(
      "light",
      new Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.9;

    const ground = MeshBuilder.CreateGround("ground", {
      width: 20,
      height: 20
    });

    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.2, 0.2, 0.25);
    ground.material = groundMat;

    const rooms: any[] = [];

    const createRoom = (name: string, x: number, z: number) => {
      const room = MeshBuilder.CreateBox(name, {
        width: 2,
        height: 1.5,
        depth: 2
      });

      room.position = new Vector3(x, 0.75, z);

      const mat = new StandardMaterial(name + "Mat", scene);
      mat.diffuseColor = new Color3(0.3, 0.6, 0.9);
      room.material = mat;

      room.metadata = { name };

      rooms.push(room);
      return room;
    };

    createRoom("Room 101", -4, -2);
    createRoom("Room 102", 0, -2);
    createRoom("Room 103", 4, -2);
    createRoom("Room 201", -4, 2);
    createRoom("Room 202", 0, 2);
    createRoom("Room 203", 4, 2);

    scene.onPointerObservable.add((pointerInfo) => {
      const pick = pointerInfo.pickInfo;

      if (pick?.hit && pick.pickedMesh?.metadata?.name) {
        const room = pick.pickedMesh;

        if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
          alert(`Wybrano: ${room.metadata.name}`);
        }
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block"
      }}
    />
  );
}

export default App;