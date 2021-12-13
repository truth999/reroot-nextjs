import Link from "next/link";
import Image from "next/image";
import styles from "./startButton.module.scss";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export default function StartButton({ to, children, outline }) {
  const OutlineButton = styled(Button)(({ theme }) => ({
    fontSize: "1.5rem",
    border: "0.2rem solid",
    padding: "0.5rem 2rem",
    borderRadius: "1rem",
    backgroundColor: "#FEF9F6",
    "&:hover": {
      border: "0.2rem solid",
      borderRadius: "1rem",
      color: "#0141b3",
      backgroundColor: "#fff",
    },
  }));

  const FilledButton = styled(Button)({
    fontSize: "1.5rem",
    padding: "0.5rem 2rem",
    borderRadius: "1rem",
    backgroundColor: "#ba4d3a",
    color: "#FEF9F6",
    "&:hover": {
      backgroundColor: "#f29c70",
    },
  });

  return (
    <Link href={to} passHref>
      <span>
        {outline ? (
          <OutlineButton color="secondary" size="large">
            {children}
          </OutlineButton>
        ) : (
          <FilledButton color="secondary" size="large">
            {children}
          </FilledButton>
        )}
      </span>
    </Link>
  );
}
