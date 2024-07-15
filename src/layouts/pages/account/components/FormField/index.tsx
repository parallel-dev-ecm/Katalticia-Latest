// Material Dashboard 2 PRO React TS components
import MDInput from "components/MDInput";

// Declaring props types for FormField
interface Props {
  label?: string;
  disabled?: boolean;
  [key: string]: any;
  variant?: "standard" | "outlined";
}

function FormField({ variant, disabled, label, ...rest }: Props): JSX.Element {
  return (
    <MDInput
      variant={variant}
      label={label}
      fullWidth
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      {...rest}
    />
  );
}

// Declaring default props for FormField
FormField.defaultProps = {
  label: " ",
  variant: "standard",
};

export default FormField;
