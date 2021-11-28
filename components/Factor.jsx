import styles from "./Factor.module.scss";

export function Factor(props) {
  return (
    <div className={`${styles.factor} col-xs-6 col-md-4 col-lg-3 pb-4`}>
      <input
        type="checkbox"
        className="btn-check"
        autoComplete="off"
        name="factor"
        id={props.id}
        value={props.name}
        param={props.param}
        onClick={props.onClick}
      />
      <label
        className={`btn btn-outline-dark ${styles.factor}`}
        htmlFor={props.id}
      >
        {props.text}
      </label>
    </div>
  );
}
