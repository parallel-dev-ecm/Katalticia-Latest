// Material Dashboard 2 PRO React TS Base Styles
import borders from "assets/theme-dark/base/borders";
import boxShadows from "assets/theme-dark/base/boxShadows";

const { borderRadius } = borders;
const { xxl } = boxShadows;

// types
type Types = any;

const dialog: Types = {
  styleOverrides: {
    paper: {
      //backgroundColor: "#000 !important", // Set background to black
      borderRadius: borderRadius.lg,
      boxShadow: xxl,
    },

    paperFullScreen: {
      borderRadius: 0,
    },
  },
};

export default dialog;
