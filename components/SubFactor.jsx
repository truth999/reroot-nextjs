import styles from "./SubFactor.module.scss";

export default function SubFactor(props) {
  return (
    <div className={`${styles.subFactor}`}>
      <input
        type="radio"
        className="btn-check"
        name={props.name}
        id={props.id}
        value={props.value}
        param={props.param}
        onClick={props.onClick}
        autoComplete="off"
      />
      <label className={`btn btn-outline-dark`} htmlFor={props.id}>
        {props.children}
      </label>
    </div>
  );
}
