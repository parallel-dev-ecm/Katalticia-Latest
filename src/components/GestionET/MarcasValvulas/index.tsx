import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { MarcaValvulas, useMarcaValvulasStore } from "stores/GestionET/Store_MarcasValvulas";

function MarcasET(): JSX.Element {
  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Descripción", accessor: "descripcion" },
  ];

  const getAllMarcas = useMarcaValvulasStore((state) => state.readAllMarcas);
  const allCC = useMarcaValvulasStore((state) => state.allMarcas);
  const postCC = useMarcaValvulasStore((state) => state.addMarca);
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
      SetAuthorizedToRead(user.readET);
      SetAuthorizedToWrite(user.editTransporte);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: MarcaValvulas) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nueva marca de valvulas."
          title="Marcas de Valvulas"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información General de las marcas de valvulas"
          buttonEditable={authorizedToWrite}
          modalInputs={[
            { label: "Clave", dbName: "clave", type: "text" },
            { label: "Descripción", dbName: "descripcion", type: "text" },
          ]}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default MarcasET;
