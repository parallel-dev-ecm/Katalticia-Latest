import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { useHubodometroStore, Hubodometro } from "stores/Mantenimiento/Store_Hubodometro";
import { date } from "yup";

function HubodometroCatalogo(): JSX.Element {
  const getAllMarcas = useHubodometroStore((state) => state.readAllPuestos);
  const allCC = useHubodometroStore((state) => state.allPuestos);
  const postCC = useHubodometroStore((state) => state.addPuesto);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);

  useEffect(() => {
    getAllMarcas();
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
      SetAuthorizedToRead(user.readMantenimientoET);
      SetAuthorizedToWrite(user.editMantenimientoEt);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: Hubodometro) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (
    data: Hubodometro
  ): { Header: string; accessor: string; Cell?: any }[] => {
    const hubodometroKeys = Object.keys(data);
    return hubodometroKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
      Cell: ({ value }: { value: Date }) => {
        if (key === "fec_instalacion" || key === "fec_baja") {
          const dateValue = new Date(value); // Try to convert to Date

          const year = dateValue.getFullYear();
          return year === 1900 ? "" : dateValue.toLocaleDateString(); // or any custom formatting you prefer
        } else {
          return value != null ? value : ""; // Adjust this logic based on the actual types and requirements
        }
      },
    }));
  };

  const hubodometroModalInputs = [
    { label: "Clave ET", dbName: "clave_et", type: "text" },
    { label: "Tipo ET", dbName: "tipo_et", type: "text" },
    { label: "Estatus", dbName: "estatus", type: "text" },
    { label: "Km Actuales", dbName: "km_actuales", type: "text" },
    { label: "Km Totales", dbName: "km_totales", type: "text" },
    { label: "Fecha Última Act.", dbName: "fec_ult_act", type: "date" },
    { label: "Fecha Instalación", dbName: "fec_instalacion", type: "date" },
    { label: "Fecha Baja", dbName: "fec_baja", type: "date" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as Hubodometro));

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nuevo Hubodometro."
          title="Hubodometro"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general Hubodometro"
          buttonEditable={authorizedToWrite}
          modalInputs={hubodometroModalInputs}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default HubodometroCatalogo;
