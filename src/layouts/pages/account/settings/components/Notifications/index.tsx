import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Setting pages components
import TableCell from "layouts/pages/account/settings/components/TableCell";
import { Box, Checkbox } from "@mui/material";
import { useUsersStore, User } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";
import { useAuthStore } from "stores/Store_Auth";
import Unauthorized from "components/Resources/Unauthorized";

function Notifications(): JSX.Element {
  const fetchUserApi = useUsersStore((state) => state.getUsers);
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<boolean>(false);
  const excludedUsernames = ["emilio.admin", "erick.admin", "max.admin", "daniel.admin"]; // Add as many usernames as you want to exclude

  const getUser = useAuthStore((state) => state.currentUser);
  useEffect(() => {
    fetchUserApi();
  }, []);
  useEffect(() => {
    // Get username from sessionStorage
    const storedUsername = sessionStorage.getItem("userName");

    const user = allUsers.find((u) => u.username === storedUsername);

    if (user) {
      setCurrentUser(user);
      SetAuthorizedToRead(user.readGenerales);
      SetAuthorizedToWrite(user.editGenerales);
    } else {
      console.log("User not found");
    }
  }, [allUsers]);

  return (
    <>
      {!authorizedToRead && (
        <Card>
          <MDBox
            p={3}
            lineHeight={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <MDTypography variant="h5" fontWeight="medium">
                {"404"}
              </MDTypography>
              <MDTypography variant="button" color="text">
                {"No cuenta con permisos para visualizar esta página"}
              </MDTypography>
            </Box>
          </MDBox>
        </Card>
      )}
      {authorizedToRead && (
        <Card id="notifications">
          <MDBox p={3} lineHeight={1}>
            <MDBox mb={1}>
              <MDTypography variant="h5">Seguridad del sistema</MDTypography>
            </MDBox>
            <MDTypography variant="button" color="text">
              Revisa como estan asignados los permisos del sistema.
            </MDTypography>
          </MDBox>

          <MDBox pb={3} px={3}>
            <MDBox minWidth="auto" sx={{ overflow: "scroll" }}>
              <Table sx={{ minWidth: "36rem" }}>
                <MDBox component="thead">
                  <TableRow>
                    <TableCell width="50%" padding={[1.5, 3, 1.5, 0.5]}>
                      Usuario
                    </TableCell>
                    <TableCell width="50%" align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Generales
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Generales
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Equipos de T.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Equipos de T.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura RH
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura RH
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Gestión C.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Gestión.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Mantenimiento de E.T
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Mantenimiento de E.T.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Inventario de R.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Inventario de R.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Lectura Logistica.
                    </TableCell>
                    <TableCell align="center" padding={[1.5, 3, 1.5, 3]}>
                      Escritura Logistica.
                    </TableCell>
                  </TableRow>
                </MDBox>
                <TableBody>
                  {allUsers
                    .filter((user) => !excludedUsernames.includes(user.username)) // Exclude users whose usernames are in the excludedUsernames array
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell padding={[1, 1, 1, 0.5]}>
                          <MDBox lineHeight={1.4}>
                            <MDTypography display="block" variant="button" fontWeight="regular">
                              {user.name}
                            </MDTypography>
                          </MDBox>
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readGenerales} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editGenerales} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readET} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editTransporte} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readRH} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editRh} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readGestionC} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editCombustibles} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readMantenimientoET} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editMantenimientoEt} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readInvRefacciones} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editRefacciones} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.readLogistics} />
                        </TableCell>
                        <TableCell align="center" padding={[1, 1, 1, 0.5]}>
                          <Checkbox disabled defaultChecked={user.editLogistica} />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </MDBox>
          </MDBox>
        </Card>
      )}
    </>
  );
}

export default Notifications;
