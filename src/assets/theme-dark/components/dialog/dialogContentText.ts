// Material Dashboard 2 PRO React TS Base Styles
import typography from "assets/theme-dark/base/typography";
import colors from "assets/theme-dark/base/colors";

// Material Dashboard 2 PRO React TS Helper Functions
import rgba from "assets/theme-dark/functions/rgba";

const { size } = typography;
const { white, black } = colors;

// types
type Types = any;

const dialogContentText: Types = {
  styleOverrides: {
    root: {
      fontSize: size.md,
      color: rgba(white.main, 0.8),
    },
  },
};

export default dialogContentText;
