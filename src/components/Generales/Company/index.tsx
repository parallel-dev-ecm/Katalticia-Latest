// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import { User } from "stores/Generales/Store_Users";

// Overview page components
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Sidenav from "layouts/pages/account/settings/components/Sidenav";
import Header from "layouts/pages/account/settings/components/Header";
import BasicInfo from "layouts/pages/account/settings/components/BasicInfo";
import { useAuthStore } from "stores/Store_Auth";
import { useUsersStore } from "stores/Generales/Store_Users";
import { useEffect, useState } from "react";

function Overview(): JSX.Element {
  const allUsers = useUsersStore((state) => state.allUsers);
  const [currentUser, setCurrentUser] = useState<User>();
  const [authorizedToRead, SetAuthorizedToRead] = useState<Boolean>(false);
  const [authorizedToWrite, SetAuthorizedToWrite] = useState<Boolean>(false);

  const getUser = useAuthStore((state) => state.currentUser);
  const fetchUserApi = useUsersStore((state) => state.getUsers);

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
    <BaseLayout>
      <MDBox mt={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={3}>
            <Sidenav />
          </Grid>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Header />
                </Grid>
                <Grid item xs={12}>
                  {<BasicInfo />}
                </Grid>

                {/* <Grid item xs={12}>
                  <DeleteAccount />
                </Grid> */}
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
}

export default Overview;
