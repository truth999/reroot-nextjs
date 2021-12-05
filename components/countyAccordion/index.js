import React, { useState, useContext } from "react";

import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import PrimaryButton from "../../components/primaryButton";
import Breakdown from "../../components/breakdown";
import DetailsModal from "../../components/detailsModal";
import ProgressRing from "../../components/progressRing";

import to2digits from "../../utils";
import AppContext from "../../contexts/AppContext";

import styles from "./countyAccordion.module.scss";
export default function CountyAccordion({
  type,
  counties,
  emptyText,
  map,
  actionBtn,
  loadMoreBtn,
}) {
  const { data } = useContext(AppContext);
  const { params } = data;
  const [displayCounty, setDisplayCounty] = useState({});
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDetailClick = (event, county) => {
    event.preventDefault();
    map.current.flyTo({
      center: county.lng_lat,
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
            <Accordion.Header bsPrefix={`${styles.header} `}>
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
