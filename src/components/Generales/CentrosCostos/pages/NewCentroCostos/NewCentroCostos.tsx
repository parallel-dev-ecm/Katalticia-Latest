// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";

// Settings page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Header from "layouts/pages/account/settings/components/Header";

import BasicInfo from "components/Resources/InputForms/BasicInfo";
import { mexicanStates } from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import MDTypography from "components/MDTypography";

function AñadirCentroCostos(): JSX.Element {
  return (
    <BaseLayout>
      <MDBox mt={4}>
        <Grid container spacing={3} justifyContent={"center"} alignItems={"center"}>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <MDTypography
                  component="span"
                  variant="button"
                  fontWeight="regular"
                  textTransform="capitalize"
                  sx={{ lineHeight: 0 }}
                ></MDTypography>
                <Grid item xs={12}>
                  <Header />
                </Grid>
                <Grid item xs={12}>
                  <BasicInfo
                    buttonText="Añadir nuevo"
                    cardTitle="Nuevo centro de costos"
                    categories={[
                      { label: "Nombre", placeholder: "" },
                      { label: "Calle", placeholder: "12313123" },
                      { label: "Código Postal", placeholder: "12313123" },
                      { label: "Numero", placeholder: "12313123" },
                      { label: "Gerente", placeholder: "Amazon SA de CV" },
                    ]}
                    defaultState="Querétaro"
                    stateOptions={mexicanStates}
                  />{" "}
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
}

export default AñadirCentroCostos;
