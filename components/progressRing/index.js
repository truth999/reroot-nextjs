import * as React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Row from "react-bootstrap/Row";

export default function ProgressRing(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        size={16 * 10}
        color="primary"
        variant="determinate"
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
          <Row bsPrefix="text-center fw-bold fs-4">{`${Math.round(
            props.value
          )}th`}</Row>
          <Row bsPrefix="text-center ">{`${props.label}`}</Row>
        </div>
      </Box>
    </Box>
  );
}

ProgressRing.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};
