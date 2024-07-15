import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { Remolque, useRemolquesStore } from "stores/GestionET/Store_Remolques";
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
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

function Remolques(): JSX.Element {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
  });
  const updateTable = useGeneralesStore((state) => state.updateTable);
  const tableName = "KataliticaTMS_Test.GestionET.Remolques";

  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Nombre Largo", accessor: "nombre_largo" },
    { Header: "Modelo", accessor: "modelo" },
    { Header: "Año", accessor: "año" },
    { Header: "Serie", accessor: "serie" },
    { Header: "Placas", accessor: "placas" },
    { Header: "PQ", accessor: "pq" },
    { Header: "Num. ejes", accessor: "num_ejes" },
    { Header: "Capacidad de Litros", accessor: "capacidad_litros" },
    { Header: "Centro De Costos", accessor: "centrocosto_nombre" },
    { Header: "Estatus", accessor: "estatus_description" },
    { Header: "Marca ET", accessor: "marcaet_description" },
  ];
  const columnHelper = createMRTColumnHelper<Remolque>();

  const columnsET = columns.map((column) => {
    const accessor = column.accessor as keyof Remolque; // Type assertion

    return {
      ...columnHelper.accessor(accessor, {
        header: column.Header,
        muiEditTextFieldProps: ({
          cell,
          row,
          table,
        }: {
          cell: MRT_Cell<Remolque, string>;
          row: MRT_Row<Remolque>;
          table: MRT_TableInstance<Remolque>;
        }) => ({
          onBlur: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
            const req: UpdateTableDynamically = {
              id: row.original.id,
              tableName: tableName,
              value: event.target.value,
              columnName: column.accessor,
            };
            updateTable(req);
            //validate data
            //save data to api and/or rerender table
            // table.setEditingCell(null) is called automatically onBlur internally
          },
        }),
      }),
    };
  });

  const getAllMarcas = useRemolquesStore((state) => state.readAllRemolques);
  const allCC = useRemolquesStore((state) => state.allRemolques);
  const postCC = useRemolquesStore((state) => state.addRemolque);
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
      SetAuthorizedToRead(user.readET);
      SetAuthorizedToWrite(user.editTransporte);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: Remolque) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };

  const handleExportRows = (rows: MRT_Row<Remolque>[], tableTitle?: string) => {
    const orientation = "portrait"; // portrait or landscape
    const setMaxSize = "10";
    const styles = { pageBreak: "auto" };
    const doc = new jsPDF(orientation);
    const rowData = rows.map((row: any) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
    const tableData = rows.map((row) => Object.values(row.original));
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

    doc.save("Dolly.pdf");
  };

  const table = useMaterialReactTable({
    columns: columnsET,
    data: allCC,
    enableRowSelection: false,
    editDisplayMode: "cell",
    enableEditing: true,

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
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows, "Remolque info")}
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
  const modalInputs = [
    { label: "Clave", dbName: "clave", type: "text" },
    { label: "Nombre Largo", dbName: "nombre_largo", type: "text" },
    { label: "Modelo", dbName: "modelo", type: "text" },
    { label: "Año", dbName: "año", type: "number" },
    { label: "Serie", dbName: "serie", type: "text" },
    { label: "Num. ejes", dbName: "num_ejes", type: "text" },
    { label: "Placas", dbName: "placas", type: "text" },
    { label: "Capacidad en Litros", dbName: "capacidad_litros", type: "text" },
    { label: "PQ", dbName: "pq", type: "text" },
    { label: "ID Producto", dbName: "id_producto", type: "text" },
    { label: "ID Centro De Costos", dbName: "id_centrocosto", type: "text" },
    { label: "ID Estatus", dbName: "id_estatus", type: "text" },
    { label: "ID Marca ET", dbName: "id_marcaet", type: "text" },
  ];
  return (
    <>
      {authorizedToRead && (
        <EditableDataTable
          title="Tractores"
          table={table}
          onAdd={handleAddCentroCostos}
          modalInputs={modalInputs}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default Remolques;
