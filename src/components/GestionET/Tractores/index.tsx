import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { useTractoresStore, Tractor } from "stores/GestionET/Store_Tractores";
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

function Tractores(): JSX.Element {
  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
  });
  const updateTable = useGeneralesStore((state) => state.updateTable);
  const tableName = "KataliticaTMS_Test.GestionET.Tractores";
  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Nombre Largo", accessor: "nombre_largo" },
    { Header: "Estatus", accessor: "estatus_description" },
    { Header: "Marca Motor", accessor: "marcamotor_description" },
    { Header: "Marca ET", accessor: "marcaet_description" },
    { Header: "Modelo", accessor: "modelo" },
    { Header: "Año", accessor: "año" },
    { Header: "Placas", accessor: "placas" },
    { Header: "Transmisión", accessor: "transmicion" },
    { Header: "Num. ejes", accessor: "num_ejes" },
    { Header: "Producto", accessor: "producto_description" },
    { Header: "Diff. Delantero", accessor: "dif_delantero" },
    { Header: "Diff. Trasero", accessor: "dif_trasero" },
    { Header: "Centro De Costos", accessor: "centrocosto_nombre" },
    { Header: "Serie Cabina", accessor: "serie_cabina" },
    { Header: "Serie Motor", accessor: "serie_motor" },
  ];
  const columnHelper = createMRTColumnHelper<Tractor>();

  const columnsET = columns.map((column) => {
    const accessor = column.accessor as keyof Tractor; // Type assertion

    return {
      ...columnHelper.accessor(accessor, {
        header: column.Header,
        muiEditTextFieldProps: ({
          cell,
          row,
          table,
        }: {
          cell: MRT_Cell<Tractor, string>;
          row: MRT_Row<Tractor>;
          table: MRT_TableInstance<Tractor>;
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

  const getAllMarcas = useTractoresStore((state) => state.readAllMarcas);
  const allCC = useTractoresStore((state) => state.allTractores);
  const postCC = useTractoresStore((state) => state.addMarca);
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

  const handleAddCentroCostos = async (data: Tractor) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const handleExportRows = (rows: MRT_Row<Tractor>[], tableTitle?: string) => {
    const orientation = "portrait"; // portrait or landscape
    const setMaxSize = "10";
    const styles = { pageBreak: "auto" };
    const doc = new jsPDF(orientation);
    const tableData = rows.map((row) => Object.values(row.original));
    const rowData = rows.map((row: any) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
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
          onClick={() => handleExportRows(table.getPrePaginationRowModel().rows, "Tractor info")}
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
    { label: "ID Estatus", dbName: "id_estatus", type: "text" },
    { label: "ID Marca Motor", dbName: "id_marcamotor", type: "text" },
    { label: "ID Marca ET", dbName: "id_marcaet", type: "text" },
    { label: "Modelo", dbName: "modelo", type: "text" },
    { label: "Año", dbName: "año", type: "number" },
    { label: "Placas", dbName: "placas", type: "text" },
    { label: "Transmisión", dbName: "transmicion", type: "text" },
    { label: "Num. ejes", dbName: "num_ejes", type: "text" },
    { label: "ID Producto", dbName: "id_producto", type: "text" },
    { label: "Diff. Delantero", dbName: "dif_delantero", type: "text" },
    { label: "Diff. Trasero", dbName: "dif_trasero", type: "text" },
    { label: "ID Centro De Costos", dbName: "id_centrocosto", type: "text" },
    { label: "Serie Cabina", dbName: "serie_cabina", type: "text" },
    { label: "Serie Motor", dbName: "serie_motor", type: "text" },
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

export default Tractores;
