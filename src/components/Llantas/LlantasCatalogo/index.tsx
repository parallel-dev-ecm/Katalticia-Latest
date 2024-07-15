import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import { MarcaET, useMarcasETStore } from "stores/GestionET/Store_MarcasET";
import Unauthorized from "components/Resources/Unauthorized";
import { useMarcasLlantasStore } from "stores/Llantas/Marcas";
import { LlantasCatalogoInterface, useLlantasCatalogoStore } from "stores/Llantas/LlantasCatalogo";
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

function LlantasCatalogo(): JSX.Element {
  const updateTable = useGeneralesStore((state) => state.updateTable);
  const tableName = "KataliticaTMS_Test.Llantas.Llantas";
  const columnHelper = createMRTColumnHelper<LlantasCatalogoInterface>();

  const generateColumns = (
    data: LlantasCatalogoInterface
  ): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };

  const getAllMarcas = useLlantasCatalogoStore((state) => state.readAllData);
  const allCC = useLlantasCatalogoStore((state) => state.allData);
  const postCC = useLlantasCatalogoStore((state) => state.addData);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const readPath = "/llantas/getAllLlantasCatalogo";
  const pushPath = "/llantas/postLlantasCatalogo";

  useEffect(() => {
    getAllMarcas(readPath);
    console.log(allCC);
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

  const handleAddCentroCostos = async (data: LlantasCatalogoInterface) => {
    const isSuccess = await postCC(data, pushPath);
    console.log(data);
    if (isSuccess) {
      //document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };

  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as LlantasCatalogoInterface));

  const columnsET = columns.map((column) => {
    const accessor = column.accessor as keyof LlantasCatalogoInterface; // Type assertion

    return {
      ...columnHelper.accessor(accessor, {
        header: column.Header,
        muiEditTextFieldProps: ({
          cell,
          row,
          table,
        }: {
          cell: MRT_Cell<LlantasCatalogoInterface, string>;
          row: MRT_Row<LlantasCatalogoInterface>;
          table: MRT_TableInstance<LlantasCatalogoInterface>;
        }) => ({
          onBlur: (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement, Element>) => {
            const stringArray: string[] = ["milimetros", "kms_ant", "kms_act", "presion"];
            console.log(column.accessor);
            const isInArray: boolean = stringArray.includes(column.accessor);

            if (isInArray) {
              const req: UpdateTableDynamically = {
                id: row.original.id,
                tableName: tableName,
                value: event.target.value,
                columnName: column.accessor,
              };
              updateTable(req);
            } else {
              console.log("not updated");
              return;
            }

            //validate data
            //save data to api and/or rerender table
            // table.setEditingCell(null) is called automatically onBlur internally
          },
        }),
      }),
    };
  });

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<LlantasCatalogoInterface>[], tableTitle?: string) => {
    const orientation = "landscape"; // portrait or landscape
    const doc = new jsPDF(orientation);
    const tableData = rows.map((row) => Object.values(row.original));
    const tableHeaders = columnsET.map((c) => c.header);
    const rowData = rows.map((row: any) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
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
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, "Información Llantas")
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

  const modalInputs = [
    { label: "Clave", dbName: "clavell", type: "text" },
    { label: "Clave ET", dbName: "clave_et", type: "text" },
    { label: "Posición", dbName: "posicion", type: "text" },
    { label: "Milímetros", dbName: "milimetros", type: "text" },
    { label: "Kms Ant", dbName: "kms_ant", type: "text" },
    { label: "Kms Act", dbName: "kms_act", type: "text" },
    { label: "Presión", dbName: "presion", type: "text" },
    { label: "Presión Est", dbName: "presion_est", type: "text" },
    { label: "Fecha Act", dbName: "fecha_act", type: "date" },
    { label: "Observaciones", dbName: "observaciones", type: "text" },
    { label: "Marca", dbName: "id_marcall", type: "text" },
    { label: "Modelo", dbName: "id_modeloll", type: "text" },
    { label: "Tipo Piso", dbName: "id_tipopiso", type: "text" },
    { label: "Medida", dbName: "id_medidall", type: "text" },
    { label: "Estatus", dbName: "id_estatusll", type: "text" },
  ];

  return (
    <>
      |{" "}
      {authorizedToRead && (
        <EditableDataTable
          title="Llantas"
          table={table}
          onAdd={handleAddCentroCostos}
          modalInputs={modalInputs}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default LlantasCatalogo;
