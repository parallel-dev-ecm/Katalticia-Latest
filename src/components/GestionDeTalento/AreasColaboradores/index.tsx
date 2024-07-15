import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";

import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import {
  useAreasStore,
  CategoriaColaborador,
} from "stores/GestionTalento/Store_AreasColaboradores";

function CategoriasColaboradores(): JSX.Element {
  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Descripcion", accessor: "descripcion" },
  ];

  const getAllMarcas = useAreasStore((state) => state.readAllPuestos);
  const allCC = useAreasStore((state) => state.allPuestos);
  const postCC = useAreasStore((state) => state.addPuesto);
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
      SetAuthorizedToRead(user.readRH);
      SetAuthorizedToWrite(user.editRh);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  const handleAddCentroCostos = async (data: CategoriaColaborador) => {
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
          dialogTitle="Añadir nueva categoria."
          title="Categorias de colaboradores"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de las categorias de colaboradores"
          buttonEditable={authorizedToWrite}
          modalInputs={[
            { label: "Clave", dbName: "clave", type: "text" },
            { label: "Descripcion", dbName: "descripcion", type: "text" },
          ]}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default CategoriasColaboradores;
