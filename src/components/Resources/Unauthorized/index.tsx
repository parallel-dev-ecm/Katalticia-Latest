import { Box, Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";

type Props = {};

function Unauthorized({}: Props) {
  return (
    <>
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
                  {"404"}
                </MDTypography>
                <MDTypography variant="button" color="text">
                  {"No cuenta con permisos para visualizar esta página"}
                </MDTypography>
              </Box>
            </MDBox>
          </Card>
        </MDBox>
      </DashboardLayout>
    </>
  );
}

export default Unauthorized;
