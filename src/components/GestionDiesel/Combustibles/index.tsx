import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { useCombustiblesStore, Combustibles } from "stores/GestionDiesel/Store_Combustibles";

function CategoriasColaboradores(): JSX.Element {
  const getAllMarcas = useCombustiblesStore((state) => state.readAllPuestos);
  const allCC = useCombustiblesStore((state) => state.allPuestos);
  const postCC = useCombustiblesStore((state) => state.addPuesto);
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
      SetAuthorizedToRead(user.readGestionC);
      SetAuthorizedToWrite(user.editCombustibles);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: Combustibles) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: Combustibles): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const modalInputs = [
    { label: "Clave", dbName: "clave", type: "text" },
    { label: "Descripcion", dbName: "descripcion", type: "text" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as Combustibles));

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nuevo combustible."
          title="Combustibles disponibles"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de los combustibles"
          buttonEditable={authorizedToWrite}
          modalInputs={modalInputs}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default CategoriasColaboradores;
