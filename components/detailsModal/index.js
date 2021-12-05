import React, { useState, useEffect } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import Loading from "../../components/loading";

export default function DetailsModal({ county, open, handleClose }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const base_url = "https://reroot-data-app.herokuapp.com/";

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const getStats = async (county) => {
    setLoading(true);
    fetch(`${base_url}stats?county=${county.code}`)
      .then((res) => res.json())
      .then((stats_raw) => {
        setStats(stats_raw.stats);
        setLoading(false);
      })
      .catch((_) => setLoading(true));
  };

  useEffect(() => {
    getStats(county);
  }, [county]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {loading ? (
        <Loading />
      ) : (
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <a
              href={`https://en.wikipedia.org/wiki/${county.name}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>{county.name}</h2>
              <p>More on Wiki</p>
            </a>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {stats.map((stat, i) => (
              <Accordion key={i}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${i}-content`}
                  id={`panel${i}-header`}
                >
                  {stat.text}
                </AccordionSummary>
                <AccordionDetails>
                  <ul
                    className="list-group py-2"
                    sx={{
                      listStyleType: "none",
                    }}
                  >
                    {stat.sub.map((sub_stat, j) => {
                      let suffixLookup = {
                        percentage: "%",
                        index: "",
                        median: "",
                        count: "",
                        density: "",
                      };
                      let prefixLookup = {
                        percentage: "",
                        index: "",
                        median: "$",
                        count: "",
                        density: "",
                      };
                      let prefix = prefixLookup[sub_stat.metric];
                      let suffix = suffixLookup[sub_stat.metric];
                      return (
                        <li key={j} className="pb-1 ms-3">
                          {`${sub_stat.text}: ${prefix}${sub_stat.value}${suffix}`}
                        </li>
                      );
                    })}
                  </ul>
                </AccordionDetails>
              </Accordion>
            ))}
          </Typography>
        </Box>
      )}
    </Modal>
  );
}
