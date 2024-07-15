// @mui material components
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import gsap from "gsap";
import BaseLayout from "layouts/pages/account/components/BaseLayout";
import Header from "layouts/pages/account/settings/components/Header";
import Notifications from "layouts/pages/account/settings/components/Notifications";
import { useLayoutEffect, useRef } from "react";

function UserSecurity(): JSX.Element {
  const tl = gsap.timeline();
  const el = useRef();
  const mainComponentRef = useRef();
  const headerRef = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mainBoxTween = gsap.fromTo(mainComponentRef.current, { opacity: 0 }, { opacity: 1 });
      tl.add(mainBoxTween);
      const headerTween = gsap.fromTo(headerRef.current, { opacity: 0 }, { opacity: 1 });
      tl.add(mainBoxTween);
    }, el);

    // cleanup function will be called when component is removed
    return () => {
      ctx.revert(); // animation cleanup!!
    };
  }, []);
  return (
    <BaseLayout>
      <MDBox pt={6} pb={3}>
        <Grid container spacing={0.1} justifyContent={"center"} alignItems={"center"} ref={el}>
          <Grid item xs={12} lg={9}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} ref={headerRef}>
                  <Header />
                </Grid>
                <Grid item xs={12} ref={mainComponentRef}>
                  <Notifications />
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </BaseLayout>
  );
}

export default UserSecurity;
