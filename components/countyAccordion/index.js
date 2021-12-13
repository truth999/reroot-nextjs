import React, { useState, useContext } from "react";

import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PrimaryButton from "../../components/primaryButton";
import Breakdown from "../../components/breakdown";
import DetailsModal from "../../components/detailsModal";
import ProgressRing from "../../components/progressRing";

import to2digits from "../../utils";

import styles from "./countyAccordion.module.scss";
export default function CountyAccordion({
  counties,
  emptyText,
  actionBtn,
  loadMoreBtn,
  parameters,
  onSelectCounty,
  getParamText,
  getParameter,
}) {
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
    <div>
      {counties.length === 0 && (
        <p className={`${styles.emptyText}`}>{emptyText}</p>
      )}
      <Accordion
        className={`${styles.accordion} overflow-auto `}
        defaultActiveKey="0"
      >
        {counties.map((county, index) => (
          <Accordion.Item
            key={index}
            eventKey={index}
            className={`${styles.item} px-3 my-4`}
          >
            <div className={`${styles.top}`}>
              <Row>
                <Col md={5}>{`#${county.ranking} ${county.name}`}</Col>
                <Col md={4}>{`Overall Score: ${to2digits(county.score)}`}</Col>
                <Col md={2}>
                  <PrimaryButton
                    onClick={(event) => handleDetailClick(event, county)}
                  >
                    View details
                  </PrimaryButton>
                </Col>
                <Col md={1}>{actionBtn && actionBtn(county)}</Col>
              </Row>
              <Row className={`${styles.bar}`}></Row>
            </div>
            <Accordion.Header
              className={`${styles.header} `}
              onClick={(e) => {
                e.preventDefault();
                onSelectCounty(county);
              }}
            >
              <Col md={10}>
                <Breakdown
                  breakdown={county.breakdown}
                  getParamText={getParamText}
                  getParameter={getParameter}
                  parameters={parameters}
                />
              </Col>
              <Col md={2} className={`${styles.toggle} `}>
                Key rank
              </Col>
            </Accordion.Header>
            <Accordion.Body>
              {Object.entries(county.ranks).map(([param, value], i) => {
                const parameter = getParameter(param);
                return (
                  <span className="stat p-2" key={i}>
                    <ProgressRing
                      value={value}
                      label={getParamText(parameter)}
                    />
                  </span>
                );
              })}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      {counties.length !== 0 && (
        <div className="text-center pt-4">{loadMoreBtn && loadMoreBtn}</div>
      )}
      <DetailsModal
        open={open}
        handleClose={handleClose}
        county={displayCounty}
      />
    </div>
  );
}
