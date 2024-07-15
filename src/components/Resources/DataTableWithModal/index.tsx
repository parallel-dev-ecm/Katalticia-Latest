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

interface InputProps {
  label: string;
  dbName: string;
  type?: string;
}

interface DataTableWithModalProps {
  title: string;
  dialogTitle?: string;
  buttonEditable?: boolean;
  modalInputs?: InputProps[];
  description: string;
  dataTableData: { columns: any[]; rows: any[] }; // Define a type for your data
  onAdd?: (data: any) => void; // Callback when Add is clicked
}

function DataTableWithModal({
  title,
  description,
  dataTableData,
  dialogTitle,
  modalInputs,
  onAdd,
  buttonEditable,
}: DataTableWithModalProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({}); // Step 1: Create formData state

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
    <DashboardLayout>
      <DashboardNavbar />
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
              onClick={handleOpen}
            >
              Añadir nuevo
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

      <Dialog open={open} onClose={handleClose} style={{ marginBottom: "8px" }}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          {modalInputs &&
            modalInputs.map((input, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={6}>
                  <p style={{ color: "black", marginBottom: "1px", opacity: "50%" }}>
                    {input.label}
                  </p>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MDInput
                    margin="dense"
                    inputProps={{
                      style: { color: "black" },
                      value: formData[input.dbName] || "",
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(input.dbName, e.target.value),
                    }}
                    type={input.type || "text"}
                    fullWidth
                  />
                </Grid>
              </Grid>
            ))}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClose} color="dark">
            Cancelar
          </MDButton>
          <MDButton
            variant="gradient"
            color="dark"
            onClick={() => {
              if (onAdd) {
                onAdd(formData);
              }
            }}
          >
            Añadir
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}

export default DataTableWithModal;
