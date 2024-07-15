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

import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

interface InputProps {
  label: string;
  type?: string;
}

interface DataTableWithModalProps {
  title: string;
  modalInputs?: InputProps[];
  description: string;
  dataTableData: any; // Define a type for your data
  onAdd?: (data: any) => void; // Callback when Add is clicked
}

function SingleDataTable({
  title,
  description,
  dataTableData,
  modalInputs,
}: DataTableWithModalProps): JSX.Element {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
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
            <MDButton variant="gradient" color="dark" onClick={handleOpen}>
              Add new
            </MDButton>
          </MDBox>
          <DataTable table={dataTableData} entriesPerPage={false} canSearch />
        </Card>
      </MDBox>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Entry</DialogTitle>
        <DialogContent>
          {modalInputs &&
            modalInputs.map((input, index) => (
              <MDInput
                key={index}
                margin="dense"
                inputProps={{ style: { color: "black" } }}
                label={input.label}
                type={input.type || "text"}
                fullWidth
                // You can spread and add other input properties as required
              />
            ))}
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleClose} color="dark">
            Cancel
          </MDButton>
          <MDButton variant="gradient" color="dark" onClick={handleClose}>
            Add
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SingleDataTable;
