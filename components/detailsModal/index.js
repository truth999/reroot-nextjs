import React, { useState, useEffect, forwardRef } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

import Loading from "../../components/loading";

export default function DetailsModal({
  county,
  open,
  handleClose,
  forwardRef,
}) {
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

  const suffixLookup = {
    percentage: "%",
    index: "",
    median: "",
    count: "",
    density: "",
  };
  const prefixLookup = {
    percentage: "",
    index: "",
    median: "$",
    count: "",
    density: "",
  };

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
                  <List>
                    {stat.sub.map((sub_stat, j) => {
                      let prefix = prefixLookup[sub_stat.metric];
                      let suffix = suffixLookup[sub_stat.metric];
                      return (
                        <ListItem key={j} className="pb-1 ms-2">
                          {`${sub_stat.text}: ${prefix}${sub_stat.value}${suffix}`}
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Typography>
        </Box>
      )}
    </Modal>
  );
}
