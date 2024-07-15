import React, { forwardRef, useEffect, useRef } from "react";
import { Autocomplete, Divider, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import { handleChange } from "Functions/Constants";
import { ClaveRequest, DescripcionRequest } from "Interfaces";

import {
  KmReq,
  usePlanesMantenimientoStore,
  PlanMantenimiento,
} from "stores/Mantenimiento/Store_PlanesMantenimiento";
import MDButton from "components/MDButton";
import { useActividadesStore } from "stores/Mantenimiento/Store_Actividades";

type Props = {
  disabled: boolean;
  idOperador?: number;
  pushToDB: boolean;
};

export const NuevaReparacion = forwardRef<HTMLFormElement, Props>((props, ref) => {
  const { disabled, idOperador, pushToDB } = props;

  const [tipoEtMantenimiento, setTipoEtMantenimiento] = React.useState<string | null>(null);
  const postPlanMantenimiento = usePlanesMantenimientoStore((state) => state.addPuesto);
  const getAllPlanesMantenimiento = usePlanesMantenimientoStore((state) => state.readAllPuestos);
  const getIdByDescripcion = useActividadesStore((state) => state.getIdByDescripcion);
  const allPlanesMantenimiento = usePlanesMantenimientoStore((state) => state.allPuestos);
  const [cvePlanMantenimiento, setCvePlanMantenimiento] = React.useState<string>("");
  const [descripcionMantenimiento, setDescripcionMantenimiento] = React.useState<string>("");
  const [idActividadesMantenimiento, setIdActividadesMantenimiento] = React.useState<number>(0);
  const [cveActvplanMantenimiento, setCveActvplanMantenimiento] = React.useState<string>("");
  const [actividadMantenimiento, setActividadMantenimiento] = React.useState<string | undefined>(
    undefined
  );
  const allActividades = useActividadesStore((state) => state.allPuestos);

  const getUniqueActividades = usePlanesMantenimientoStore((state) => state.getUniqueActividades);

  const [kmsLimMantenimiento, setKmsLimMantenimiento] = React.useState<string>("");
  const [diasLimMantenimiento, setDiasLimMantenimiento] = React.useState<string>("");
  const [tolKmsMantenimiento, setTolKmsMantenimiento] = React.useState<string>("");
  const [tolDiasMantenimiento, setTolDiasMantenimiento] = React.useState<string>("");
  const [newReparacion, setNewReparacion] = React.useState<boolean>(false);
  const childRef = useRef(null);

  useEffect(() => {
    getAllPlanesMantenimiento();
  }, []);

  const handlePush = async () => {
    const planMantenimientoToPush: PlanMantenimiento = {
      cve_plan: cvePlanMantenimiento,
      descripcion: descripcionMantenimiento,
      id_actividades: idActividadesMantenimiento,
      cve_actvplan: cveActvplanMantenimiento,
      actividad: actividadMantenimiento,
      kms_lim: kmsLimMantenimiento,
      dias_lim: diasLimMantenimiento,
      tol_kms: tolKmsMantenimiento,
      tol_dias: tolDiasMantenimiento,
      tipo_et: tipoEtMantenimiento,
    };
    console.log("planMantenimientoToPush: ", planMantenimientoToPush);
    const planMantenimientoPost = await postPlanMantenimiento(planMantenimientoToPush);
    console.log("planMantenimientoPost: ", planMantenimientoPost);
    return planMantenimientoPost;
  };

  useEffect(() => {
    if (pushToDB) {
      handlePush();
    }
  }, [pushToDB]);

  return (
    <>
      <div>
        <Divider component="li" />
        <MDBox p={3}>
          <MDTypography variant="h5">Añadir Plan De Mantenimiento</MDTypography>
        </MDBox>
        <MDBox component="form" pb={3} px={3} ref={ref}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Cve Plan "
                onChange={handleChange(setCvePlanMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Descripcion "
                onChange={handleChange(setDescripcionMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Autocomplete
                options={allActividades.map((option) => option.descripcion)}
                disabled={disabled}
                onChange={async (event, newValue) => {
                  if (newValue) {
                    const req: ClaveRequest = { clave: newValue };
                    console.log(req);
                    const actividadId = await getIdByDescripcion(req);
                    setIdActividadesMantenimiento(actividadId);
                    setActividadMantenimiento(newValue);
                  }
                }}
                renderInput={(params) => (
                  <FormField
                    variant="outlined"
                    {...params}
                    label="Actividad"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Cve Actvplan"
                onChange={handleChange(setCveActvplanMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Kms Lim "
                onChange={handleChange(setKmsLimMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Dias Lim "
                onChange={handleChange(setDiasLimMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Tol Kms "
                onChange={handleChange(setTolKmsMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Tol Dias "
                onChange={handleChange(setTolDiasMantenimiento)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormField
                disabled={disabled}
                variant="outlined"
                label="Tipo ET"
                onChange={handleChange(setTipoEtMantenimiento)}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <MDBox display="flex" justifyContent="flex-end">
                <MDButton
                  onClick={() => {
                    setNewReparacion(true);
                  }}
                  variant="gradient"
                  color="dark"
                >
                  +
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>

          <div></div>
        </MDBox>
      </div>
      <br />
      <div>
        {newReparacion && (
          <NuevaReparacion
            pushToDB={pushToDB}
            ref={childRef}
            disabled={disabled}
            idOperador={idOperador}
          />
        )}
      </div>
    </>
  );
});

export default NuevaReparacion;
