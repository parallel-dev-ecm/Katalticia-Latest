import DataTableWithModal from "components/Resources/DataTableWithModal";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import Unauthorized from "components/Resources/Unauthorized";
import { VehiculoAdmin, useVehicleStore } from "stores/GestionET/Store_VehiculosAdmin";

function Vehiculos_Admn(): JSX.Element {
  const columns = [
    { Header: "Clave", accessor: "clave" },
    { Header: "Nombre Largo", accessor: "nombre_largo" },
    { Header: "Modelo", accessor: "modelo" },
    { Header: "Año", accessor: "año" },
    { Header: "Serie_motor", accessor: "serie_motor" },
    { Header: "Placas", accessor: "placas" },
    { Header: "Num. ejes", accessor: "num_ejes" },
    { Header: "Centro De Costos", accessor: "centrocosto_nombre" },
    { Header: "Estatus", accessor: "estatus_description" },
    { Header: "Marca ET", accessor: "marcaet_description" },
  ];

  const getAllMarcas = useVehicleStore((state) => state.readAllVehiculos);
  const allCC = useVehicleStore((state) => state.allVehiculos);
  const postCC = useVehicleStore((state) => state.addVehiculo);
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

  const handleAddCentroCostos = async (data: VehiculoAdmin) => {
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
          dialogTitle="Añadir nuevo Vehiculo Administrativo."
          title="Vehiculos Administrativos"
          dataTableData={{ rows: allCC, columns: columns }} // Pass the state to the prop.
          description="Información general de los vehiculos administrativos"
          buttonEditable={authorizedToWrite}
          modalInputs={[
            { label: "Clave", dbName: "clave", type: "text" },
            { label: "Nombre Largo", dbName: "nombre_largo", type: "text" },
            { label: "Modelo", dbName: "modelo", type: "text" },
            { label: "Año", dbName: "año", type: "number" },
            { label: "Serie Motor", dbName: "serie_motor", type: "text" },
            { label: "Num. Ejes", dbName: "num_ejes", type: "text" },
            { label: "Placas", dbName: "placas", type: "text" },
            { label: "ID Producto", dbName: "id_producto", type: "text" },
            { label: "ID Centro De Costos", dbName: "id_centrocosto", type: "text" },
            { label: "ID Estatus", dbName: "id_estatus", type: "text" },
            { label: "ID Marca ET", dbName: "id_marcaet", type: "text" },
          ]}
          onAdd={handleAddCentroCostos}
        />
      )}
      {!authorizedToRead && <Unauthorized />}
    </>
  );
}

export default Vehiculos_Admn;
