import React, {
  ChangeEvent,
  ReactElement,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { gsap } from "gsap";
import Divider from "@mui/material/Divider";
import { User, useUsersStore } from "stores/Generales/Store_Users";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import FormField from "layouts/pages/account/components/FormField";
import MDButton from "components/MDButton";
import { Alert, Autocomplete } from "@mui/material";
import OrdenReparacionInterface, { ClaveRequest, UpdateKmRequest } from "Interfaces";
import { handleChange } from "../../functions";
import MDInput from "components/MDInput";
import { useDollyStore } from "stores/GestionET/Store_dollys";
import { useTractoresStore } from "stores/GestionET/Store_Tractores";
import { useRemolquesStore } from "stores/GestionET/Store_Remolques";
import { useTalleresStore } from "stores/Mantenimiento/Store_Talleres";
import { currentCompanyStore } from "stores/Generales/Store_Company";
import { Hubodometro, useHubodometroStore } from "stores/Mantenimiento/Store_Hubodometro";
import {
  OrdenReparacionActividades,
  useOrdenReparacionActividadesStore,
} from "stores/Mantenimiento/Store_OrdenReparacionActividades";
import DataTableNoLayout from "../../DataTableWithModal/DataTableNoLayout";
import { useColaboradoresStore } from "stores/GestionTalento/Store_Colaboradores";
import { ordenReparacionStore } from "stores/Mantenimiento/Store_OrdenReparacion";
import { EstatusOptions } from "Constants";
import {
  KmReq,
  PlanMantenimiento,
  usePlanesMantenimientoStore,
} from "stores/Mantenimiento/Store_PlanesMantenimiento";
import { useActividadesStore } from "stores/Mantenimiento/Store_Actividades";
import DataTableWithModal from "components/Resources/DataTableWithModal";
import { NuevaReparacion } from "./NuevaReparacion";
import { E } from "@fullcalendar/core/internal-common";

function OrdenMantenimientoForm() {
  // Function component code here

  // State variables for the component
  const getPlanMantenimientoByDescripcion = usePlanesMantenimientoStore(
    (state) => state.getIdByDescripcion
  );

  const [pushNuevaReparacion, setPushNuevaReparacion] = useState(false);
  const postPlanMantenimiento = usePlanesMantenimientoStore((state) => state.addPuesto);
  const [tipoEtMantenimiento, setTipoEtMantenimiento] = useState<string>(null);
  const getUniqueActividades = usePlanesMantenimientoStore((state) => state.getUniqueActividades);
  const uniqueActividades = usePlanesMantenimientoStore((state) => state.uniqueActividades);
  const getOrdenByFolio = ordenReparacionStore((state) => state.getOrdenByFolio);
  const getAllPlanesMantenimiento = usePlanesMantenimientoStore((state) => state.readAllPuestos);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const allPlanesMantenimiento = usePlanesMantenimientoStore((state) => state.allPuestos);
  const getAllDescripciones = useActividadesStore((state) => state.getAllDescripciones);
  const getIdByDescripcion = useActividadesStore((state) => state.getIdByDescripcion);
  const allDescripciones = useActividadesStore((state) => state.allDescripciones);
  const allActividades = useActividadesStore((state) => state.allPuestos);
  const readAllActividades = useActividadesStore((state) => state.readAllPuestos);
  const getActividadById = useOrdenReparacionActividadesStore((state) => state.getActividadById);
  const getAllActividades = useOrdenReparacionActividadesStore((state) => state.readAllActividades);
  const allActividadesStore = useOrdenReparacionActividadesStore((state) => state.allActividades);
  const getIdActividades = useOrdenReparacionActividadesStore((state) => state.getIdActividades);
  const postActividades = useOrdenReparacionActividadesStore((state) => state.addActividades);

  const [idActividad, setIdActividad] = useState<number>(null);
  const [idListActividad, setIdListActividad] = useState<number[] | number>(null);
  const [showRemolqueDos, setShowRemolqueDos] = useState<boolean>(false);
  const [showActividadesRemolque, setShowActividadesRemolque] = useState<boolean>(false);
  const [showActividadesTractor, setShowActividadesTractor] = useState<boolean>(false);
  const [showActividadesDolly, setShowActividadesDolly] = useState<boolean>(false);
  const [showActividadesRemolque2, setShowActividadesRemolque2] = useState<boolean>(false);
  const getHubodometroByClave = useHubodometroStore((state) => state.getByClave);
  const updateKm_totales = useHubodometroStore((state) => state.updateKm_totales);
  const getAllOperadores = useColaboradoresStore((state) => state.readAllPuestos);
  const allOperadores = useColaboradoresStore((state) => state.allPuestos);
  const getOperadorIdFromName = useColaboradoresStore((state) => state.getIdFromName);
  const getAllCompanias = currentCompanyStore((state) => state.getAllCompanies);
  const allCompanies = currentCompanyStore((state) => state.allCompanies);
  const getAllDollys = useDollyStore((state) => state.readAllDollys);
  const getAllRemolques = useRemolquesStore((state) => state.readAllRemolques);
  const getRemolqueByClave = useRemolquesStore((state) => state.getByClave);
  const getAllTractores = useTractoresStore((state) => state.readAllMarcas);
  const getAllTalleres = useTalleresStore((state) => state.readAllPuestos);
  const allTalleres = useTalleresStore((state) => state.allPuestos);
  const allDollys = useDollyStore((state) => state.allDollys);
  const allTractores = useTractoresStore((state) => state.allTractores);
  const getTractorByClave = useTractoresStore((state) => state.getByClave);
  const getDollyFromClave = useDollyStore((state) => state.getByClave);
  const allRemolques = useRemolquesStore((state) => state.allRemolques);

  const inputData = { allDollys, allTractores, allRemolques, allTalleres, allCompanies };
  // State variables for each form field
  const [compania, setCompania] = useState<string>(null);
  const [taller, setTaller] = useState<string>(null);
  const [folio, setFolio] = useState<string>(null);
  const [motivo, setMotivo] = useState<string>(null);
  const [estatus, setEstatus] = useState<string>(null);
  const [fech_entra, setFechEntra] = useState<Date>(null);
  const [fech_sal, setFechSal] = useState<Date>(null);
  const [operador, setOperador] = useState<string>(null);
  const [mecanico, setMecanico] = useState<string>(null);
  const [tractor, setTractor] = useState<string>(null);
  const [remolque, setRemolque] = useState<string>(null);
  const [dolly, setDolly] = useState<string>(null);
  const [observacion, setObservacion] = useState<string>(null);
  const [id_centrocosto, setIdCentroCosto] = useState<number>(null);
  const [id_taller, setIdTaller] = useState<number>(null);
  const [id_operador, setIdOperador] = useState<number>(null);
  const [id_remolques, setIdRemolques] = useState<number>(null);
  const [id_tractores, setIdTractores] = useState<number>(null);
  const [id_dollys, setIdDollys] = useState<number>(null);
  const [id_compania, setIdCompania] = useState<number>(1);
  const [cve_act, setCveAct] = useState<string>(null);
  const [descripcion, setDescripcion] = useState<string>(null);
  const [actividad, setActividad] = useState<string>(null);
  const [tiempo, setTiempo] = useState<string>(null);
  const [chek, setChek] = useState<string>(null);
  const [fech_rep, setFechRep] = useState<Date>(null);
  const [km_editable_remolques, setKmEditableRemolques] = useState<number>(null); // Add the missing property
  const [km_remolques, setKmRemolque] = useState<number>(null); // Add the missing property
  const [km_tractores, setKmTractores] = useState<number>(null); // Add the missing property
  const [km_editable_tractores, setKmEditableTractores] = useState<number>(null); // Add the missing property
  const [km_dollys, setKmDollys] = useState<number>(null); // Add the missing property
  const [km_editable_dollys, setKmEditableDollys] = useState<number>(null); // Add the missing property
  const getByETAndKms = usePlanesMantenimientoStore(
    (state) => state.getPlanesByETandKmsLessColumns
  );
  const [showNuevaReparacion, setShowNuevaReparacion] = useState<boolean>(false);
  const [showSuccessActividadPost, setShowSuccessActividadPost] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const el = useRef();
  const mainTitle = useRef();
  const formRef = useRef();
  const tl = gsap.timeline();
  const allUsers = useUsersStore((state) => state.allUsers);
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const [dollyPlanesMantenimiento, setDollyPlanesMantenimiento] = useState<PlanMantenimiento[]>([]);
  const [tractorPlanesMantenimiento, setTractorPlanesMantenimiento] = useState<PlanMantenimiento[]>(
    []
  );
  const [remolquePlanesMantenimiento, setRemolquePlanesMantenimiento] = useState<
    PlanMantenimiento[]
  >([]);
  const [remolque2PlanesMantenimiento, setRemolque2PlanesMantenimiento] = useState<
    PlanMantenimiento[]
  >([]);

  const [remolqueDos, setRemolqueDos] = useState<string>("");
  const [idRemolqueDos, setIdRemolqueDos] = useState<number>(null);
  const [kmSegundoRemolque, setKmSegundoRemolque] = useState<number>(0); // Add the missing property
  const [idHubodometroSegundoRemolque, setIdHubodometroSegundoRemolque] = useState<number>();
  const [km_editable_segundo_remolques, setKmEditableSegundoRemolques] = useState<number>(0); // Add the missing property

  const [idHubodometroRemolque, setIdHubodometroRemolque] = useState<number>(0);
  const [idHubodometroTractor, setIdHubodometroTractor] = useState<number>(0);
  const [idHubodometroDolly, setIdHubodometroDolly] = useState<number>(0);
  const postOrdenReparacion = ordenReparacionStore((state) => state.postOrden);

  const [cvePlanMantenimiento, setCvePlanMantenimiento] = useState<string>("");
  const [descripcionMantenimiento, setDescripcionMantenimiento] = useState<string>("");
  const [idActividadesMantenimiento, setIdActividadesMantenimiento] = useState<number>(0);
  const [cveActvplanMantenimiento, setCveActvplanMantenimiento] = useState<string>("");
  const [actividadMantenimiento, setActividadMantenimiento] = useState<string | undefined>(
    undefined
  );
  const [kmsLimMantenimiento, setKmsLimMantenimiento] = useState<string>("");
  const [diasLimMantenimiento, setDiasLimMantenimiento] = useState<string>("");
  const [tolKmsMantenimiento, setTolKmsMantenimiento] = useState<string>("");
  const [tolDiasMantenimiento, setTolDiasMantenimiento] = useState<string>("");
  const newReparacionRef = useRef();
  const getOrdenByAllColumns = ordenReparacionStore((state) => state.getOrdenByAllColumns);

  const addOrdenReparacionActividad = useOrdenReparacionActividadesStore(
    (state) => state.addActividades
  );
  const kmReqRemolque: UpdateKmRequest = {
    id: "",
    newKm: 0,
  };

  const kmReqTractor: UpdateKmRequest = {
    id: "",
    newKm: 0,
  };
  const kmReqDolly: UpdateKmRequest = {
    id: "",
    newKm: 0,
  };
  const kmReqRemolque2: UpdateKmRequest = {
    id: "",
    newKm: 0,
  };

  const handleSaveChanges = async () => {
    const ordenReparacion: OrdenReparacionInterface = {
      compania,
      taller,
      folio,
      motivo,
      estatus,
      fech_entra,
      fech_sal,
      operador,
      mecanico,
      tractor,
      remolque,
      dolly,
      km_remolques,
      km_editable_remolques,
      km_dollys,
      km_editable_dollys,
      observacion,
      id_actividades: idActividad,
      id_centrocosto,
      id_taller,
      id_operador,
      id_remolques,
      id_tractores,
      id_dollys,
      id_compania,
      cve_act,
      descripcion,
      actividad,
      tiempo,
      chek,
      fech_rep,
      km_tractores, // Add the missing property
      km_editable_tractores, // Add the missing property
      remolque2: remolqueDos,
      km_remolque2: kmSegundoRemolque,
      km_editable_remolque2: km_editable_segundo_remolques,
    };
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

    console.log("Orden de reparacion: ", planMantenimientoToPush);
    setPushNuevaReparacion(true);

    if (id_remolques != 0 && id_remolques != null) {
      kmReqRemolque.id = idHubodometroRemolque.toString();
      kmReqRemolque.newKm = km_editable_remolques;
    }

    if (id_tractores != 0 && id_tractores != null) {
      kmReqTractor.id = idHubodometroTractor.toString();
      kmReqTractor.newKm = km_editable_tractores;
    }

    if (id_dollys != 0 && id_dollys != null) {
      kmReqDolly.id = idHubodometroDolly.toString();
      kmReqDolly.newKm = km_editable_dollys;
    }
    if (id_dollys != 0 && id_dollys != null) {
      kmReqDolly.id = idHubodometroDolly.toString();
      kmReqDolly.newKm = km_editable_dollys;
    }

    if (idRemolqueDos != 0 && idRemolqueDos != null) {
      kmReqRemolque2.id = idHubodometroSegundoRemolque.toString();
      kmReqRemolque2.newKm = km_editable_segundo_remolques;
    }

    const remolqueKmUpdate = await updateKm_totales(kmReqRemolque);
    const tractorKmUpdate = await updateKm_totales(kmReqTractor);
    const dollyKmUpdate = await updateKm_totales(kmReqDolly);

    const ordenReparacionPost = await postOrdenReparacion(ordenReparacion);
    const planMantenimientoPost = await postPlanMantenimiento(planMantenimientoToPush);

    const updated = ordenReparacionPost;
    console.log(updated);
    if (updated) {
      const idOrdenReparacion = await getOrdenByFolio(ordenReparacion.folio);

      remolquePlanesMantenimiento.map(async (plan) => {
        const activityToAdd: OrdenReparacionActividades = {
          compania: compania,
          folio: folio,
          cve_act: plan.actividad,
          pieza: "",
          descripcion: descripcion,
          identificador: "",
          mecanico: mecanico,
          tiempo: tiempo,
          chek: chek,
          fech_rep: fech_rep,
          km_reparacion: "",
          id_planesmantenimiento: plan.id,
          id_centrocosto: id_centrocosto,
          id_taller: id_taller,
          id_remolques: id_remolques,
          id_remolque2: id_remolques,
          id_tractores: id_tractores,
          id_dollys: id_dollys,
          id_compania: id_compania,
          id_ordenReparacion: idOrdenReparacion,
        };
        const addActividadOrden = await addOrdenReparacionActividad(activityToAdd);
      });
      tractorPlanesMantenimiento.map(async (plan) => {
        const activityToAdd: OrdenReparacionActividades = {
          compania: compania,
          folio: folio,
          cve_act: plan.actividad,
          pieza: "",
          descripcion: descripcion,
          identificador: "",
          mecanico: mecanico,
          tiempo: tiempo,
          chek: chek,
          fech_rep: fech_rep,
          km_reparacion: "",
          id_planesmantenimiento: plan.id,
          id_centrocosto: id_centrocosto,
          id_taller: id_taller,
          id_remolques: id_remolques,
          id_remolque2: id_remolques,
          id_tractores: id_tractores,
          id_dollys: id_dollys,
          id_compania: id_compania,
          id_ordenReparacion: idOrdenReparacion,
        };
        const addActividadOrden = await addOrdenReparacionActividad(activityToAdd);
      });
      dollyPlanesMantenimiento.map(async (plan) => {
        const activityToAdd: OrdenReparacionActividades = {
          compania: compania,
          folio: folio,
          cve_act: plan.actividad,
          pieza: "",
          descripcion: descripcion,
          identificador: "",
          mecanico: mecanico,
          tiempo: tiempo,
          chek: chek,
          fech_rep: fech_rep,
          km_reparacion: "",
          id_planesmantenimiento: plan.id,
          id_centrocosto: id_centrocosto,
          id_taller: id_taller,
          id_remolques: id_remolques,
          id_remolque2: id_remolques,
          id_tractores: id_tractores,
          id_dollys: id_dollys,
          id_compania: id_compania,
          id_ordenReparacion: idOrdenReparacion,
        };
        const addActividadOrden = await addOrdenReparacionActividad(activityToAdd);
      });
      if (remolque2PlanesMantenimiento != null && remolque2PlanesMantenimiento.length > 0) {
        remolque2PlanesMantenimiento.map(async (plan) => {
          const activityToAdd: OrdenReparacionActividades = {
            compania: compania,
            folio: folio,
            cve_act: plan.actividad,
            pieza: "",
            descripcion: descripcion,
            identificador: "",
            mecanico: mecanico,
            tiempo: tiempo,
            chek: chek,
            fech_rep: fech_rep,
            km_reparacion: "",
            id_planesmantenimiento: plan.id,
            id_centrocosto: id_centrocosto,
            id_taller: id_taller,
            id_remolques: id_remolques,
            id_remolque2: id_remolques,
            id_tractores: id_tractores,
            id_dollys: id_dollys,
            id_compania: id_compania,
            id_ordenReparacion: idOrdenReparacion,
          };
          const addActividadOrden = await addOrdenReparacionActividad(activityToAdd);
        });
      }

      if (planMantenimientoPost) {
        setShowSuccessActividadPost(true);

        setTimeout(() => {
          setShowSuccessActividadPost(false);
        }, 3000);
      }

      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } else {
      console.log("error");
    }
  };

  useEffect(() => {
    async function fetchCompanyDetails() {
      setLoading(false);
      // Assuming 1 is the ID of the company you want to fetch
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
      SetAuthorizedToRead(user.readMantenimientoET);
      SetAuthorizedToWrite(user.editMantenimientoEt);
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

  const activitiesId = async () => {
    const res = await getIdActividades();
    setIdListActividad(res);
    console.log(idListActividad);
  };

  // get the data from the stores
  useEffect(() => {
    setIdCompania(1);
    setIdTaller(1);
    setTaller("Culiacan");
    setIdCentroCosto(1);
    getAllDescripciones();
    getAllDollys();
    getAllRemolques();
    getAllTractores();
    getAllTalleres();
    getAllCompanias();
    getAllActividades();
    readAllActividades();
    getIdActividades();
    getAllOperadores();
    getAllPlanesMantenimiento();
    getUniqueActividades();
  }, []);

  const generateColumns = (data: PlanMantenimiento): { Header: string; accessor: string }[] => {
    if (data != null) {
      const colaboradorKeys = Object.keys(data);

      // Dynamically generate the columns array
      return colaboradorKeys.map((key) => ({
        Header: key.charAt(0).toUpperCase() + key.slice(1),
        accessor: key,
      }));
    } else {
      return;
    }
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
  };
  // const columns = generateColumns(
  //   allActividades.length > 0 ? allActividades[0] : ({} as OrdenReparacionActividades)
  // );

  const dollyColumns = generateColumns(
    dollyPlanesMantenimiento.length > 0 ? dollyPlanesMantenimiento[0] : ({} as PlanMantenimiento)
  );
  const tractorColumns = generateColumns(
    tractorPlanesMantenimiento.length > 0
      ? tractorPlanesMantenimiento[0]
      : ({} as PlanMantenimiento)
  );
  const remolqueColumns = generateColumns(
    remolquePlanesMantenimiento.length > 0
      ? remolquePlanesMantenimiento[0]
      : ({} as PlanMantenimiento)
  );
  const remolque2Columns = generateColumns(
    remolque2PlanesMantenimiento.length > 0
      ? remolque2PlanesMantenimiento[0]
      : ({} as PlanMantenimiento)
  );

  const columns = generateColumns(
    allPlanesMantenimiento.length > 0 ? allPlanesMantenimiento[0] : ({} as PlanMantenimiento)
  );

  return (
    <Card id="basic-info" sx={{ overflow: "visible" }} ref={el}>
      {
        <>
          <MDBox p={3} ref={mainTitle}>
            <MDTypography variant="h5">Crear Orden de Reparación</MDTypography>
          </MDBox>
          {authorizedToRead && (
            <MDBox component="form" pb={3} px={3} ref={formRef}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={inputData.allCompanies.map((option) => option.nombre_corto)}
                    disabled={disabled}
                    onChange={async (event, newValue) => {
                      if (newValue) {
                        setCompania(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <FormField
                        variant="outlined"
                        {...params}
                        label="Compañia"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Autocomplete
                    options={inputData.allTalleres.map((option) => option.nom_corto)}
                    disabled={disabled}
                    renderInput={(params) => (
                      <FormField
                        variant="outlined"
                        {...params}
                        label="Taller"
                        onChange={handleChange(setTaller)}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="Folio"
                    onChange={handleChange(setFolio)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormField
                    disabled={disabled}
                    variant="outlined"
                    label="Motivo"
                    onChange={handleChange(setMotivo)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={EstatusOptions}
                    disabled={disabled}
                    onChange={async (event, newValue) => {
                      if (newValue) {
                        setEstatus(newValue);
                        console.log(estatus);
                      }
                    }}
                    renderInput={(params) => (
                      <FormField
                        variant="outlined"
                        {...params}
                        label="Estatus"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        type="date"
                        disabled={disabled}
                        variant="outlined"
                        label="Fecha Entrada"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const dateString = e.target.value;

                          // Assuming the date string is in the format "YYYY-MM-DD"
                          const formattedDate = dateString
                            ? new Date(dateString + "T00:00:00")
                            : null;
                          setFechEntra(formattedDate);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        type="date"
                        label="Fecha Salida"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const dateString = e.target.value;

                          // Assuming the date string is in the format "YYYY-MM-DD"
                          const formattedDate = dateString
                            ? new Date(dateString + "T00:00:00")
                            : null;
                          setFechSal(formattedDate);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        type="date"
                        label="Fecha Rep  "
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const dateString = e.target.value;

                          // Assuming the date string is in the format "YYYY-MM-DD"
                          const formattedDate = dateString
                            ? new Date(dateString + "T00:00:00")
                            : null;
                          setFechRep(formattedDate);
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={allOperadores.map((option) => option.nombre)}
                        disabled={disabled}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            const id = await getOperadorIdFromName(newValue);
                            setIdOperador(id);
                            setOperador(newValue);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            variant="outlined"
                            {...params}
                            label="Operador"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        label="Mecanico"
                        onChange={handleChange(setMecanico)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={inputData.allTractores.map((option) => option.clave)}
                        disabled={disabled}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            const req: ClaveRequest = { clave: newValue };
                            setTractor(newValue);
                            const tractorId = await getTractorByClave(newValue);
                            setIdTractores(tractorId);
                            const hubodometroRequest: ClaveRequest = {
                              clave: req.clave.replace(/\s/g, ""),
                            };
                            const currentHub: Hubodometro = await getHubodometroByClave(
                              hubodometroRequest
                            );
                            setIdHubodometroTractor(currentHub.id);
                            setKmTractores(currentHub.km_totales);
                            setKmEditableTractores(currentHub.km_totales);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            variant="outlined"
                            {...params}
                            label="Tractor"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField disabled={true} value={km_tractores} label="Km Totales" />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        disabled={false}
                        variant="outlined"
                        label="Km Editable"
                        placeholder={km_tractores}
                        onChange={handleChange(setKmEditableTractores)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Autocomplete
                        options={inputData.allRemolques.map((option) => option.clave)}
                        disabled={disabled}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            const req: ClaveRequest = { clave: newValue };
                            const remolqueId = await getRemolqueByClave(newValue);
                            setRemolque(newValue);
                            setIdRemolques(remolqueId);
                            const hubodometroRequest: ClaveRequest = {
                              clave: req.clave.replace(/\s/g, ""),
                            };
                            const currentHub: Hubodometro = await getHubodometroByClave(
                              hubodometroRequest
                            );
                            setIdHubodometroRemolque(currentHub.id);
                            setKmRemolque(currentHub.km_totales);
                            setKmEditableRemolques(currentHub.km_totales);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            variant="outlined"
                            {...params}
                            label="Remolque"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormField
                        disabled={true}
                        value={km_remolques}
                        variant="outlined"
                        label="Km Totales"
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <FormField
                        disabled={false}
                        variant="outlined"
                        label="Km Editable"
                        placeholder={km_remolques}
                        onChange={handleChange(setKmEditableRemolques)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDButton
                        size="small"
                        disabled={!authorizedToWrite}
                        variant="gradient"
                        color="dark"
                        onClick={() => {
                          setShowRemolqueDos(true);
                        }}
                      >
                        +
                      </MDButton>
                    </Grid>
                    {showRemolqueDos && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Autocomplete
                            options={inputData.allRemolques.map((option) => option.clave)}
                            disabled={disabled}
                            onChange={async (event, newValue) => {
                              if (newValue) {
                                const req: ClaveRequest = { clave: newValue };
                                const remolqueId = await getRemolqueByClave(newValue);
                                setRemolqueDos(newValue);
                                setIdRemolqueDos(remolqueId);
                                const hubodometroRequest: ClaveRequest = {
                                  clave: req.clave.replace(/\s/g, ""),
                                };
                                const currentHub: Hubodometro = await getHubodometroByClave(
                                  hubodometroRequest
                                );
                                console.log(currentHub);
                                setIdHubodometroSegundoRemolque(currentHub.id);
                                setKmSegundoRemolque(currentHub.km_totales);
                                setKmEditableSegundoRemolques(currentHub.km_totales);
                              }
                            }}
                            renderInput={(params) => (
                              <FormField
                                variant="outlined"
                                {...params}
                                label="Remolque 2"
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormField
                            disabled={true}
                            value={kmSegundoRemolque}
                            variant="outlined"
                            label="Km Totales"
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <FormField
                            disabled={false}
                            variant="outlined"
                            label="Km Editable"
                            placeholder={kmSegundoRemolque}
                            onChange={handleChange(setKmEditableSegundoRemolques)}
                          />
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={4}>
                      <Autocomplete
                        options={inputData.allDollys.map((option) => option.clave)}
                        disabled={disabled}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            const req: ClaveRequest = { clave: newValue };
                            const dollyId = await getDollyFromClave(newValue);
                            setIdDollys(dollyId);
                            setDolly(newValue);
                            const hubodometroRequest: ClaveRequest = {
                              clave: newValue.replace(/\s/g, "O-"),
                            };
                            const currentHub: Hubodometro = await getHubodometroByClave(
                              hubodometroRequest
                            );

                            setIdHubodometroDolly(currentHub.id);
                            setKmDollys(currentHub.km_totales);
                            setKmEditableDollys(currentHub.km_totales);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            variant="outlined"
                            {...params}
                            label="Dolly"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        disabled={true}
                        value={km_dollys}
                        variant="outlined"
                        label="Km Totales"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormField
                        disabled={disabled}
                        variant="outlined"
                        label="Km Editable"
                        placeholder={km_dollys}
                        onChange={handleChange(setKmEditableDollys)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <MDInput
                        style={{ width: "100%" }}
                        disabled={disabled}
                        multiline
                        variant="outlined"
                        label="Observaciones"
                        onChange={handleChange(setObservacion)}
                      />
                    </Grid>
                    {/* Actividad Dropdown */}
                    <Grid item xs={12} sm={12}>
                      <Autocomplete
                        options={allActividades.map((option) => option.descripcion)}
                        disabled={disabled}
                        onChange={async (event, newValue) => {
                          if (newValue) {
                            const req: ClaveRequest = { clave: newValue };
                            const actvidadId = await getIdByDescripcion(req);
                            setIdActividad(actvidadId);
                          }
                        }}
                        renderInput={(params) => (
                          <FormField
                            variant="outlined"
                            {...params}
                            label="Nueva Actividad"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <MDButton
                        onClick={async () => {
                          console.log("Button Clicked");

                          const dollyReq: KmReq = {
                            kms: km_editable_dollys,
                            tipo_et: "2",
                          };

                          const tractorReq: KmReq = {
                            kms: km_editable_tractores,
                            tipo_et: "1",
                          };

                          const remolqueReq: KmReq = {
                            kms: km_editable_remolques,
                            tipo_et: "3",
                          };

                          const remolque2Req: KmReq = {
                            kms: km_editable_segundo_remolques,
                            tipo_et: "3",
                          };

                          if (remolqueReq.kms !== null) {
                            const remolquePlanMantenimiento = await getByETAndKms(remolqueReq);
                            setRemolquePlanesMantenimiento(remolquePlanMantenimiento);
                            console.log(remolquePlanMantenimiento);

                            setShowActividadesRemolque(true);
                          }
                          if (tractorReq.kms != null) {
                            if (tractorReq.kms > 700000) {
                              tractorReq.kms = 0;
                              console.log("");
                            }
                            const remolquePlanMantenimiento = await getByETAndKms(tractorReq);
                            setTractorPlanesMantenimiento(remolquePlanMantenimiento);
                            setShowActividadesTractor(true);
                          }
                          if (dollyReq.kms != null) {
                            console.log(dollyReq);
                            const remolquePlanMantenimiento = await getByETAndKms(dollyReq);
                            setDollyPlanesMantenimiento(remolquePlanMantenimiento);
                            console.log(dollyPlanesMantenimiento);
                            setShowActividadesDolly(true);
                          }
                          if (remolque2Req.kms != null) {
                            const remolquePlanMantenimiento = await getByETAndKms(remolque2Req);
                            setRemolque2PlanesMantenimiento(remolquePlanMantenimiento);
                            setShowActividadesRemolque2(true);
                          }
                        }}
                        variant="gradient"
                        color="dark"
                      >
                        Programar Actividades
                      </MDButton>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDBox display="flex">
                        <MDButton
                          disabled={!authorizedToWrite}
                          variant="gradient"
                          color="dark"
                          onClick={() => {
                            setShowNuevaReparacion(true);
                          }}
                        >
                          Nueva Reparacion
                        </MDButton>
                      </MDBox>
                    </Grid>
                  </Grid>

                  {showNuevaReparacion && (
                    <>
                      <div>
                        <NuevaReparacion
                          ref={newReparacionRef}
                          disabled={false}
                          pushToDB={pushNuevaReparacion}
                        />
                      </div>
                    </>
                  )}

                  <br />
                  {showActividadesDolly && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <DataTableNoLayout
                          dataTableData={{
                            rows: dollyPlanesMantenimiento,
                            columns: dollyColumns,
                          }} // Pass the state to the prop.
                          title="Actividades Dolly"
                          description="Actividades Programadas Dolly"
                          buttonEditable={true}
                        />
                      </Grid>
                    </>
                  )}
                  {showActividadesTractor && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <DataTableNoLayout
                          dataTableData={{
                            rows: tractorPlanesMantenimiento,
                            columns: tractorColumns,
                          }} // Pass the state to the prop.
                          title="Actividades Tractor"
                          description="Actividades Programadas tractores"
                          buttonEditable={true}
                        />
                      </Grid>
                    </>
                  )}

                  {showActividadesRemolque && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <DataTableNoLayout
                          dataTableData={{
                            rows: remolquePlanesMantenimiento,
                            columns: remolqueColumns,
                          }} // Pass the state to the prop.
                          title="Actividades Remolque"
                          description="Actividades Programadas Remolque"
                          buttonEditable={true}
                        />
                      </Grid>
                    </>
                  )}

                  {showActividadesRemolque2 && (
                    <>
                      <Grid item xs={12} sm={12}>
                        <DataTableNoLayout
                          dataTableData={{
                            rows: remolque2PlanesMantenimiento,
                            columns: remolqueColumns,
                          }} // Pass the state to the prop.
                          title="Actividades Remolque"
                          description="Actividades Programadas Remolque"
                          buttonEditable={true}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              <MDBox display="flex">
                {showSuccessAlert && <Alert severity="success">Orden creada exitosamente.</Alert>}
              </MDBox>
              {/* <MDBox display="flex">
                {showSuccessActividadPost && (
                  <Alert severity="success">Actividad de Reparación creada exitosamente.</Alert>
                )}
              </MDBox> */}
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </MDBox>
          )}
          {!authorizedToRead && <Alert severity="error">Sin permisos.</Alert>}
        </>
      }
    </Card>
  );
}

export default OrdenMantenimientoForm;
