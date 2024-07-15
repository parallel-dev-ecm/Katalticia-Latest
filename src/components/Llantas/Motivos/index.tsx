import Footer from "examples/Footer";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useRef } from "react";
import { Box } from "@mui/system";
// Data
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import {
  useMaterialReactTable,
  type MRT_Row,
  type MRT_TableInstance,
  type MRT_Cell,
  createMRTColumnHelper,
} from "material-react-table";
import { useGeneralesStore } from "stores/Generales/Store_Generales";
import { UpdateTableDynamically } from "Interfaces";
import { Button, Grid } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { jsPDF } from "jspdf"; //or use your library of choice here
import autoTable from "jspdf-autotable";
import EditableDataTable from "components/Resources/EditableDataTable";
import { mkConfig, generateCsv, download } from "export-to-csv";
import EditableDataTableNoLayout from "components/Resources/EditableTableNoLayout";
import gsap from "gsap";
import { useMotivosLlantasStore, MotivosLlantas } from "stores/Llantas/Motivos";

type Props = {};

function MotivosLlantasIndex({}: Props) {
  const EditableDataTableRef = useRef(null);
  const allData = useMotivosLlantasStore((state) => state.allData);
  const readAllData = useMotivosLlantasStore((state) => state.readAllData);
  const updateTable = useGeneralesStore((state) => state.updateTable);
  const postCC = useMotivosLlantasStore((state) => state.addData);
  const tableName = "  KataliticaTMS_Test.Llantas.MovimientoLlantas";
  const columnHelper = createMRTColumnHelper<MotivosLlantas>();
  const generateColumns = (data: MotivosLlantas): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  useEffect(() => {
    const readPath = "/motivosLlantas/getAllMotivosLlantas";

    readAllData(readPath);
  });

  const columns = generateColumns(allData.length > 0 ? allData[0] : ({} as MotivosLlantas));

  const pushPath = "/movimientoLlantas/postMovimientoLlanta";
  const handleAddCentroCostos = async (data: MotivosLlantas) => {
    const isSuccess = await postCC(data, pushPath);
    console.log(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };

  const columnsET = columns.map((column) => {
    const accessor = column.accessor as keyof MotivosLlantas; // Type assertion

    return {
      ...columnHelper.accessor(accessor, {
        header: column.Header,
        muiEditTextFieldProps: ({
          cell,
          row,
          table,
        }: {
          cell: MRT_Cell<MotivosLlantas, string>;
          row: MRT_Row<MotivosLlantas>;
          table: MRT_TableInstance<MotivosLlantas>;
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

  const csvConfig = mkConfig({
    useKeysAsHeaders: true,
  });

  const handleExportRows = (rows: MRT_Row<MotivosLlantas>[], tableTitle?: string) => {
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
    data: allData,
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
    { label: "Descripción", dbName: "descripciom", type: "string" },
    { label: "Clave", dbName: "Clave", type: "string" },
  ];

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />

        <EditableDataTableNoLayout
          title="Motivos Llantas"
          table={table}
          onAdd={handleAddCentroCostos}
          modalInputs={modalInputs}
        />
      </DashboardLayout>
      <Footer />
    </>
  );
}

export default MotivosLlantasIndex;
