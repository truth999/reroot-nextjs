import styles from "./likeButton.module.scss";

export default function LikeButton(props) {
  return (
    <input
      className={`${styles.button} btn`}
      type="button"
      name={`like-${props.county.county_code}`}
      value="♡"
      onClick={props.handleClick}
    />
  );
}
