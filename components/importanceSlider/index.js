import Slider from "@mui/material/Slider";
import { ThemeProvider } from "@mui/material/styles";

import theme from "../../styles/theme.js";

import styles from "./importanceSlider.module.scss";

export default function ImportanceSlider({
  sub,
  defaultValue,
  updateScores,
  onRemove,
}) {
  const handleSliderChange = (event) => {
    event.preventDefault();
    let newValue = event.target.value;
    if (sub.param)
      updateScores({
        [`${sub.param}`]: newValue,
      });
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
        htmlFor={`${sub.name}-slider`}
        className={`${styles.sidebarParam} form-label`}
      >
        <p className={styles.title}>
          {sub.text}
          {onRemove && (
            <div className="float-end" onClick={() => onRemove(sub)}>
              X
            </div>
          )}
        </p>
      </label>
      <div className={`${styles.slider} text-center`}>
        <ThemeProvider theme={theme}>
          <Slider
            aria-label="Importance"
            defaultValue={defaultValue}
            getAriaValueText={getValueText}
            valueLabelFormat={getValueText}
            valueLabelDisplay="auto"
            step={1}
            min={0}
            max={4}
            onChange={handleSliderChange}
            color="primary"
            sx={{ width: "90%" }}
            id={`${sub.name}-slider`}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}
