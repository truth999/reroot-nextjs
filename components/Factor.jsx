import styles from "./Factor.module.scss";

export function Factor(props) {
  return (
    <div className="col-xs-4 col-md-3 col-lg-2">
      <input
        type="checkbox"
        className="btn-check"
        name="factor"
        id={props.id}
        value={props.name}
        autoComplete="off"
        onClick={props.onClick}
      />
      <label
        className={`btn btn-outline-dark ${styles.factor}`}
        htmlFor={props.id}
      >
        {props.name.toUpperCase()}
      </label>
    </div>
  );
}
