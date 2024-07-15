import OrdenMantenimientoForm from "components/Resources/OrdenMantenimiento/CreateOrden";
import GetOrdenMantenimiento from "components/Resources/OrdenMantenimiento/GetOrden";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

type Props = {};

function OrdenMantenimientoIndex({}: Props) {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <br />
      <GetOrdenMantenimiento />
    </DashboardLayout>
  );
}

export default OrdenMantenimientoIndex;
