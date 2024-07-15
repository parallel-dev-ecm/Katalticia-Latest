import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { CargasCombustibles, useCargasCombustiblesStore } from "stores/GestionDiesel/Store_CargasCombustibles";

function CatalogoCargasCombustible(): JSX.Element {
  const getAllMarcas = useCargasCombustiblesStore((state) => state.readAllPuestos);
  const allCC = useCargasCombustiblesStore((state) => state.allPuestos);
  const postCC = useCargasCombustiblesStore((state) => state.addPuesto);
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

  const handleAddCentroCostos = async (data: CargasCombustibles) => {
    const isSuccess = await postCC(data);
    if (isSuccess) {
      document.location.reload();
    } else {
      console.log("Failed to add.");
    }
  };
  const generateColumns = (data: CargasCombustibles): { Header: string; accessor: string }[] => {
    // Assuming Colaborador is an interface, you can get its keys using Object.keys
    const colaboradorKeys = Object.keys(data);

    // Dynamically generate the columns array
    return colaboradorKeys.map((key) => ({
      Header: key.charAt(0).toUpperCase() + key.slice(1),
      accessor: key,
    }));
  };
  const modalInputs = [
    { label: "Folio", dbName: "folio", type: "text" },
    { label: "Serie", dbName: "serie", type: "text" },
    { label: "Fecha Carga", dbName: "fecha_carga", type: "date" },
    { label: "Fecha Captura", dbName: "fecha_captura", type: "date" },
    { label: "Id Combustible", dbName: "id_combustible", type: "text" },
    { label: "Id Estacion Servicio", dbName: "id_estacionservicio", type: "text" },
    { label: "Litros", dbName: "litros", type: "text" },
    { label: "Odometro", dbName: "odometro", type: "text" },
    { label: "Clave Proveedor", dbName: "clave_proveedor", type: "text" },
    { label: "Id Tractore", dbName: "id_tractores", type: "text" },
    { label: "Id Auto Admn", dbName: "id_autoadmin", type: "text" },
    { label: "Id Centro Costos", dbName: "id_centrocostos", type: "text" },
    { label: "Id Colaborador", dbName: "id_colaborador", type: "text" },
    { label: "Tipo ET", dbName: "tipo_et", type: "text" },
  ];

  // Assuming allCC is an array of Colaborador objects
  const columns = generateColumns(allCC.length > 0 ? allCC[0] : ({} as CargasCombustibles));

  return (
    <>
      {authorizedToRead && (
        <DataTableWithModal
          dialogTitle="Añadir nuevo carga de combustible."
          title="Cargas de combustible"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de las cargas de combustible"
          buttonEditable={authorizedToWrite}
          modalInputs={modalInputs}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default CatalogoCargasCombustible;
