import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import styles from "./breakdown.module.scss";

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
          <Box
            key={index}
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
        );
      })}
    </Stack>
  );
}
