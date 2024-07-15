import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import PageLayout from "examples/LayoutContainers/PageLayout";
import { useAuthStore } from "stores/Store_Auth";
import { ChangeEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import truckLogo from "../../../assets/images/logoTruck.png";

import bgImage1 from "assets/images/truck1.jpg";
import bgImage2 from "assets/images/truck2.png";
import bgImage3 from "assets/images/image.png";
import bgImage4 from "assets/images/foto2.jpg";

import Footer from "../Components/CoverLayout/Footer";
import MDBox from "components/MDBox";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit">Katalitica</Link> {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const images = [bgImage1, bgImage2, bgImage3, bgImage4];

export default function SignInSide() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const el = useRef();
  const imageRef = useRef();

  const mainBox = useRef();
  const signInRef = useRef();
  const tl = gsap.timeline();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboards/analytics");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      function updateImageIndex() {
        // Update image index
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);

        // Set opacity back to 1
        gsap.to(el.current, { opacity: 1, duration: 1 });
      }
      // Animate opacity out
      gsap.to(el.current, { opacity: 0, duration: 1, onComplete: updateImageIndex });
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mainBoxTween = gsap.fromTo(mainBox.current, { scale: 0 }, { scale: 1 });
      tl.add(mainBoxTween);

      const signInTween = gsap.fromTo(signInRef.current, { opacity: 0 }, { opacity: 1 });
      tl.add(signInTween);
    }, el);

    // cleanup function will be called when the component is removed
    return () => {
      ctx.revert(); // animation cleanup!!
    };
  }, [el]);

  const handleLogin = async () => {
    const success = await authenticate(username, password);
    if (success) {
      navigate("/dashboards/analytics");
    } else {
      console.log(success);
    }
  };

  return (
    <div>
      <PageLayout>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <Grid
            ref={el}
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
              backgroundImage: `url(${images[currentImageIndex]})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
              ref={signInRef}
              component="form"
              noValidate
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Inicia Sesión en el TMS
              </Typography>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Usuario"
                name="usuario"
                autoComplete="user"
                autoFocus
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="password"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin} fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                <Typography component="p" variant="h6">
                  Iniciar Sesión
                </Typography>
              </Button>
              <Copyright sx={{ mt: 5 }} />
              <MDBox component="div" pr={2} lineHeight={5}>
                <MDBox component="img" onClick={() => {}} src={truckLogo} width="10rem" />
              </MDBox>{" "}
            </Box>
          </Grid>
        </Grid>
      </PageLayout>
    </div>
  );
}
