import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

const primary = "#E7654B";

export default styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(primary),
  backgroundColor: primary,
  "&:hover": {
    backgroundColor: "#BA4D3A",
  },
}));
