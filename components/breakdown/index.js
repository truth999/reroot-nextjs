import React, { useState, useRef } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Typography from "@mui/material/Typography";
import styles from "./breakdown.module.scss";
import to2digits from "../../utils";

import colorSteps from "color-steps";

export default function Breakdown({ breakdown }) {
  const lightest = "#F2E4E2";
  const darkest = "#BA4D3A";
  const scores = Object.entries(breakdown);
  const colors = colorSteps(lightest, darkest, scores.length);

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "2rem",
        backgroundColor: "#D8D8D8",
      }}
    >
      {scores.map(([factor, score], index) => {
        console.log(parseFloat(score) * 10);
        return (
          <OverlayTrigger
            key={index}
            placement="top"
            overlay={
              <Tooltip id={`${index}-tooltip`}>{to2digits(score)}</Tooltip>
            }
          >
            <Box
              sx={{
                width: `${parseFloat(score) * 10}%`,
                backgroundColor: colors[index],
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
              {factor}
            </Box>
          </OverlayTrigger>
        );
      })}
    </Stack>
  );
}
