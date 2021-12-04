import React, { useState } from "react";

import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PrimaryButton from "../primaryButton";
import Breakdown from "../breakdown";
import DetailsModal from "../detailsModal";
import to2digits from "../../utils";

import styles from "./countyAccordion.module.scss";
export default function CountyAccordion({
  type,
  counties,
  emptyText,
  map,
  actionBtn,
  loadMoreBtn,
}) {
  const [displayCounty, setDisplayCounty] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDetailClick = (event, county) => {
    event.preventDefault();
    map.current.flyTo({
      center: [county.coordinates.county_long, county.coordinates.county_lat],
      zoom: 12,
    });
    handleOpen();
    setDisplayCounty(county);
  };

  return (
    <div>
      {counties.length === 0 && (
        <p className={`${styles.emptyText}`}>{emptyText}</p>
      )}
      <Accordion
        bsPrefix={`${styles.accordion} overflow-auto`}
        defaultActiveKey="0"
      >
        {counties.map((county, index) => (
          <Accordion.Item
            key={index}
            eventKey={index}
            bsPrefix={`${styles.item} px-3 mb-5`}
          >
            <div className={`${styles.top}`}>
              <Row>
                <Col md={6}>
                  <a
                    href={`https://en.wikipedia.org/wiki/${county.county_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {`#${index + 1} ${county.county_name}`}
                  </a>
                </Col>
                <Col md={3}>{`Overall Score: ${to2digits(county.score)}`}</Col>
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
            <Accordion.Header bsPrefix={`${styles.header}`}>
              <Col md={11}>
                <Breakdown breakdown={county.breakdown} />
              </Col>
              <Col md={1}>Key rank</Col>
            </Accordion.Header>
            <Accordion.Body>{JSON.stringify(county)}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

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
