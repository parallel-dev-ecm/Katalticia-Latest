import React, { useState } from "react";
import { Box } from "@mui/system";

// @mui material components
import Card from "@mui/material/Card";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 PRO React TS examples components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { Grid } from "@mui/material";
import buttonText from "assets/theme/components/button/text";
import OrdenMantenimientoForm from "../OrdenMantenimiento/CreateOrden";
import { useNavigate } from "react-router-dom";

interface InputProps {
  label: string;
  dbName: string;
  type?: string;
}

interface DataTableWithModalProps {
  title: string;
  buttonText?: string;
  dialogTitle?: string;
  buttonEditable?: boolean;
  modalInputs?: InputProps[];
  description: string;
  dataTableData: { columns: any[]; rows: any[] }; // Define a type for your data
  onAdd?: (data: any) => void; // Callback when Add is clicked
}

function DataTableNoLayoutVariation({
  title,
  description,
  dataTableData,
  dialogTitle,
  modalInputs,
  onAdd,
  buttonText,
  buttonEditable,
}: DataTableWithModalProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({}); // Step 1: Create formData state
  const navigate = useNavigate();
  const handleOpen = () => {
    setFormData({});

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (label: string, value: string) => {
    // Step 2: Update formData state with new input values
    setFormData((prev) => ({ ...prev, [label]: value }));
  };

  return (
    <>
      <MDBox pt={6} pb={3}>
        <Card>
          <MDBox
            p={3}
            lineHeight={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <MDTypography variant="h5" fontWeight="medium">
                {title}
              </MDTypography>
              <MDTypography variant="button" color="text">
                {description}
              </MDTypography>
            </Box>
            <MDButton
              disabled={!buttonEditable}
              variant="gradient"
              color="dark"
              onClick={() => {
                navigate("/Mantenimiento/CrearOrdenesReparacion");
              }}
            >
              {buttonText}
            </MDButton>
          </MDBox>
          <DataTable
            table={{
              columns: dataTableData.columns,
              rows: dataTableData.rows,
            }}
            entriesPerPage={false}
            canSearch
          />
        </Card>
      </MDBox>
      <Footer />
    </>
  );
}

export default DataTableNoLayoutVariation;
