import { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  DirectionalLight,
  Engine,
  HemisphericLight,
  HighlightLayer,
  MeshBuilder,
  PointerEventTypes,
  Scene,
  StandardMaterial,
  Vector3,
} from "@babylonjs/core";
import type { Mesh } from "@babylonjs/core";
import { getRoomByWindowId } from "../data/rooms";
import type { Room } from "../data/rooms";
import type { BookRoom } from "../types";
import "./HotelScene.css";

interface Props {
  onBack: () => void;
  onBook: BookRoom;
}

const HOVER_COLOR = new Color3(0.3, 0.64, 1);
const SELECTED_COLOR = new Color3(1, 0.78, 0.38);

function HotelScene({ onBack, onBook }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clearSelectionRef = useRef<() => void>(() => {});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);
    scene.clearColor = new Color3(0.08, 0.09, 0.12).toColor4();

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 3,
      Math.PI / 3,
      22,
      new Vector3(0, 2.5, 0),
      scene,
    );
    camera.attachControl(canvasRef.current, true);
    camera.upperBetaLimit = Math.PI / 2 - 0.05;
    camera.lowerRadiusLimit = 8;
    camera.upperRadiusLimit = 35;
    camera.wheelPrecision = 25;

    const ambientLight = new HemisphericLight(
      "ambientLight",
      new Vector3(0, 1, 0),
      scene,
    );
    ambientLight.intensity = 0.55;
    ambientLight.groundColor = new Color3(0.1, 0.1, 0.15);

    const sunLight = new DirectionalLight(
      "sunLight",
      new Vector3(-1, -2, -1),
      scene,
    );
    sunLight.intensity = 0.85;

    const groundMat = new StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new Color3(0.18, 0.24, 0.18);

    const wallMat = new StandardMaterial("wallMat", scene);
    wallMat.diffuseColor = new Color3(0.9, 0.9, 0.92);

    const glassMat = new StandardMaterial("glassMat", scene);
    glassMat.diffuseColor = new Color3(0.3, 0.6, 0.9);
    glassMat.emissiveColor = new Color3(0.15, 0.25, 0.4);

    const roofMat = new StandardMaterial("roofMat", scene);
    roofMat.diffuseColor = new Color3(0.25, 0.25, 0.28);

    const entranceMat = new StandardMaterial("entranceMat", scene);
    entranceMat.diffuseColor = new Color3(0.15, 0.15, 0.18);

    const pathMat = new StandardMaterial("pathMat", scene);
    pathMat.diffuseColor = new Color3(0.32, 0.33, 0.36);

    const treeMat = new StandardMaterial("treeMat", scene);
    treeMat.diffuseColor = new Color3(0.2, 0.45, 0.25);

    const trunkMat = new StandardMaterial("trunkMat", scene);
    trunkMat.diffuseColor = new Color3(0.4, 0.25, 0.15);

    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 50, height: 50 },
      scene,
    );
    ground.material = groundMat;

    const hotelMain = MeshBuilder.CreateBox(
      "hotelMain",
      { width: 10, height: 6, depth: 6 },
      scene,
    );
    hotelMain.position.y = 3;
    hotelMain.material = wallMat;

    const roof = MeshBuilder.CreateBox(
      "roof",
      { width: 10.4, height: 0.3, depth: 6.4 },
      scene,
    );
    roof.position.y = 6.15;
    roof.material = roofMat;

    const entrance = MeshBuilder.CreateBox(
      "entrance",
      { width: 3, height: 1.6, depth: 0.6 },
      scene,
    );
    entrance.position.set(0, 0.8, 3.1);
    entrance.material = entranceMat;

    for (let index = 0; index < 5; index++) {
      const slab = MeshBuilder.CreateBox(
        `path_${index}`,
        { width: 1.8, height: 0.06, depth: 1.2 },
        scene,
      );
      slab.position.set(0, 0.03, 4.1 + index * 1.35);
      slab.material = pathMat;
    }

    const windowMeshes = new Map<string, Mesh>();
    const rows = 3;
    const cols = 5;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === 0 && c === 2) continue;

        const windowMesh = MeshBuilder.CreateBox(
          `window_${r}_${c}`,
          { width: 0.9, height: 1.1, depth: 0.1 },
          scene,
        );

        const xPos = -3.6 + c * 1.8;
        const yPos = 1.3 + r * 1.8;

        windowMesh.position.set(xPos, yPos, 3.01);
        windowMesh.material = glassMat;
        windowMeshes.set(windowMesh.name, windowMesh);
      }
    }

    const treePositions = [
      new Vector3(-9, 0, 6),
      new Vector3(-8, 0, 10),
      new Vector3(9, 0, 5),
      new Vector3(8, 0, -6),
      new Vector3(-7, 0, -8),
    ];

    treePositions.forEach((pos, index) => {
      const trunk = MeshBuilder.CreateCylinder(
        `trunk_${index}`,
        { height: 1.6, diameter: 0.3 },
        scene,
      );
      trunk.position.set(pos.x, 0.8, pos.z);
      trunk.material = trunkMat;

      const foliage = MeshBuilder.CreateSphere(
        `foliage_${index}`,
        { diameter: 2 },
        scene,
      );
      foliage.position.set(pos.x, 2.0, pos.z);
      foliage.material = treeMat;
    });

    const highlightLayer = new HighlightLayer("roomHighlight", scene);
    highlightLayer.innerGlow = false;
    highlightLayer.outerGlow = true;
    highlightLayer.blurHorizontalSize = 1.2;
    highlightLayer.blurVerticalSize = 1.2;

    let hoveredMesh: Mesh | null = null;
    let selectedMesh: Mesh | null = null;
    let cameraTarget: Vector3 | null = null;
    let cameraRadius = camera.radius;
    let cameraBeta = camera.beta;

    const updateHighlights = () => {
      highlightLayer.removeAllMeshes();

      if (selectedMesh) {
        highlightLayer.addMesh(selectedMesh, SELECTED_COLOR);
      }

      if (hoveredMesh && hoveredMesh !== selectedMesh) {
        highlightLayer.addMesh(hoveredMesh, HOVER_COLOR);
      }
    };

    const pickRoom = () => {
      const pick = scene.pick(
        scene.pointerX,
        scene.pointerY,
        (mesh) => mesh.name.startsWith("window_"),
      );
      const pickedName = pick?.pickedMesh?.name;
      if (!pickedName) return null;

      const room = getRoomByWindowId(pickedName);
      const mesh = windowMeshes.get(pickedName) ?? null;
      if (!room || !mesh) return null;

      return { room, mesh };
    };

    const focusCamera = (mesh: Mesh) => {
      cameraTarget = mesh.position.clone();
      cameraRadius = 11;
      cameraBeta = Math.PI / 2.7;
    };

    clearSelectionRef.current = () => {
      selectedMesh = null;
      updateHighlights();
    };

    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        const result = pickRoom();
        const nextHovered = result?.mesh ?? null;

        if (nextHovered !== hoveredMesh) {
          hoveredMesh = nextHovered;
          updateHighlights();
        }

        if (canvasRef.current) {
          canvasRef.current.style.cursor = result ? "pointer" : "";
        }
      }

      if (pointerInfo.type === PointerEventTypes.POINTERTAP) {
        const result = pickRoom();
        if (!result) return;

        selectedMesh = result.mesh;
        setSelectedRoom(result.room);
        focusCamera(result.mesh);
        updateHighlights();
      }
    });

    const renderObserver = scene.onBeforeRenderObservable.add(() => {
      if (!cameraTarget) return;

      const deltaFactor = 1 - Math.pow(0.001, engine.getDeltaTime() / 1000);
      camera.target = Vector3.Lerp(camera.target, cameraTarget, deltaFactor);
      camera.radius += (cameraRadius - camera.radius) * deltaFactor;
      camera.beta += (cameraBeta - camera.beta) * deltaFactor;

      const reachedTarget = Vector3.Distance(camera.target, cameraTarget) < 0.05;
      const reachedRadius = Math.abs(camera.radius - cameraRadius) < 0.1;

      if (reachedTarget && reachedRadius) {
        camera.target = cameraTarget;
        camera.radius = cameraRadius;
        camera.beta = cameraBeta;
        cameraTarget = null;
      }
    });

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => {
      engine.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.onPointerObservable.remove(pointerObserver);
      scene.onBeforeRenderObservable.remove(renderObserver);
      clearSelectionRef.current = () => {};
      highlightLayer.dispose();
      scene.dispose();
      engine.dispose();
    };
  }, []);

  const handleClosePanel = () => {
    setSelectedRoom(null);
    clearSelectionRef.current();
  };

  return (
    <div className="hotel-view">
      <button type="button" className="hotel-back" onClick={onBack}>
        ← Wróć do serwisu
      </button>

      <p className="hotel-hint">
        Kliknij okno, aby zobaczyć szczegóły pokoju
        <span>Przeciągnij, aby obrócić · Scroll, aby przybliżyć</span>
      </p>

      <canvas ref={canvasRef} className="hotel-canvas" />

      {selectedRoom && (
        <aside
          className="hotel-panel"
          aria-label={`Szczegóły pokoju ${selectedRoom.name}`}
        >
          <div className="hotel-panel__header">
            <div>
              <p className="eyebrow">{selectedRoom.category}</p>
              <h2 className="hotel-panel__title">{selectedRoom.name}</h2>
            </div>
            <button
              type="button"
              className="hotel-panel__close"
              onClick={handleClosePanel}
              aria-label="Zamknij panel pokoju"
            >
              ×
            </button>
          </div>

          <span
            className={`badge ${selectedRoom.available ? "badge--available" : "badge--unavailable"}`}
          >
            {selectedRoom.available ? "Dostępny" : "Zajęty"}
          </span>

          <p className="hotel-panel__description">{selectedRoom.description}</p>

          <dl className="hotel-panel__meta">
            <div>
              <dt>Cena</dt>
              <dd>{selectedRoom.price} zł / noc</dd>
            </div>
            <div>
              <dt>Pojemność</dt>
              <dd>{selectedRoom.capacity} os.</dd>
            </div>
            <div>
              <dt>Powierzchnia</dt>
              <dd>{selectedRoom.size} m²</dd>
            </div>
          </dl>

          <ul className="hotel-panel__features">
            {selectedRoom.features.slice(0, 4).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>

          <button
            type="button"
            className="btn btn--primary hotel-panel__book"
            disabled={!selectedRoom.available}
            onClick={() => onBook(selectedRoom.id)}
          >
            {selectedRoom.available ? "Zarezerwuj ten pokój" : "Pokój niedostępny"}
          </button>
        </aside>
      )}
    </div>
  );
}

export default HotelScene;
