import styles from "./factor.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";

export default function Factor({
  name,
  id,
  value,
  onClick,
  children,
  country,
}) {
  let flag = "";

  if (country) {
    flag = country.a2 ? ` flag-icon flag-icon-${country.a2} me-2` : "";
  }

  return (
    <Col xs={6} md={5} lg={4} xl={3} className={`${styles.factor} pb-4`}>
      <input
        type="checkbox"
        className="btn-check"
        name={name}
        id={id}
        value={value}
        onClick={onClick}
        autoComplete="off"
      />
      <label className={`btn btn-test`} htmlFor={id}>
        {name == "country" && <span className={`${flag}`}></span>}
        {children}
      </label>
    </Col>
  );
}
