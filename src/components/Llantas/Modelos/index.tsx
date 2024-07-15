import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import { MarcaET, useMarcasETStore } from "stores/GestionET/Store_MarcasET";
import Unauthorized from "components/Resources/Unauthorized";
import { useMarcasLlantasStore } from "stores/Llantas/Marcas";

function ModelosLlantas(): JSX.Element {
  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Descripción", accessor: "descripcion" },
  ];

  const getAllMarcas = useMarcasLlantasStore((state) => state.readAllData);
  const allCC = useMarcasLlantasStore((state) => state.allData);
  const postCC = useMarcasLlantasStore((state) => state.addData);
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const readPath = "/llantas/getAllModelos";
  const pushPath = "/llantas/postModelosLlantas";

  useEffect(() => {
    getAllMarcas(readPath);
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

  const handleAddCentroCostos = async (data: MarcaET) => {
    const isSuccess = await postCC(data, pushPath);
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
          dialogTitle="Añadir nuevo modelo de llantas."
          title="Modelos de llantas"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información General de las Modelos de llantas"
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

export default ModelosLlantas;
