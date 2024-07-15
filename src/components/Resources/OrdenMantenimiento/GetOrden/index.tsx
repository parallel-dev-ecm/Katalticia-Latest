import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { gsap } from "gsap";
import { useUsersStore } from "stores/Generales/Store_Users";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import { Alert, Autocomplete } from "@mui/material";
import MDInput from "components/MDInput";
import { ordenReparacionStore } from "stores/Mantenimiento/Store_OrdenReparacion";
import OrdenReparacionInterface from "Interfaces";
import { BLANK_PDF } from "@pdfme/common";
import type { Template } from "@pdfme/common";
import { generate } from "@pdfme/generator";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_Row,
  createMRTColumnHelper,
} from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import {
  KmReq,
  PlanMantenimiento,
  PlanMantenimientoType,
  usePlanesMantenimientoStore,
} from "stores/Mantenimiento/Store_PlanesMantenimiento";
import DataTableNoLayout from "components/Resources/DataTableWithModal/DataTableNoLayout";
import { handleChange } from "Functions/Constants";
import MDButton from "components/MDButton";

import logoCliente from "../logo_Cliente.jpeg";

import { text, image, barcodes } from "@pdfme/schemas";
import { Actividad } from "stores/Mantenimiento/Store_Actividades";
import { co } from "@fullcalendar/core/internal-common";
import DataTableNoLayoutVariation from "components/Resources/DataTableVariation";
import {
  OrdenReparacionActividades,
  useOrdenReparacionActividadesStore,
} from "stores/Mantenimiento/Store_OrdenReparacionActividades";

function GetOrdenMantenimiento(): JSX.Element {
  const getByETAndKms = usePlanesMantenimientoStore((state) => state.getPlanesByETandKms);
  const updateHoras = usePlanesMantenimientoStore((state) => state.updateHoras);
  const updateMecanico = usePlanesMantenimientoStore((state) => state.updateMecanico);
  const getByETAndKmsLessColumns = usePlanesMantenimientoStore(
    (state) => state.getPlanesByETandKmsLessColumns
  );
  const getAllOrdenReparacionActividades = useOrdenReparacionActividadesStore(
    (state) => state.readAllActividades
  );
  const allOrdenReparacionActividades = useOrdenReparacionActividadesStore(
    (state) => state.allActividades
  );
  const getActividadesWithId = useOrdenReparacionActividadesStore(
    (state) => state.getOrdenByPlanMantenimientoId
  );

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const getAllPlanesMantenimiento = usePlanesMantenimientoStore((state) => state.readAllPuestos);
  let id: string = "0";
  const updateOrdenById = ordenReparacionStore((state) => state.updateOrdenById);
  const allOrdenes = ordenReparacionStore((state) => state.allOrdenes);
  const getAllOrdenes = ordenReparacionStore((state) => state.getAllOrdenes);
  const getOrdenById = ordenReparacionStore((state) => state.getOrdenById);
  const [currentOrden, setCurrentOrden] = useState<OrdenReparacionInterface>(
    {} as OrdenReparacionInterface
  );
  const [actividadesWithId, setActividadesWithId] = useState<OrdenReparacionActividades[]>([]);

  const columnHelper = createMRTColumnHelper<PlanMantenimientoType>();
  const columnHelperActividades = createMRTColumnHelper<OrdenReparacionActividades>();

  const columnsET = [
    columnHelper.accessor("id", {
      header: "Id",
    }),
    columnHelper.accessor("descripcion", {
      header: "Descripcion",
    }),

    columnHelper.accessor("actividad", {
      header: "Actividad",
    }),
    columnHelper.accessor("kms_lim", {
      header: "Kms_lim",
    }),

    columnHelper.accessor("dias_lim", {
      header: "Dias Lim",
    }),
    columnHelper.accessor("tol_kms", {
      header: "Total Kms",
    }),
    columnHelper.accessor("tol_dias", {
      header: "Total dias",
    }),
    columnHelper.accessor("tipo_et", {
      header: "Tipo ET",
    }),
    columnHelper.accessor("horas", {
      header: "Horas",
      muiEditTextFieldProps: ({ cell, row, table }) => ({
        onBlur: (event) => {
          console.log("onBlur", event.target.value);
          updateHoras({ id: row.original.id, horas: event.target.value });
          //validate data
          //save data to api and/or rerender table
          // table.setEditingCell(null) is called automatically onBlur internally
        },
      }),
    }),
    columnHelper.accessor("mecanico", {
      header: "Mecanico",
      muiEditTextFieldProps: ({ cell, row, table }) => ({
        onBlur: (event) => {
          console.log("onBlur", event.target.value);
          updateMecanico({ id: row.original.id, mecanico: event.target.value });

          //validate data
          //save data to api and/or rerender table
          // table.setEditingCell(null) is called automatically onBlur internally
        },
      }),
    }),
  ];
  const columnsActividades = [
    columnHelperActividades.accessor("id", { header: "Id" }),
    columnHelperActividades.accessor("compania", { header: "Compania" }),
    columnHelperActividades.accessor("folio", { header: "Folio" }),
    columnHelperActividades.accessor("cve_act", { header: "Cve Act" }),
    columnHelperActividades.accessor("pieza", { header: "Pieza" }),
    columnHelperActividades.accessor("descripcion", { header: "Descripcion" }),
    columnHelperActividades.accessor("identificador", { header: "Identificador" }),
    columnHelperActividades.accessor("mecanico", {
      header: "Mecanico",
      muiEditTextFieldProps: ({ cell, row, table }) => ({
        onBlur: (event) => {
          console.log("onBlur", event.target.value);
          updateMecanico({ id: row.original.id, mecanico: event.target.value });
        },
      }),
    }),
    columnHelperActividades.accessor("tiempo", { header: "Tiempo" }),
    columnHelperActividades.accessor("chek", { header: "Chek" }),
    columnHelperActividades.accessor("fech_rep", { header: "Fech Rep" }),
    columnHelperActividades.accessor("km_reparacion", { header: "Km Reparacion" }),
    columnHelperActividades.accessor("id_planesmantenimiento", {
      header: "Id Planes Mantenimiento",
    }),
    columnHelperActividades.accessor("id_centrocosto", { header: "Id Centro Costo" }),
    columnHelperActividades.accessor("id_taller", { header: "Id Taller" }),
    columnHelperActividades.accessor("id_remolques", { header: "Id Remolques" }),
    columnHelperActividades.accessor("id_tractores", { header: "Id Tractores" }),
    columnHelperActividades.accessor("id_dollys", { header: "Id Dollys" }),
    columnHelperActividades.accessor("id_compania", { header: "Id Compania" }),
    columnHelperActividades.accessor("id_ordenReparacion", { header: "Id Orden Reparacion" }),
    columnHelperActividades.accessor("id_remolque2", { header: "Id Remolque2" }),
  ];

  const handleExportRows = (rows: MRT_Row<PlanMantenimientoType>[], tableTitle?: string) => {
    const orientation = "portrait"; // portrait or landscape
    const setMaxSize = "10";
    const styles = { pageBreak: "auto" };
    const doc = new jsPDF(orientation);
    console.log(rows);
    const tableData = rows.map((row) => Object.values(row.original));
    console.log(columns);
    const tableHeaders = columnsET.map((c) => c.header);
    if (tableTitle) {
      doc.text(tableTitle, 15, 10);
    }

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      styles: {},
      pageBreak: "auto",
      showHead: true,
    });

    doc.save("actividadProgramadas.pdf");
  };
  const handleExportRowsActiviades = (
    rows: MRT_Row<OrdenReparacionActividades>[],
    tableTitle?: string
  ) => {
    const orientation = "portrait"; // portrait or landscape
    const setMaxSize = "10";
    const styles = { pageBreak: "auto" };
    const doc = new jsPDF(orientation);
    console.log(rows);
    const tableData = rows.map((row) => Object.values(row.original));
    console.log(columns);
    const tableHeaders = columnsActividades.map((c) => c.header);
    if (tableTitle) {
      doc.text(tableTitle, 15, 10);
    }

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      styles: {},
      pageBreak: "auto",
      showHead: true,
    });

    doc.save("actividadProgramadas.pdf");
  };

  const el = useRef();
  const mainTitle = useRef();
  const formRef = useRef();
  const tl = gsap.timeline();

  const [segundoRemolque, setSegundoRemolque] = useState<boolean>(false);
  const [remolqueDos, setRemolqueDos] = useState<string>("");
  const [kmSegundoRemolque, setKmSegundoRemolque] = useState<number>(0); // Add the missing property

  const [showActividadesRemolque2, setShowActividadesRemolque2] = useState<boolean>(false);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const fetchUserApi = useUsersStore((state) => state.getUsers);

  const [dollyPlanesMantenimiento, setDollyPlanesMantenimiento] = useState<PlanMantenimiento[]>([]);
  const [tractorPlanesMantenimiento, setTractorPlanesMantenimiento] = useState<PlanMantenimiento[]>(
    []
  );
  const [remolquePlanesMantenimiento, setRemolquePlanesMantenimiento] = useState<
    PlanMantenimiento[]
  >([]);
  const [remolque2PlanesMantenimiento, setRemolque2PlanesMantenimiento] = useState<
    PlanMantenimiento[]
  >([]);

  const [compania, setCompania] = useState<string>(null);
  const [taller, setTaller] = useState<string>(null);
  const [folio, setFolio] = useState<string>(null);
  const [motivo, setMotivo] = useState<string>(null);
  const [estatus, setEstatus] = useState<string>(null);
  const [fech_entra, setFechEntra] = useState<Date>(null);
  const [fech_sal, setFechSal] = useState<Date>(null);
  const [operador, setOperador] = useState<string>(null);
  const [mecanico, setMecanico] = useState<string>(null);
  const [tractor, setTractor] = useState<string>(null);
  const [remolque, setRemolque] = useState<string>(null);
  const [dolly, setDolly] = useState<string>(null);
  const [observacion, setObservacion] = useState<string>(null);
  const [id_centrocosto, setIdCentroCosto] = useState<number>(null);
  const [id_taller, setIdTaller] = useState<number>(null);
  const [id_operador, setIdOperador] = useState<number>(null);
  const [id_remolques, setIdRemolques] = useState<number>(null);
  const [id_tractores, setIdTractores] = useState<number>(null);
  const [id_dollys, setIdDollys] = useState<number>(null);
  const [id_compania, setIdCompania] = useState<number>(1);
  const [cve_act, setCveAct] = useState<string>(null);
  const [descripcion, setDescripcion] = useState<string>(null);
  const [actividad, setActividad] = useState<string>(null);
  const [tiempo, setTiempo] = useState<string>(null);
  const [chek, setChek] = useState<string>(null);
  const [fech_rep, setFechRep] = useState<Date>(null);
  const [km_editable_remolques, setKmEditableRemolques] = useState<number>(null); // Add the missing property
  const [km_remolques, setKmRemolque] = useState<number>(null); // Add the missing property
  const [km_tractores, setKmTractores] = useState<number>(null); // Add the missing property
  const [km_editable_tractores, setKmEditableTractores] = useState<number>(null); // Add the missing property
  const [km_dollys, setKmDollys] = useState<number>(null); // Add the missing property
  const [km_editable_dollys, setKmEditableDollys] = useState<number>(null); // Add the missing property

  const getEtData = async (id: string, orden?: OrdenReparacionInterface) => {
    console.log(currentOrden);
    const dollyReq: KmReq = {
      kms: orden.km_dollys,
      tipo_et: "2",
    };
    const tractorReq: KmReq = {
      kms: orden.km_tractores,
      tipo_et: "1",
    };
    const remolqueReq: KmReq = {
      kms: orden.km_remolques,
      tipo_et: "3",
    };

    const remolque2Req: KmReq = {
      kms: orden.km_remolque2,
      tipo_et: "3",
    };

    if (remolqueReq.kms !== null) {
      console.log("remolqueReq: " + remolqueReq);
      const remolquePlanMantenimiento = await getByETAndKmsLessColumns(remolqueReq);
      setRemolquePlanesMantenimiento(remolquePlanMantenimiento);
    }
    if (tractorReq.kms != null) {
      console.log("tractorReq: " + tractorReq.kms);

      const remolquePlanMantenimiento = await getByETAndKmsLessColumns(tractorReq);
      setTractorPlanesMantenimiento(remolquePlanMantenimiento);
    }
    if (dollyReq.kms != null) {
      console.log("dollyReq: " + dollyReq.kms);

      const remolquePlanMantenimiento = await getByETAndKmsLessColumns(dollyReq);
      setDollyPlanesMantenimiento(remolquePlanMantenimiento);
    }
    if (currentOrden.remolque2 == null) {
      console.log("remolque2Req: " + remolque2Req.kms);

      setShowActividadesRemolque2(false);
      setRemolque2PlanesMantenimiento(null);
    }
    if (remolque2Req.kms != null) {
      console.log("remolque2req: " + remolque2Req.kms);

      const remolquePlanMantenimiento = await getByETAndKmsLessColumns(remolque2Req);
      setRemolque2PlanesMantenimiento(remolquePlanMantenimiento);
      setShowActividadesRemolque2(true);
    }

    const x = await getActividadesWithId(id.toString());

    setActividadesWithId(x);
  };

  const tableActividades = useMaterialReactTable({
    columns: columnsActividades,
    data: actividadesWithId,
    enableRowSelection: false,
    enableEditing: true,
    editDisplayMode: "cell",
    muiTableBodyCellProps: ({ cell, column, table }) => ({
      onClick: () => {
        table.setEditingCell(cell); //set editing cell
        //optionally, focus the text field
        queueMicrotask(() => {
          const textField = table.refs.editInputRefs.current[column.id];
          if (textField) {
            console.log("textField", textField);
            textField.focus();
            textField.select?.();
          }
        });
      },
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={false}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRowsActiviades(table.getPrePaginationRowModel().rows, currentOrden.remolque)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={false}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() =>
            handleExportRowsActiviades(table.getRowModel().rows, currentOrden.remolque)
          }
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });

  const tableRemolque = useMaterialReactTable({
    columns: columnsET,
    data: remolquePlanesMantenimiento,
    enableRowSelection: false,
    enableEditing: true,
    editDisplayMode: "cell",
    muiTableBodyCellProps: ({ cell, column, table }) => ({
      onClick: () => {
        table.setEditingCell(cell); //set editing cell
        //optionally, focus the text field
        queueMicrotask(() => {
          const textField = table.refs.editInputRefs.current[column.id];
          if (textField) {
            console.log("textField", textField);
            textField.focus();
            textField.select?.();
          }
        });
      },
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={false}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, currentOrden.remolque)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={false}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows, currentOrden.remolque)}
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });
  const tableDolly = useMaterialReactTable({
    columns: columnsET,
    data: dollyPlanesMantenimiento,
    enableRowSelection: false,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={false}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, currentOrden.dolly)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={false}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows, currentOrden.dolly)}
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });
  const tableTractor = useMaterialReactTable({
    columns: columnsET,
    data: tractorPlanesMantenimiento,
    enableRowSelection: false,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={false}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, currentOrden.tractor)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={false}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });
  const tableRemolque2 = useMaterialReactTable({
    columns: columnsET,
    data: remolque2PlanesMantenimiento,
    enableRowSelection: false,
    renderTopToolbarCustomActions: ({ table }) => (
      <Box
        sx={{
          display: "flex",
          gap: "16px",
          padding: "8px",
          flexWrap: "wrap",
        }}
      >
        <Button
          disabled={false}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, currentOrden.remolque2)
          }
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={false}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });

  const updateOrden = async () => {
    const ordenReparacion: OrdenReparacionInterface = {
      id: currentOrden.id,
      compania: currentOrden.compania,
      taller: currentOrden.taller,
      folio,
      motivo,
      estatus,
      fech_entra,
      fech_sal,
      operador,
      mecanico,
      tractor,
      remolque,
      dolly,
      km_remolques,
      km_editable_remolques,
      km_dollys,
      km_editable_dollys,
      observacion,
      id_actividades: currentOrden.id_actividades,
      id_centrocosto,
      id_taller,
      id_operador,
      id_remolques,
      id_tractores,
      id_dollys,
      id_compania,
      cve_act,
      descripcion,
      actividad,
      tiempo,
      chek,
      fech_rep,
      km_tractores, // Add the missing property
      km_editable_tractores, // Add the missing property
      remolque2: remolqueDos,
      km_remolque2: kmSegundoRemolque,
    };

    const res = await updateOrdenById(ordenReparacion);
    console.log("res", res);
  };

  const printOrden = async () => {
    const template: Template = {
      basePdf: BLANK_PDF,
      schemas: [
        {
          title: {
            type: "text",
            position: {
              x: 62.43,
              y: 16.14,
            },
            width: 69.08,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 24,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_folio: {
            type: "text",
            position: {
              x: 151.08,
              y: 32.01,
            },
            width: 17.22,
            height: 6.29,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          folio: {
            type: "text",
            position: {
              x: 171.17,
              y: 32.24,
            },
            width: 21.98,
            height: 5.77,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
          },
          t_compañia: {
            type: "text",
            position: {
              x: 19.85,
              y: 54.24,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_taller: {
            type: "text",
            position: {
              x: 20.06,
              y: 70.33,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          compañia: {
            type: "text",
            position: {
              x: 54.99,
              y: 54.45,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          taller: {
            type: "text",
            position: {
              x: 54.14,
              y: 70.54,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_motivo: {
            type: "text",
            position: {
              x: 19.74,
              y: 88.8,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          motivo: {
            type: "text",
            position: {
              x: 53.82,
              y: 89.01,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          "t_motivo copy": {
            type: "text",
            position: {
              x: 20.22,
              y: 107.27,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          "motivo copy": {
            type: "text",
            position: {
              x: 54.29,
              y: 107.48,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_fech_entra: {
            type: "text",
            position: {
              x: 115.41,
              y: 54.03,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          fech_entra: {
            type: "text",
            position: {
              x: 148.95,
              y: 53.71,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_fech_salida: {
            type: "text",
            position: {
              x: 114.03,
              y: 69.59,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          fech_salida: {
            type: "text",
            position: {
              x: 148.1,
              y: 69.27,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_operador: {
            type: "text",
            position: {
              x: 113.71,
              y: 89.64,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          operador: {
            type: "text",
            position: {
              x: 147.78,
              y: 89.32,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_mecanico: {
            type: "text",
            position: {
              x: 113.39,
              y: 106.25,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          mecanico: {
            type: "text",
            position: {
              x: 147.46,
              y: 105.93,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_tractor: {
            type: "text",
            position: {
              x: 20.43,
              y: 123.88,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          tractor: {
            type: "text",
            position: {
              x: 54.5,
              y: 124.09,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_dolly: {
            type: "text",
            position: {
              x: 20.64,
              y: 139.97,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          dolly: {
            type: "text",
            position: {
              x: 54.71,
              y: 140.18,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_remolque: {
            type: "text",
            position: {
              x: 112.93,
              y: 122.98,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          remolque: {
            type: "text",
            position: {
              x: 147,
              y: 123.19,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_remolque2: {
            type: "text",
            position: {
              x: 113.14,
              y: 138.54,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          remolque2: {
            type: "text",
            position: {
              x: 147.21,
              y: 138.75,
            },
            width: 29.39,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          t_observacion: {
            type: "text",
            position: {
              x: 21.12,
              y: 156.06,
            },
            width: 28.07,
            height: 10,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
          observacion: {
            type: "text",
            position: {
              x: 20.78,
              y: 172.41,
            },
            width: 167.24,
            height: 23.23,
            rotate: 0,
            alignment: "left",
            verticalAlignment: "top",
            fontSize: 13,
            lineHeight: 1,
            characterSpacing: 0,
            fontColor: "#000000",
            backgroundColor: "",
            opacity: 1,
            fontName: "Roboto",
          },
        },
      ],
    };

    const plugins = { text, image, qrcode: barcodes.qrcode };

    const inputs = [
      {
        title: "Orden Reparación ",
        t_folio: "Folio:",
        folio: currentOrden.folio,
        t_compañia: "Compañia:",
        t_taller: "Taller:",
        compañia: currentOrden.compania,
        taller: currentOrden.taller || "",
        t_motivo: "Motivo:",
        motivo: currentOrden.motivo ? currentOrden.motivo : "",
        "t_motivo copy": "Estatus:",
        "motivo copy": currentOrden.estatus ? currentOrden.estatus : "",
        t_fech_entra: "Fecha Entrada:",
        fech_entra: currentOrden.fech_entra.toString() || " ",
        t_fech_salida: "Fecha Salida:",
        fech_salida: currentOrden.fech_sal ? currentOrden.fech_sal.toString() : " ",
        t_operador: "Operador:",
        operador: currentOrden.operador || "",
        t_mecanico: "Mecanico:",
        mecanico: currentOrden.mecanico || "",
        t_tractor: "Tractor:",
        tractor: currentOrden.tractor || "",
        t_dolly: "Dolly:",
        dolly: currentOrden.dolly || "",
        t_remolque: "Remolque:",
        remolque: currentOrden.remolque || "",
        t_remolque2: "Remolque 2:",
        remolque2: currentOrden.remolque2 || "",
        t_observacion: "Observación:",
        observacion: currentOrden.observacion || "",
      },
    ];
    generate({ template, inputs, plugins }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));

      //fs.writeFileSync(path.join(__dirname, `test.pdf`), pdf);
    });
  };

  useEffect(() => {
    fetchUserApi();
  }, []);
  useEffect(() => {
    // Get username from sessionStorage
    const storedUsername = sessionStorage.getItem("userName");

    const user = allUsers.find((u) => u.username === storedUsername);

    if (user) {
      SetAuthorizedToRead(user.readMantenimientoET);
      SetAuthorizedToWrite(user.editMantenimientoEt);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  useLayoutEffect(() => {
    if (!loading) {
      const gtx = gsap.context();
    }
    const ctx = gsap.context(() => {
      const mainBoxTween = gsap.fromTo(mainTitle.current, { opacity: 0 }, { opacity: 1, delay: 1 });
      tl.add(mainBoxTween);

      const signInTween = gsap.fromTo(formRef.current, { opacity: 0 }, { opacity: 1 });
      tl.add(signInTween);
    }, el);

    // cleanup function will be called when component is removed
    return () => {
      ctx.revert(); // animation cleanup!!
    };
  }, []);

  // get the data from the stores
  useEffect(() => {
    const fetchData = async () => {
      // Example asynchronous operation
      await getAllPlanesMantenimiento();
      await getAllOrdenes();
      //await getEtData();
      await getAllOrdenReparacionActividades();
      // Mark the asynchronous operations as complete
    };

    fetchData();
  }, []);
  useEffect(() => {
    setActividad(currentOrden.actividad);
    setChek(currentOrden.chek);
    setCompania(currentOrden.compania);
    setCveAct(currentOrden.cve_act);
    setDescripcion(currentOrden.descripcion);
    setEstatus(currentOrden.estatus);
    setFechEntra(currentOrden.fech_entra);
    setFechRep(currentOrden.fech_rep);
    setFechSal(currentOrden.fech_sal);
    setFolio(currentOrden.folio);
    setKmDollys(currentOrden.km_dollys);
    setKmRemolque(currentOrden.km_remolques);
    setKmTractores(currentOrden.km_tractores);
    setMecanico(currentOrden.mecanico);
    setMotivo(currentOrden.motivo);
    setObservacion(currentOrden.observacion);
    setOperador(currentOrden.operador);
    setRemolque(currentOrden.remolque);
    setTractor(currentOrden.tractor);
    setTaller(currentOrden.taller);
    setDolly(currentOrden.dolly);
    setTiempo(currentOrden.tiempo);
    setEstatus(currentOrden.estatus);
    setFechSal(currentOrden.fech_sal);
    setFechEntra(currentOrden.fech_entra);
    setFechRep(currentOrden.fech_rep);
    setKmEditableDollys(currentOrden.km_editable_dollys);
    setKmEditableRemolques(currentOrden.km_editable_remolques);
    setKmEditableTractores(currentOrden.km_editable_tractores);
    setRemolqueDos(currentOrden.remolque2);
    setKmSegundoRemolque(currentOrden.km_remolque2);
    setIdCentroCosto(currentOrden.id_centrocosto);
    setIdCompania(currentOrden.id_compania);
    setIdDollys(currentOrden.id_dollys);
    setIdOperador(currentOrden.id_operador);
    setIdRemolques(currentOrden.id_remolques);
    setIdTaller(currentOrden.id_taller);
    setIdTractores(currentOrden.id_tractores);
    setSegundoRemolque(currentOrden.remolque2 !== null);
  }, [currentOrden]);

  const generateColumns = (
    data: OrdenReparacionInterface
  ): { Header: string; accessor: string }[] => {
    if (data == null) return [];
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const generateColumnsPlanMantenimiento = (
    data: PlanMantenimiento
  ): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };

  const columns = generateColumns(
    allOrdenes != null && allOrdenes.length > 0 ? allOrdenes[0] : ({} as OrdenReparacionInterface)
  );

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }} ref={el}>
      {
        <>
          <MDBox p={3} ref={mainTitle}>
            <MDTypography variant="h5">Ordenes de Reparación</MDTypography>
          </MDBox>
          {true && (
            <MDBox component="form" pb={3} px={3} ref={formRef}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <Autocomplete
                    options={allOrdenes.map((option) => option.id.toString())}
                    onChange={async (event, newValue) => {
                      console.log(newValue);
                      if (newValue) {
                        id = newValue.toString();
                        const orden = await getOrdenById(newValue.toString());
                        console.log(orden);
                        if (orden.remolque2 == null) {
                          setShowActividadesRemolque2(false);
                        }
                        await setCurrentOrden(orden);
                        console.log("currentorden: ");
                        console.log(currentOrden);

                        await getEtData(id, orden);
                      }
                    }}
                    renderInput={(params) => (
                      <FormField
                        variant="outlined"
                        {...params}
                        label="Id Orden Reparación"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  {currentOrden.compania !== null && (
                    <FormField
                      variant="outlined"
                      label="Compañia"
                      disabled={true}
                      placeholder={currentOrden.compania}
                      onChange={handleChange(setCompania)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={4}>
                  {currentOrden.taller !== null && (
                    <FormField
                      variant="outlined"
                      label="Taller"
                      disabled={true}
                      value={currentOrden.taller}
                      onChange={handleChange(setTaller)}
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={4}>
                  {currentOrden.newFolio !== null && (
                    <FormField
                      disabled={true}
                      variant="outlined"
                      label="Folio"
                      placeholder={currentOrden.newFolio}
                      //onChange={handleChange(setFolio)}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {currentOrden.motivo !== null && (
                    <FormField
                      disabled={disabled}
                      variant="outlined"
                      label="Motivo"
                      placeholder={currentOrden.motivo}
                      onChange={handleChange(setMotivo)}
                    />
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  {currentOrden.estatus !== null && (
                    <FormField
                      disabled={disabled}
                      variant="outlined"
                      label="Estatus"
                      placeholder={currentOrden.estatus}
                      onChange={handleChange(setEstatus)}
                    />
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    {currentOrden.fech_entra != null && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Fecha Entrada"
                            placeholder={currentOrden.fech_entra}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const dateString = e.target.value;

                              // Assuming the date string is in the format "YYYY-MM-DD"
                              const formattedDate = dateString
                                ? new Date(dateString + "T00:00:00")
                                : null;
                              setFechEntra(formattedDate);
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.fech_sal != null && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Fecha Salida"
                            placeholder={currentOrden.fech_sal}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const dateString = e.target.value;

                              // Assuming the date string is in the format "YYYY-MM-DD"
                              const formattedDate = dateString
                                ? new Date(dateString + "T00:00:00")
                                : null;
                              setFechSal(formattedDate);
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.fech_rep != null && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Fecha Rep  "
                            placeholder={currentOrden.fech_rep}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const dateString = e.target.value;

                              // Assuming the date string is in the format "YYYY-MM-DD"
                              const formattedDate = dateString
                                ? new Date(dateString + "T00:00:00")
                                : null;
                              setFechRep(formattedDate);
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12} sm={6}>
                      <FormField
                        variant="outlined"
                        label="Opearador"
                        disabled={true}
                        placeholder={currentOrden.operador}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange(setOperador)}
                      />
                    </Grid>

                    {currentOrden.mecanico != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Mecanico"
                            placeholder={currentOrden.mecanico}
                            onChange={handleChange(setMecanico)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.id_tractores != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            variant="outlined"
                            label="Tractor"
                            disabled={disabled}
                            placeholder={currentOrden.tractor}
                            onChange={handleChange(setTractor)}
                            InputLabelProps={{ shrink: true }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={true}
                            placeholder={currentOrden.km_tractores}
                            label="Km Totales"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setKmTractores(parseInt(e.target.value));
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.id_remolques != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Remolque"
                            placeholder={currentOrden.remolque}
                            onChange={handleChange(setRemolque)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={true}
                            placeholder={currentOrden.km_remolques}
                            variant="outlined"
                            label="Km Totales"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setKmRemolque(parseInt(e.target.value));
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.remolque2 && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Remolque 2"
                            placeholder={currentOrden.remolque2}
                            onChange={handleChange(setRemolqueDos)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={true}
                            placeholder={currentOrden.km_remolque2}
                            variant="outlined"
                            label="Km Totales"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setKmSegundoRemolque(parseInt(e.target.value));
                            }}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.id_dollys != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Dolly"
                            placeholder={currentOrden.dolly}
                            onChange={handleChange(setDolly)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={true}
                            placeholder={currentOrden.km_dollys}
                            variant="outlined"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                              setKmDollys(parseInt(e.target.value));
                            }}
                            label="Km Totales"
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.observacion != null && (
                      <>
                        <Grid item xs={12} sm={12}>
                          <MDInput
                            style={{ width: "100%" }}
                            disabled={disabled}
                            multiline
                            variant="outlined"
                            placeholder={currentOrden.observacion}
                            onChange={handleChange(setObservacion)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.actividad != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Actividad"
                            placeholder={currentOrden.actividad}
                            onChange={handleChange(setActividad)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.descripcion != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Descripcion"
                            placeholder={currentOrden.descripcion}
                            onChange={handleChange(setDescripcion)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.cve_act != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Clave Actividad"
                            placeholder={currentOrden.cve_act}
                            onChange={handleChange(setCveAct)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.chek != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Chek"
                            placeholder={currentOrden.chek}
                            onChange={handleChange(setChek)}
                          />
                        </Grid>
                      </>
                    )}

                    {currentOrden.tiempo != null && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <FormField
                            disabled={disabled}
                            variant="outlined"
                            label="Tiempo"
                            placeholder={currentOrden.tiempo}
                            onChange={handleChange(setTiempo)}
                          />
                        </Grid>
                      </>
                    )}

                    {/* <Grid item xs={12} sm={12}>
                          <DataTableNoLayoutVariation
                            dataTableData={{ rows: allOrdenes, columns: columns }} // Pass the state to the prop.
                            title="Ordenes Creadas"
                            description="Ordenes Creadas a la fecha"
                            buttonText="Añadir Orden"
                            buttonEditable={authorizedToWrite}
                          />
                        </Grid> */}
                    {currentOrden.id_tractores != null &&
                      tractorPlanesMantenimiento != null &&
                      currentOrden.km_tractores != null && (
                        <>
                          <Grid item xs={12} sm={12}>
                            <MDTypography>Actividades Tractor</MDTypography>
                          </Grid>
                          <Grid item xs={12} sm={12}>
                            <MaterialReactTable table={tableTractor} />
                          </Grid>
                        </>
                      )}
                    {currentOrden.id_dollys != null && currentOrden.km_dollys != null && (
                      <>
                        <Grid item xs={12} sm={12}>
                          <MDTypography>Actividades Dolly</MDTypography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <MaterialReactTable table={tableDolly} />
                        </Grid>
                      </>
                    )}
                    {currentOrden.remolque != null && currentOrden.km_remolques != null && (
                      <>
                        <Grid item xs={12} sm={12}>
                          <MDTypography>Actividades Remolque</MDTypography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <MaterialReactTable table={tableRemolque} />
                        </Grid>
                      </>
                    )}
                    {currentOrden.km_remolque2 != null && (
                      <>
                        <Grid item xs={12} sm={12}>
                          <MDTypography>Actividades Remolque 2</MDTypography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <MaterialReactTable table={tableRemolque2} />
                        </Grid>
                      </>
                    )}
                    {actividadesWithId != null && actividadesWithId.length > 0 && (
                      <>
                        <Grid item xs={12} sm={12}>
                          <MDTypography>Actividades Orden Reparacion</MDTypography>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <MaterialReactTable table={tableActividades} />
                        </Grid>
                      </>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <MDButton
                    disabled={currentOrden.estatus === "Finalizada" || !authorizedToWrite}
                    onClick={updateOrden}
                    variant="gradient"
                    color="dark"
                  >
                    Guardar Cambios
                  </MDButton>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <MDButton onClick={printOrden} variant="gradient" color="dark">
                    Imprimir Orden
                  </MDButton>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <DataTableNoLayoutVariation
                    dataTableData={{ rows: allOrdenes, columns: columns }} // Pass the state to the prop.
                    title="Ordenes Creadas"
                    description="Ordenes Creadas a la fecha"
                    buttonText="Añadir Orden"
                    buttonEditable={authorizedToWrite}
                  />
                </Grid>
              </Grid>
            </MDBox>
          )}
          {!authorizedToRead && <Alert severity="error">Sin permisos.</Alert>}
        </>
      }
    </Card>
  );
}

export default GetOrdenMantenimiento;
