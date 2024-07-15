import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { useCriterioStore, Criterio } from "stores/Mantenimiento/Store_Criterio";

import { Box, Button, Grid } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useMaterialReactTable, type MRT_Row, createMRTColumnHelper } from "material-react-table";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DataTableNoLayout from "components/Resources/DataTableWithModal/DataTableNoLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function Criterios(): JSX.Element {
  const getAllMarcas = useCriterioStore((state) => state.readAllPuestos);
  const allCC = useCriterioStore((state) => state.allPuestos);
  const postCC = useCriterioStore((state) => state.addPuesto);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);

  useEffect(() => {
    getAllMarcas();
  }, []);

  useEffect(() => {
    fetchUserApi();
  }, []);

  useEffect(() => {
    // Get username from sessionStorage
    const storedUsername = sessionStorage.getItem("userName");

    const user = allUsers.find((u) => u.username === storedUsername);

    if (user) {
      setCurrentUser(user);
      SetAuthorizedToRead(user.readMantenimientoET);
      SetAuthorizedToWrite(user.editMantenimientoEt);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: Criterio) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: Criterio): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const modalInputs = [
    { label: "Clave Criterio", dbName: "cve_ctr", type: "text" },
    { label: "Nombre Corto", dbName: "nom_corto", type: "text" },
    { label: "Descripción", dbName: "descripcion", type: "text" },
    { label: "Prioridad", dbName: "prioridad", type: "text" },
  ];

  const columnHelper = createMRTColumnHelper<Criterio>();

  const columnsET = [
    columnHelper.accessor("id", {
      header: "Id",
    }),
    columnHelper.accessor("descripcion", {
      header: "Descripcion",
    }),

    columnHelper.accessor("cve_ctr", {
      header: "Clave",
    }),
    columnHelper.accessor("prioridad", {
      header: "Prioridad",
    }),
  ];
  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as Criterio));

  const handleExportRows = (rows: MRT_Row<Criterio>[], tableTitle?: string) => {
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

    doc.save("Criterios.pdf");
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
          <Grid container spacing={1}>
            <DataTableNoLayout
              dialogTitle="Añadir nuevo criterio."
              title="Criterios"
              dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
              description="Información general de los criterios"
              buttonEditable={authorizedToWrite}
              modalInputs={modalInputs}
              onAdd={handleAddCentroCostos}
            />
            <Grid item xs={4}>
              <MDButton
                disabled={tableRemolque.getPrePaginationRowModel().rows.length === 0}
                //export all rows, including from the next page, (still respects filtering and sorting)
                onClick={() => handleExportRows(tableRemolque.getPrePaginationRowModel().rows)}
                startIcon={<FileDownloadIcon />}
              >
                Exportar todas las filas
              </MDButton>
            </Grid>
            <Grid item xs={4}>
              <MDButton
                disabled={tableRemolque.getRowModel().rows.length === 0}
                //export all rows as seen on the screen (respects pagination, sorting, filtering, etc.)
                onClick={() => handleExportRows(tableRemolque.getRowModel().rows)}
                startIcon={<FileDownloadIcon />}
              >
                Export filas actuales
              </MDButton>
            </Grid>
          </Grid>
        </DashboardLayout>
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default Criterios;
