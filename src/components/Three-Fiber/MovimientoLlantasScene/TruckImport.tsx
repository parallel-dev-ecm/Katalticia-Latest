import React, { Suspense } from "react";
import { OrbitControls, useFBX, Text, Sphere, useTexture, Environment } from "@react-three/drei";
type Props = {};
import * as THREE from "three";

function TruckImport({}: Props) {
  const url = "/Truck_Body_baseColor.png";

  const pathFBX = require(".././3D_models/militaryTruck.fbx");
  const texture = useTexture(url);
  let fbx = useFBX(pathFBX);

  return (
    <mesh position={[0, 0, -3]} rotation={[0, -90, 0]}>
      <Suspense>
        <mesh>
          <primitive object={fbx} />
          <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 90, 0]}
          position={[3, 0, -4]}
          onClick={() => console.log("click")}
        >
          1
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 90, 0]}
          position={[3, 0, -2]}
          onClick={() => console.log("click")}
        >
          2
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 90, 0]}
          position={[3, 0, 2]}
          onClick={() => console.log("click")}
        >
          3
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 90, 0]}
          position={[3, 0, 4]}
          onClick={() => console.log("click")}
        >
          4
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -90, 0]}
          position={[-2, 0, 4]}
          onClick={() => console.log("click")}
        >
          5
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -90, 0]}
          position={[-2, 0, 2]}
          onClick={() => console.log("click")}
        >
          6
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -90, 0]}
          position={[-2, 0, -2]}
          onClick={() => console.log("click")}
        >
          7
        </Text>
        <Text
          color="black"
          anchorX="center"
          anchorY="middle"
          rotation={[0, -90, 0]}
          position={[-2, 0, -4]}
          onClick={() => console.log("click")}
        >
          8
        </Text>
      </Suspense>

      <meshStandardMaterial color={"rgb(255,255,255)"} />
    </mesh>
  );
}

export default TruckImport;
