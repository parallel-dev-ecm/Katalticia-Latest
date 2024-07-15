import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import {
  usePlanesMantenimientoStore,
  PlanMantenimiento,
  PlanMantenimientoDetalles,
} from "stores/Mantenimiento/Store_PlanesMantenimiento";

import { Box, Button, Grid } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMaterialReactTable, type MRT_Row, createMRTColumnHelper } from "material-react-table";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTableNoLayout from "components/Resources/DataTableWithModal/DataTableNoLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function PlanesMantenimiento(): JSX.Element {
  const getAllMarcas = usePlanesMantenimientoStore((state) => state.readAllPuestos);
  const allCC = usePlanesMantenimientoStore((state) => state.allPuestos);
  const getAllDetalles = usePlanesMantenimientoStore((state) => state.readAllPuestosDetalles);
  const allDetalles = usePlanesMantenimientoStore((state) => state.allPuestosDetalles);
  const postCC = usePlanesMantenimientoStore((state) => state.addPuesto);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);

  useEffect(() => {
    getAllMarcas();
    getAllDetalles();
  }, []);

  useEffect(() => {
    fetchUserApi();
  }, []);

  useEffect(() => {
    // Get username from sessionStorage
    const storedUsername = sessionStorage.getItem("userName");

    console.log(storedUsername);
    const user = allUsers.find((u) => u.username === storedUsername);
    console.log(allUsers);

    if (user) {
      console.log(user);
      setCurrentUser(user);
      SetAuthorizedToRead(user.readMantenimientoET);
      SetAuthorizedToWrite(user.editMantenimientoEt);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: PlanMantenimiento) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: PlanMantenimiento): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const generateColumnsDetalles = (
    data: PlanMantenimientoDetalles
  ): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };

  const modalInputs = [
    { label: "Clave plan", dbName: "cve_plan", type: "text" },
    { label: "Descripción", dbName: "descripcion", type: "text" },
    { label: "Id Actividad", dbName: "id_actividades", type: "number" },
    { label: "Clave Actividad Plan", dbName: "cve_actvplan", type: "text" },
    { label: "Km's limite.", dbName: "kms_lim", type: "text" },
    { label: "Dias limite.", dbName: "dias_lim", type: "text" },
    { label: "Total Km's.", dbName: "tol_kms", type: "text" },
    { label: "Total Dias.", dbName: "tol_dias", type: "text" },
    { label: "Tipo ET.", dbName: "tipo_et", type: "text" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as PlanMantenimiento));
  const columnsDetalles = generateColumnsDetalles(
    allDetalles.length > 0 ? allDetalles[0] : ({} as PlanMantenimientoDetalles)
  );
  const columnHelper = createMRTColumnHelper<PlanMantenimiento>();

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
  ];

  const handleExportRows = (rows: MRT_Row<PlanMantenimiento>[], tableTitle?: string) => {
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

  const tableRemolque = useMaterialReactTable({
    columns: columnsET,
    data: allCC,
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
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Exportar todas las filas
        </Button>
        <Button
          disabled={table.getRowModel().rows.length === 0}
          //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
          onClick={() => handleExportRows(table.getRowModel().rows)}
          startIcon={<FileDownloadIcon />}
        >
          Export filas actuales
        </Button>
      </Box>
    ),
  });

  return (
    <>
      {authorizedToRead && (
        <DashboardLayout>
          <DashboardNavbar />
          <DataTableNoLayout
            title="Detalles de Mantenimiento"
            dataTableData={{ rows: allDetalles, columns: columnsDetalles }} // Pass the state to the prop.
            description="Detalles de los planes de mantenimiento"
            buttonEditable={false}
          />
          <DataTableNoLayout
            dialogTitle="Añadir nuevo plan de mantenimiento."
            title="Planes de Mantenimiento"
            dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
            description="Información general de los planes de mantenimiento"
            buttonEditable={authorizedToWrite}
            modalInputs={modalInputs}
            buttonText="Add new"
            onAdd={handleAddCentroCostos}
          />
        </DashboardLayout>
      )}

      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default PlanesMantenimiento;
