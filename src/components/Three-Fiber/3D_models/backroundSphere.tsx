import React from "react";
import { OrbitControls, useFBX, Text, Sphere, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";

type Props = {};

function BackgroundSphere({}: Props) {
  const texture = useTexture("/machine_shop_02_4k.exr");

  return (
    <Canvas>
      <Sphere scale={10}>
        <meshStandardMaterial side={THREE.DoubleSide} map={texture} />
      </Sphere>
    </Canvas>
  );
}

export default BackgroundSphere;
