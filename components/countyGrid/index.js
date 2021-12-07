import React, { useState, useContext } from "react";

import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PrimaryButton from "../primaryButton";
import Breakdown from "../breakdown";
import DetailsModal from "../detailsModal";
import ProgressRing from "../progressRing";
import Grid from "@mui/material/Grid";
import Popover from "@mui/material/Popover";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Typography from "@mui/material/Typography";

import to2digits from "../../utils";
import AppContext from "../../contexts/AppContext";

import styles from "./countyGrid.module.scss";
export default function CountyGrid({
  counties,
  emptyText,
  actionBtn,
  loadMoreBtn,
  onSelectCounty,
}) {
  const { data } = useContext(AppContext);
  const { params } = data;
  const [displayCounty, setDisplayCounty] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDetailClick = (event, county) => {
    event.preventDefault();
    onSelectCounty(county);
    handleOpen();
    setDisplayCounty(county);
  };

  return (
    <div className={`${styles.grid}`}>
      {counties.length === 0 && (
        <p className={`${styles.emptyText}`}>{emptyText}</p>
      )}
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 8, lg: 12, xl: 16 }}
      >
        {counties.map((county, index) => (
          <Grid item xs={2} sm={4} md={4} lg={4} xl={4} key={index}>
            <OverlayTrigger
              key={index}
              placement="top"
              overlay={
                <Tooltip id={`${index}-tooltip`}>Click to view details</Tooltip>
              }
            >
              <div className="text-center">
                <span
                  className="btn"
                  onClick={(event) => handleDetailClick(event, county)}
                >
                  {`${county.name} `}
                </span>
                {actionBtn(county)}
              </div>
            </OverlayTrigger>
          </Grid>
        ))}
      </Grid>
      {counties.length !== 0 && (
        <div className="text-center pt-4">{loadMoreBtn}</div>
      )}
      <DetailsModal
        open={open}
        handleClose={handleClose}
        county={displayCounty}
      />
    </div>
  );
}

/*
      <Accordion
        bsPrefix={`${styles.accordion} overflow-auto `}
        defaultActiveKey="0"
      >
        {counties.map((county, index) => (
          <Accordion.Item
            key={index}
            eventKey={index}
            bsPrefix={`${styles.item} px-3 mb-5 `}
          >
            <div className={`${styles.top}`}>
              <Row>
                <Col md={5}>
                  <a
                    href={`https://en.wikipedia.org/wiki/${county.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`#${county.ranking} ${county.name}`}
                  </a>
                </Col>
                <Col md={4}>{`Overall Score: ${to2digits(county.score)}`}</Col>
                <Col md={2}>
                  <PrimaryButton
                    onClick={(event) => handleDetailClick(event, county)}
                  >
                    View details
                  </PrimaryButton>
                </Col>
                <Col md={1}>{actionBtn(county)}</Col>
              </Row>
              <Row bsPrefix={`${styles.bar}`}>
                <hr />
              </Row>
            </div>
            <Accordion.Header
              bsPrefix={`${styles.header} `}
              onClick={(e) => {
                e.preventDefault();
                onSelectCounty(county);
              }}
            >
              <Col md={10}>
                <Breakdown breakdown={county.breakdown} />
              </Col>
              <Col md={2} bsPrefix={`${styles.toggle} `}>
                Key rank
              </Col>
            </Accordion.Header>
            <Accordion.Body>
              {Object.entries(county.ranks).map(([param, value], i) => {
                const parameter = params[param];
                const paramLabel = parameter.option
                  ? parameter.option_name
                  : parameter.parameter_name;
                return (
                  <span className="stat p-2" key={i}>
                    <ProgressRing value={value} label={paramLabel} />
                  </span>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

*/
