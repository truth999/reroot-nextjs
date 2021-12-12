import React, { useState, useContext } from "react";

import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../styles/theme.js";

import styles from "./importanceSlider.module.scss";

export default function ImportanceSlider({
  parameter,
  defaultValue,
  updateScores,
  onRemove,
  getParamText,
}) {
  const [value, setValue] = useState(defaultValue);
  const handleSliderChange = (event, newValue) => {
    event.preventDefault();
    setValue(newValue);
    updateScores(parameter.name, newValue);
  };

  const getValueText = (value) => {
    switch (value) {
      case 1:
        return "Somewhat important";
      case 2:
        return "Moderately important";
      case 3:
        return "Very important";
      case 4:
        return "Extremely important";
      default:
        return "Not very important";
    }
  };

  return (
    <div className="slider ps-1">
      <label
        htmlFor={`${parameter.name}-slider`}
        className={`${styles.sidebarParam} form-label`}
      >
        <div className={styles.title}>
          {getParamText(parameter)}
          {onRemove && (
            <div
              className="float-end"
              onClick={() => {
                onRemove(parameter);
              }}
            >
              X
            </div>
          )}
        </div>
      </label>
      <div className={`${styles.slider} text-center`}>
        <ThemeProvider theme={theme}>
          <Slider
            aria-label="Importance"
            defaultValue={defaultValue}
            value={value}
            getAriaValueText={getValueText}
            valueLabelFormat={getValueText}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={4}
            onChange={handleSliderChange}
            color="primary"
            sx={{ width: "90%" }}
            id={`${parameter.name}-slider`}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
