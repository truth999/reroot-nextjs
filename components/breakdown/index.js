import React, { useState, useRef, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Typography from "@mui/material/Typography";
import styles from "./breakdown.module.scss";
import { contrastColor } from "contrast-color";
import colorSteps from "color-steps";

export default function Breakdown({
  breakdown,
  parameters,
  getParamText,
  getParameter,
}) {
  const lightest = "#F2E4E2";
  const darkest = "#BA4D3A";
  const scores = Object.entries(breakdown);
  const bgColors = colorSteps(lightest, darkest, scores.length);
  const fgColors = bgColors.map((color) => contrastColor({ bgColor: color }));

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "2rem",
        backgroundColor: "#D8D8D8",
      }}
    >
      {scores.map(([p, score], index) => {
        const parameter = getParameter(p);

        return (
          <OverlayTrigger
            key={parameter.id}
            placement="top"
            overlay={
              <Tooltip id={`${index}-tooltip`}>
                {getParamText(parameter)}
              </Tooltip>
            }
          >
            <Box
              sx={{
                width: `${parseFloat(score)}%`,
                backgroundColor: bgColors[index],
                borderWidth: "0",
                textAlign: "center",
                lineHeight: "1rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                "&:hover": {
                  opacity: [0.9, 0.8, 0.7],
                },
              }}
            >
              <p className={styles.paramText} sx={{ color: fgColors[index] }}>
                {score}
              </p>
            </Box>
          </OverlayTrigger>
        );
      })}
    </Stack>
  );
}
