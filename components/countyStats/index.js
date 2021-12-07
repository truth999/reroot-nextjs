import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Loading from "../../components/loading";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";

const base_url = "https://reroot-data-app.herokuapp.com/";

export default function CountyStats({ county }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const getSymbols = {
    prefix: {
      percentage: "",
      index: "",
      median: "$",
      count: "",
      density: "",
    },
    suffix: {
      percentage: "%",
      index: "",
      median: "",
      count: "",
      density: "",
    },
  };

  useEffect(() => {
    const getStats = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base_url}stats?county=${county.code}`);
        const stats_raw = await res.json();
        setStats(stats_raw.stats);
        setLoading(false);
      } catch (err) {
        setLoading(true);
      }
    };

    getStats();
    return () => setStats([]);
  }, [county.code]);

  return loading ? (
    <Loading />
  ) : (
    <div>
      <Typography variant="h5">{county.name}</Typography>
      <Link
        href={`https://en.wikipedia.org/wiki/${county.name}`}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
      >
        <Typography variant="caption">Learn More</Typography>
      </Link>
      {stats.map((stat, i) => (
        <Accordion
          key={i}
          expanded={expanded === `panel${i}`}
          onChange={handleChange(`panel${i}`)}
        >
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
                const metric = sub_stat.metric;
                return (
                  <ListItem key={`${i}${j}`}>
                    <Typography>
                      {`${sub_stat.text}: ${getSymbols.prefix[metric]}${sub_stat.value}${getSymbols.suffix[metric]}`}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
