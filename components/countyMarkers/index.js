import { useState, useMemo } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function CountyMarkers({ counties, onClick }) {
  // Only rerender markers if props.data has changed
  const markers = useMemo(
    () =>
      counties.map((county) => {
        const [lng, lat] = county.lng_lat;
        return (
          <Marker
            key={`marker-${county.ranking}`}
            longitude={lng}
            latitude={lat}
            with={100}
            height={100}
          >
            <LocationOnOutlinedIcon onClick={() => onClick(county)} />
          </Marker>
        );
      }),
    [counties, onClick]
  );

  return markers;
}
