import {
  OrbitControls,
  useFBX,
  useGLTF,
  Gltf,
  PresentationControls,
  Clouds,
  Cloud,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import * as THREE from "three";

type Props = {};

function TruckScene({}: Props) {
  const path = require("./3D_models/TruckNoBox.glb");

  return (
    <Canvas>
      <OrbitControls position={[0, 0, -3]} enablePan={false} />

      <ambientLight intensity={1} />

      <mesh position={[0, 0, -3]} rotation={[0, -90, 0]}>
        {/* <mesh position={[0, 5, 2]}>
            <Clouds material={THREE.MeshBasicMaterial}>
              <Cloud
                segments={30}
                concentrate="inside"
                growth={1}
                speed={1}
                fade={1}
                opacity={0.5}
                bounds={[1, 3, 1]}
                volume={1}
                color="gray"
              />
            </Clouds>
          </mesh> */}
        <Suspense>
          <Gltf src={path} />
        </Suspense>

        <meshStandardMaterial color={"rgb(255,255,255)"} />
      </mesh>
    </Canvas>
  );
}

export default TruckScene;
