// @mui material components
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";
import truckLogo from "./KataliticaLogo_Truck.png";
// Material Dashboard 2 PRO React TS components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
// Material Dashboard 2 PRO React TS Base Styles
import typography from "assets/theme/base/typography";
import { Image } from "@mui/icons-material";

// Declaring props types for Footer
interface Props {
  company?: {
    href: string;
    name: string;
  };
  links?: {
    href: string;
    name: string;
  }[];
  [key: string]: any;
}

function Footer({ company, links }: Props): JSX.Element {
  const { href, name } = company;
  const { size } = typography;

  const renderLinks = () =>
    links.map((link) => (
      <MDBox key={link.name} component="li" px={2} lineHeight={1}>
        <Link href={link.href} target="_blank">
          <MDTypography variant="button" fontWeight="regular" color="text">
            {link.name}
          </MDTypography>
        </Link>
      </MDBox>
    ));

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()}, Hecho por
        <MDTypography variant="button" fontWeight="medium">
          &nbsp;{name}&nbsp;
        </MDTypography>
        <MDBox fontSize={size.md} color="text" mb={-0.5} mx={0.25}>
          <LocalShippingIcon />
        </MDBox>
      </MDBox>
      <MDBox
        component="ul"
        sx={({ breakpoints }) => ({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
          listStyle: "none",
          mt: 3,
          mb: 0,
          p: 0,

          [breakpoints.up("lg")]: {
            mt: 0,
          },
        })}
      >
        <MDBox component="img" onClick={() => {}} src={truckLogo} width="5rem" />
      </MDBox>
    </MDBox>
  );
}

// Declaring default props for Footer
Footer.defaultProps = {
  company: { href: "/", name: "Katalitica-TMS" },
  // links: [
  //   { href: "/", name: "About Us" },
  //   { href: "/", name: "Blog" },
  //   { href: "/", name: "License" },
  // ],
};

export default Footer;
