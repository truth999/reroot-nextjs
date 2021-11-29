import styles from "./nextButton.module.scss";

export default function nextButton(props) {
  return (
    <input
      className={`${styles.button} btn btn-dark`}
      type="button"
      value={props.children}
      name="next"
      disabled={props.disabled}
      onClick={props.handleClick}
    />
  );
}
