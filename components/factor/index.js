import styles from "./factor.module.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Col from "react-bootstrap/Col";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";

export default function Factor({
  name,
  id,
  value,
  children,
  handleChange,
  selectedFactors,
  setSelectedFactors,
  country,
  asks = null,
}) {
  let flag = "";
  const [selected, setSelected] = useState(false);

  const FactorToggleButton = styled(ToggleButton)({
    boxShadow: "none",
    textTransform: "none",
    fontSize: "1.1rem",
    padding: "6px 12px",
    border: "0.1rem solid",
    lineHeight: 1.5,
    backgroundColor: "transparent",
    borderColor: "#b4b4b4",
    color: "#3e3e3e",
    fontFamily: ["Marmelad", "sans-serif"].join(","),
    "&:hover": {
      backgroundColor: "#f29c70",
      borderColor: "transparent",
      color: "#fef9f7",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#e7654b",
      borderColor: "#e7654b",
    },
    "&:focus": {
      backgroundColor: "#e7654b",
      boxShadow: "0 0 0 0.2rem rgba(1, 66, 178, 0.5)",
    },
    "&.MuiToggleButton-root.Mui-selected": {
      boxShadow: "none",
      backgroundColor: "#db3c21",
      borderColor: "#fff7ec",
      color: "#fef9f7",
    },
  });

  if (country) {
    flag = country.a2 ? ` flag-icon flag-icon-${country.a2} me-2` : "";
  }

  return (
    <Col xs={6} md={5} lg={4} xl={3} className={`${styles.factor} pb-4`}>
      {false ? (
        <>
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
        </>
      ) : (
        <FactorToggleButton
          name={name}
          id={id}
          value={value}
          selected={selected}
          fullWidth={true}
          onChange={(e) => {
            const factor = parseInt(e.target.value);
            const newSelectedFactors = selected
              ? selectedFactors.filter((f) => f != factor)
              : [...selectedFactors, factor];
            setSelectedFactors(newSelectedFactors);

            // Handle update next
            console.log(`${name}:`, newSelectedFactors);
            handleChange(newSelectedFactors, name, asks);
            setSelected(!selected);
          }}
        >
          {name == "country" && <span className={`${flag}`}></span>}
          {children}
        </FactorToggleButton>
      )}
    </Col>
  );
}
