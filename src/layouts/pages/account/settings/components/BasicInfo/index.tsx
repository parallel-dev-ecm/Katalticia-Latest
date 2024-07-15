import React, { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
// @material-ui core components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { gsap } from "gsap";
import { User, useUsersStore } from "stores/Generales/Store_Users";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// Settings page components
import FormField from "layouts/pages/account/components/FormField";
// Data
import { mexicanStates } from "layouts/pages/account/settings/components/BasicInfo/data/selectData";
import MDButton from "components/MDButton";
import { useAuthStore } from "stores/Store_Auth";
import { Company, currentCompanyStore } from "stores/Generales/Store_Company";
import { Alert } from "@mui/material";

function BasicInfo(): JSX.Element {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // State variables for each form field
  const [claveCompania, setClaveCompania] = useState("");
  const [rfc, setRFC] = useState("");
  const [razon_social, setRazonSocial] = useState("");

  const [nombreCorto, setNombreCorto] = useState("");
  const [nombreLargo, setNombreLargo] = useState("");
  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [contactoPersona, setContactoPersona] = useState("");
  const [telefono, setTelefono] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const getCompanyDetails = currentCompanyStore((state) => state.getCompanyById);
  const el = useRef();
  const mainTitle = useRef();
  const formRef = useRef();
  const tl = gsap.timeline();

  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const updateCompanyStore = currentCompanyStore((state) => state.updateCompanyById);

  const getUser = useAuthStore((state) => state.currentUser);
  const fetchUserApi = useUsersStore((state) => state.getUsers);

  const handleChange =
    (setStateFunc: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setStateFunc(e.target.value);
    };

  const handleSaveChanges = async () => {
    const company: Company = {
      id: 1,
      clave_compania: claveCompania,
      rfc,
      razon_social,
      nombre_corto: nombreCorto,
      nombre_largo: nombreLargo,
      calle,
      estado,
      colonia,
      codigo_postal: codigoPostal,
      contacto_persona: contactoPersona,
      telefono,
    };
    // Call the store function to update the company
    const updated = await updateCompanyStore(company);
    if (updated) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } else {
      console.log(updated);
      console.log("error");
    }
  };

  useEffect(() => {
    async function fetchCompanyDetails() {
      const company = await getCompanyDetails("1");

      setLoading(false); // Assuming 1 is the ID of the company you want to fetch
      setClaveCompania(company.clave_compania || "");
      setRFC(company.rfc || "");
      setRazonSocial(company.razon_social || "");
      setNombreCorto(company.nombre_corto || "");
      setNombreLargo(company.nombre_largo || "");
      setCalle(company.calle || "");
      setColonia(company.colonia || "");
      setEstado(company.estado || "Sinaloa");
      console.log(company.estado);
      setCodigoPostal(company.codigo_postal || "");
      setContactoPersona(company.contacto_persona || "");
      setTelefono(company.telefono || "");
    }

    fetchCompanyDetails();
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
      SetAuthorizedToRead(user.readGenerales);
      SetAuthorizedToWrite(user.editGenerales);
      console.log(user.editGenerales);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  useLayoutEffect(() => {
    if (!loading) {
      const gtx = gsap.context();
    }
    const ctx = gsap.context(() => {
      const mainBoxTween = gsap.fromTo(mainTitle.current, { opacity: 0 }, { opacity: 1, delay: 1 });
      tl.add(mainBoxTween);

      const signInTween = gsap.fromTo(formRef.current, { opacity: 0 }, { opacity: 1 });
      tl.add(signInTween);
    }, el);

    // cleanup function will be called when component is removed
    return () => {
      ctx.revert(); // animation cleanup!!
    };
  }, []);
  return (
    <Card id="basic-info" sx={{ overflow: "visible" }} ref={el}>
      {
        <>
          <MDBox p={3} ref={mainTitle}>
            <MDTypography variant="h5">Información de la compañia</MDTypography>
          </MDBox>
          {authorizedToRead && (
            <MDBox component="form" pb={3} px={3} ref={formRef}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormField
                    variant="outlined"
                    disabled={disabled}
                    label="Clave compañia"
                    placeholder={claveCompania}
                    onChange={handleChange(setClaveCompania)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="RFC"
                    placeholder={rfc}
                    onChange={handleChange(setRFC)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="Razon Social"
                    placeholder={razon_social}
                    onChange={handleChange(setRazonSocial)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="Nombre Corto"
                    placeholder={nombreCorto}
                    onChange={handleChange(setNombreCorto)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="Nombre Largo"
                    placeholder={nombreLargo}
                    onChange={handleChange(setNombreLargo)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        label="Calle"
                        placeholder={calle}
                        onChange={handleChange(setCalle)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        label="Colonia"
                        placeholder={colonia}
                        onChange={handleChange(setColonia)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={5}>
                          <Autocomplete
                            value={estado}
                            options={mexicanStates}
                            disabled={disabled}
                            onChange={(event, newValue) => setEstado(newValue)}
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
                        <Grid item xs={12} sm={6}>
                          <FormField
                            variant="outlined"
                            disabled={disabled}
                            label="Codigo Postal"
                            placeholder={codigoPostal}
                            onChange={handleChange(setCodigoPostal)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormField
                    variant="outlined"
                    disabled={disabled}
                    label="Contacto Persona"
                    placeholder={contactoPersona}
                    onChange={handleChange(setContactoPersona)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    label="Numero de Telefono"
                    variant="outlined"
                    disabled={disabled}
                    placeholder={telefono}
                    onChange={handleChange(setTelefono)}
                    inputProps={{ type: "number" }}
                  />
                </Grid>
                {
                  <Grid item xs={12} sm={6}>
                    <MDBox display="flex" justifyContent="flex-end">
                      <MDButton
                        disabled={!authorizedToWrite}
                        variant="gradient"
                        color="dark"
                        onClick={handleSaveChanges}
                      >
                        Guardar Cambios
                      </MDButton>
                    </MDBox>
                  </Grid>
                }

                <Grid item xs={12} sm={12}>
                  <MDBox display="flex">
                    {showSuccessAlert && (
                      <Alert severity="success">Compañia actualizada exitosamente.</Alert>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
          )}
          {!authorizedToRead && <Alert severity="error">Sin permisos.</Alert>}
        </>
      }
    </Card>
  );
}

export default BasicInfo;
