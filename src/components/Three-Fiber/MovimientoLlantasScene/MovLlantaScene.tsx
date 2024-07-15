import { OrbitControls, useFBX, Text, Sphere, useTexture, Environment } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import BackgroundSphere from "../3D_models/backroundSphere";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import TruckImport from "./TruckImport";
import { MovimientoLlantas, useMovimientoLlantasStore } from "stores/Llantas/MovimientoLlantas";
import {
  useMaterialReactTable,
  type MRT_Row,
  type MRT_TableInstance,
  type MRT_Cell,
  createMRTColumnHelper,
} from "material-react-table";
import { useGeneralesStore } from "stores/Generales/Store_Generales";
import { UpdateTableDynamically } from "Interfaces";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import EditableDataTable from "components/Resources/EditableDataTable";
import { mkConfig, generateCsv, download } from "export-to-csv";
type Props = {};

function MovLlantasScene({}: Props) {
  const allData = useMovimientoLlantasStore((state) => state.allData);
  const readAllData = useMovimientoLlantasStore((state) => state.readAllData);
  const updateTable = useGeneralesStore((state) => state.updateTable);

  const tableName = "KataliticaTMS_Test.Llantas.MovimientoLlantas";
  const columnHelper = createMRTColumnHelper<MovimientoLlantas>();
  const path = require(".././3D_models/TruckNoBox.glb");
  const exr = require(".././3D_models/machineShop.hdr");
  const pathFBX = require(".././3D_models/militaryTruck.fbx");
  // const colorMap = useLoader(TextureLoader, ".././3D_models/Truck_Body_baseColor.png");

  let fbx = useFBX(pathFBX);


  useEffect(() => {});

  return (
    <Canvas>
      <Environment files={exr} background={true} />
      <OrbitControls position={[0, 0, -3]} enablePan={false} />

      <ambientLight intensity={1} />
      <TruckImport />

      {/* <mesh position={[0, 0, -3]} rotation={[0, -90, 0]}>
        <Suspense>
          <mesh>
            <primitive object={fbx} />
            <meshStandardMaterial map={texture} />
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
      </mesh> */}
    </Canvas>
  );
}

export default MovLlantasScene;
