import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";

import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import {
  useAreasStore,
  CategoriaColaborador,
} from "stores/GestionTalento/Store_AreasColaboradores";
import { useColaboradoresStore, Colaborador } from "stores/GestionTalento/Store_Colaboradores";

function CategoriasColaboradores(): JSX.Element {
  // const columns = [
  //   { Header: "Clave", accessor: "clave" },
  //   { Header: "Descripcion", accessor: "descripcion" },
  // ];

  const getAllMarcas = useColaboradoresStore((state) => state.readAllPuestos);
  const allCC = useColaboradoresStore((state) => state.allPuestos);
  const postCC = useColaboradoresStore((state) => state.addPuesto);
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

  const handleAddCentroCostos = async (data: Colaborador) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: Colaborador): { Header: string; accessor: string }[] => {
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
    { label: "Nombre", dbName: "nombre", type: "text" },
    { label: "Apellido Paterno", dbName: "apellido_pat", type: "text" },
    { label: "Apellido Materno", dbName: "apellido_mat", type: "text" },
    { label: "Fecha de Nacimiento", dbName: "fecha_nac", type: "date", format: "YYYY-MM-DD" },
    { label: "Estatus", dbName: "estatus", type: "text" },
    { label: "Fecha de Ingreso", dbName: "fecha_ingreso", type: "date", format: "YYYY-MM-DD" },
    { label: "Fecha de Baja", dbName: "fecha_baja", type: "date", format: "YYYY-MM-DD" },
    { label: "Tipo Sanguíneo", dbName: "tipo_sanguineo", type: "text" },
    { label: "Teléfono de Contacto", dbName: "tel_contacto", type: "text" },
    { label: "Email", dbName: "email", type: "email" },
    { label: "Número de Emergencia", dbName: "num_emergencia", type: "text" },
    { label: "Número de Seguro Social", dbName: "num_ss", type: "text" },
    { label: "RFC", dbName: "rfc", type: "text" },
    { label: "ID Categoría", dbName: "id_categoria", type: "number" },
    { label: "ID Área", dbName: "id_area", type: "number" },
    { label: "ID Puesto", dbName: "id_puesto", type: "number" },
    { label: "Calle", dbName: "calle", type: "text" },
    { label: "Número Exterior", dbName: "num_ext", type: "text" },
    { label: "Número Interior", dbName: "num_int", type: "text" },
    { label: "Código Postal", dbName: "cp", type: "text" },
    { label: "Colonia", dbName: "colonia", type: "text" },
    { label: "Ciudad", dbName: "ciudad", type: "text" },
    { label: "Municipio", dbName: "municipio", type: "text" },
    { label: "Estado", dbName: "estado", type: "text" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as Colaborador));

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nueva categoria."
          title="Categorias de colaboradores"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de las categorias de colaboradores"
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
