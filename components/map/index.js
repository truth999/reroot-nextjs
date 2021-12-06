import * as React from "react";
import { useState, useMemo } from "react";
import ReactMapGL, {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  Marker,
} from "react-map-gl";
import CountyMarkers from "../../components/countyMarkers";
import CountyPopup from "../../components/countyPopup";

export default function Map({ children, counties }) {
  const CENTER_US48 = [-99.0909, 39.8355];
  const accessToken =
    "pk.eyJ1IjoiemhqMDkyNCIsImEiOiJja3d1bDZtdXUxcGp4MnBydXo2OGlpc3JyIn0.oK3b4hONhLneac4z_xJzFQ";
  const [initLng, initLat] = CENTER_US48;
  const [lng, setLng] = useState(initLng);
  const [lat, setLat] = useState(initLat);
  const [zoom, setZoom] = useState(3);
  const [pitch, setPitch] = useState(45);
  const [viewport, setViewport] = useState({
    latitude: lat,
    longitude: lng,
    zoom: zoom,
    pitch: pitch,
  });
  const [selectedCounty, setSelectedCounty] = useState(null);
  // const mapContainer = useRef(null);
  // const map = useRef(null);
  // const markers = useRef([]);

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

  return (
    <ReactMapGL
      width="100%"
      height="50vh"
      {...viewport}
      mapStyle="mapbox://styles/zhj0924/ckwd55u2n5fb314pc0egsi3ii"
      onViewportChange={(nextViewport) => {
        setLng(nextViewport.longitude.toFixed(4));
        setLat(nextViewport.latitude.toFixed(4));
        setZoom(nextViewport.zoom.toFixed(2));
        setPitch(nextViewport.pitch.toFixed(2));
        setViewport(nextViewport);
      }}
      style={attributionStyle}
      mapboxApiAccessToken={accessToken}
      attributionControl={false}
    >
      {selectedCounty && (
        <CountyPopup county={selectedCounty} onClose={setSelectedCounty} />
      )}

      <AttributionControl
        compact={false}
        style={attributionStyle}
        customAttribution={["designed by Thomas Zhang"]}
      />
      <FullscreenControl style={fullscreenControlStyle} />
      <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
      />
      <NavigationControl style={navControlStyle} />
      <CountyMarkers counties={counties} onClick={setSelectedCounty} />
      {children}
      {`Longitude: ${lng} | Latitude: ${lat} | Zoom: ${zoom} | Pitch: ${pitch}`}
    </ReactMapGL>
  );
}
