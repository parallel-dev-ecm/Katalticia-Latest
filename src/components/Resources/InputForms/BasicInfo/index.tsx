import { Card, Grid, Autocomplete } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

import FormField from "layouts/pages/account/components/FormField";
import { useState } from "react";

interface Category {
  label: string;
  placeholder: string;
  type?: string;
}

interface BasicInfoProps {
  categories: Category[];
  cardTitle?: string;
  defaultState?: string;
  buttonText: string;
  stateOptions?: string[];
}

function BasicInfo({
  buttonText,
  categories,
  cardTitle = "Información de la compañia",
  defaultState = "Querétaro",
  stateOptions = [],
}: BasicInfoProps): JSX.Element {
  const [disabled, setDisabled] = useState(false);

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }}>
      <MDBox p={3}>
        <MDTypography variant="h5">{cardTitle}</MDTypography>
      </MDBox>
      <MDBox component="form" pb={3} px={3}>
        <Grid container spacing={3}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormField
                label={category.label}
                variant="outlined"
                disabled={disabled}
                placeholder={category.placeholder}
                inputProps={category.type ? { type: category.type } : undefined}
              />
            </Grid>
          ))}
          {stateOptions.length > 0 && (
            <Grid item xs={12} sm={6}>
              <Autocomplete
                defaultValue={defaultState}
                options={stateOptions}
                disabled={disabled}
                renderInput={(params) => (
                  <FormField
                    variant="outlined"
                    {...params}
                    label="Estado"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <MDBox display="flex" justifyContent={"flex-end"}>
              <MDButton variant="gradient" color="dark">
                {buttonText}
              </MDButton>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default BasicInfo;
