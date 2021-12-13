import * as React from "react";
import { useState, useMemo, useEffect, useContext, useCallback } from "react";
import ReactMapGL, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  FlyToInterpolator,
} from "react-map-gl";
import CountyMarkers from "../../components/countyMarkers";
import CountyPopup from "../../components/countyPopup";

export default function Map({
  children,
  viewport,
  onViewportChange,
  counties,
  favs,
}) {
  const accessToken =
    "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3d1bDZtdXUxcGp4MnBydXo2OGlpc3JyIn0.oK3b4hONhLneac4z_xJzFQ";

  const [selectedCounty, setSelectedCounty] = useState(null);
  const attributionStyle = {
    right: 0,
    bottom: 0,
  };

  const fullscreenControlStyle = {
    right: 10,
    top: 40,
  };

  const geolocateControlStyle = {
    right: 10,
    top: 10,
  };

  const navControlStyle = {
    right: 10,
    top: 100,
  };

  const all = [
    ...favs.map((county) => {
      county.faved = true;
      return county;
    }),
    ...counties.filter((county) => !favs.some((c) => c.index === county.index)),
  ];

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/zhj0924/ckwd55u2n5fb314pc0egsi3ii"
      onViewportChange={onViewportChange}
      style={attributionStyle}
      attributionControl={false}
      mapboxApiAccessToken={accessToken}
    >
      {selectedCounty && (
        <CountyPopup county={selectedCounty} onClose={setSelectedCounty} />
      )}

      <AttributionControl
        compact={false}
        style={attributionStyle}
        customAttribution={["designed by reRoot"]}
      />
      <FullscreenControl style={fullscreenControlStyle} />
      <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
      <NavigationControl style={navControlStyle} />
      <CountyMarkers counties={all} onClick={setSelectedCounty} />
      {children}
    </ReactMapGL>
  );
}
