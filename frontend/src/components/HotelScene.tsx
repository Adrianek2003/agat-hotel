import { useEffect, useRef } from "react";
import {
    Engine,
    Scene,
    ArcRotateCamera,
    Vector3,
    HemisphericLight,
    DirectionalLight,
    MeshBuilder,
    StandardMaterial,
    Color3
} from "@babylonjs/core";

interface Props {
    onBack: () => void;
}

function HotelScene({ onBack }: Props) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Inicjalizacja silnika i sceny
        const engine = new Engine(canvasRef.current, true);
        const scene = new Scene(engine);

        // Kolor nocnego nieba w tle
        scene.clearColor = new Color3(0.08, 0.09, 0.12).toColor4();

        // 2. Kamera z lepszej perspektywy i z ograniczeniami ruchu
        const camera = new ArcRotateCamera(
            "camera",
            -Math.PI / 4,
            Math.PI / 3,
            22,
            new Vector3(0, 2, 0),
            scene
        );
        camera.attachControl(canvasRef.current, true);
        camera.upperBetaLimit = Math.PI / 2 - 0.05; // Blokada przed wejściem pod ziemię
        camera.lowerRadiusLimit = 8;               // Maksymalne przybliżenie
        camera.upperRadiusLimit = 35;              // Maksymalne oddalenie

        // 3. Oświetlenie wielokierunkowe (Sceneria nabiera głębi)
        const ambientLight = new HemisphericLight(
            "ambientLight",
            new Vector3(0, 1, 0),
            scene
        );
        ambientLight.intensity = 0.5;
        ambientLight.groundColor = new Color3(0.1, 0.1, 0.15);

        const sunLight = new DirectionalLight(
            "sunLight",
            new Vector3(-1, -2, -1),
            scene
        );
        sunLight.intensity = 0.8;

        // 4. Definicje materiałów
        const groundMat = new StandardMaterial("groundMat", scene);
        groundMat.diffuseColor = new Color3(0.18, 0.24, 0.18); // Ciemnozielone otoczenie

        const wallMat = new StandardMaterial("wallMat", scene);
        wallMat.diffuseColor = new Color3(0.9, 0.9, 0.92); // Jasny, nowoczesny beton

        const glassMat = new StandardMaterial("glassMat", scene);
        glassMat.diffuseColor = new Color3(0.3, 0.6, 0.9);
        glassMat.emissiveColor = new Color3(0.15, 0.25, 0.4); // Efekt delikatnie świecących okien

        const roofMat = new StandardMaterial("roofMat", scene);
        roofMat.diffuseColor = new Color3(0.25, 0.25, 0.28); // Grafitowy dach

        const entranceMat = new StandardMaterial("entranceMat", scene);
        entranceMat.diffuseColor = new Color3(0.15, 0.15, 0.18);

        const treeMat = new StandardMaterial("treeMat", scene);
        treeMat.diffuseColor = new Color3(0.2, 0.45, 0.25);

        const trunkMat = new StandardMaterial("trunkMat", scene);
        trunkMat.diffuseColor = new Color3(0.4, 0.25, 0.15);


        // 5. Budowanie geometrii (Siatki / Meshes)

        // Podłoże
        const ground = MeshBuilder.CreateGround("ground", { width: 50, height: 50 }, scene);
        ground.material = groundMat;

        // Główny budynek hotelu
        const hotelMain = MeshBuilder.CreateBox("hotelMain", { width: 10, height: 6, depth: 6 }, scene);
        hotelMain.position.y = 3; // uniesienie o połowę wysokości, by stał na ziemi
        hotelMain.material = wallMat;

        // Nowoczesny płaski dach z obramowaniem
        const roof = MeshBuilder.CreateBox("roof", { width: 10.4, height: 0.3, depth: 6.4 }, scene);
        roof.position.y = 6.15;
        roof.material = roofMat;

        // Strefa wejściowa (recepcja / daszek)
        const entrance = MeshBuilder.CreateBox("entrance", { width: 3, height: 1.6, depth: 0.6 }, scene);
        entrance.position.set(0, 0.8, 3.1);
        entrance.material = entranceMat;


        // GENERATOR OKIEN (Pętla tworząca siatkę okien na frontowej ścianie)
        const rows = 3;
        const cols = 5;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                // Pomijamy środek parteru, bo tam wybudowaliśmy wejście
                if (r === 0 && (c === 2)) continue;

                const windowMesh = MeshBuilder.CreateBox(
                    `window_${r}_${c}`,
                    { width: 0.9, height: 1.1, depth: 0.1 },
                    scene
                );

                // Matematyczne wyrównanie pozycji okien na fasadzie
                const xPos = -3.6 + c * 1.8;
                const yPos = 1.3 + r * 1.8;

                windowMesh.position.set(xPos, yPos, 3.01); // 3.01 wysuwa okno minimalnie przed ścianę
                windowMesh.material = glassMat;
            }
        }


        // OTOCZENIE (Dodanie kilku drzew low-poly)
        const treePositions = [
            new Vector3(-9, 0, 6),
            new Vector3(-8, 0, 10),
            new Vector3(9, 0, 5),
            new Vector3(8, 0, -6),
            new Vector3(-7, 0, -8)
        ];

        treePositions.forEach((pos, index) => {
            // Pień
            const trunk = MeshBuilder.CreateCylinder(`trunk_${index}`, { height: 1.6, diameter: 0.3 }, scene);
            trunk.position.set(pos.x, 0.8, pos.z);
            trunk.material = trunkMat;

            // Liście (Kula)
            const foliage = MeshBuilder.CreateSphere(`foliage_${index}`, { diameter: 2 }, scene);
            foliage.position.set(pos.x, 2.0, pos.z);
            foliage.material = treeMat;
        });


        // 6. Główna pętla renderująca
        engine.runRenderLoop(() => {
            scene.render();
        });

        // 7. Obsługa skalowania okna
        const handleResize = () => {
            engine.resize();
        };
        window.addEventListener("resize", handleResize);

        // Czyszczenie pamięci przy demontowaniu komponentu
        return () => {
            window.removeEventListener("resize", handleResize);
            scene.dispose();
            engine.dispose();
        };
    }, []);

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            overflow: "hidden",
            margin: 0,
            padding: 0,
            backgroundColor: "#08090c"
        }}>
            {/* PRZYCISK POWROTU */}
            <button
                onClick={onBack}
                style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    zIndex: 10,
                    padding: "14px 22px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    cursor: "pointer",
                    background: "rgba(15, 17, 23, 0.75)",
                    color: "white",
                    backdropFilter: "blur(12px)",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    transition: "all 0.2s ease"
                }}
            >
                ← Wróć do serwisu
            </button>

            {/* CANVAS */}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    outline: "none"
                }}
            />
        </div>
    );
}

export default HotelScene;