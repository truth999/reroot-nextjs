import styles from "./factor.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";

export default function Factor({ name, id, param, value, onClick, children }) {
  return (
    <Col xs={6} md={5} lg={4} xl={3} className={`${styles.factor} pb-4`}>
      <input
        type="checkbox"
        className="btn-check"
        name={name}
        id={id}
        value={value}
        param={param}
        onClick={onClick}
        autoComplete="off"
      />
      <label className={`btn btn-test`} htmlFor={id}>
        {children}
      </label>
    </Col>
  );
}
