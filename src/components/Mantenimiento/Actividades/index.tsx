import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { useActividadesStore, Actividad } from "stores/Mantenimiento/Store_Actividades";

function Actividades(): JSX.Element {
  const getAllMarcas = useActividadesStore((state) => state.readAllPuestos);
  const allCC = useActividadesStore((state) => state.allPuestos);
  const postCC = useActividadesStore((state) => state.addPuesto);
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

  const handleAddCentroCostos = async (data: Actividad) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: Actividad): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const modalInputs = [
    { label: "Id criterio", dbName: "id_criterio", type: "text" },
    { label: "Id Pieza", dbName: "id_pieza", type: "text" },
    { label: "Descripción", dbName: "descripcion", type: "text" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as Actividad));

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nueva actividad."
          title="Actividades"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de las Actividades de Mantenimiento"
          buttonEditable={authorizedToWrite}
          modalInputs={modalInputs}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default Actividades;
