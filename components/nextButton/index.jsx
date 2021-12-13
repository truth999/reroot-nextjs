import styles from "./nextButton.module.scss";
import Button from "react-bootstrap/Button";

export default function nextButton({
  name = "next",
  children,
  disabled,
  handleClick,
}) {
  return (
    <Button
      variant="dark"
      className={`${styles.button}`}
      type="button"
      name={name}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </Button>
  );
}
