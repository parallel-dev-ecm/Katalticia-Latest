import OrdenMantenimientoForm from "components/Resources/OrdenMantenimiento/CreateOrden";
import GetOrdenMantenimiento from "components/Resources/OrdenMantenimiento/GetOrden";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

type Props = {};

function CreateOrdenMantenimientoIndex({}: Props) {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <br />
      <OrdenMantenimientoForm />
    </DashboardLayout>
  );
}

export default CreateOrdenMantenimientoIndex;
