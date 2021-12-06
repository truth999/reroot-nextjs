import ReactMapGL, { Marker, Popup } from "react-map-gl";

export default function CountyMarker({ index, marker, openPopup }) {
  return (
    <Marker longitude={marker.longitude} latitude={marker.latitude}>
      <div className="marker" onClick={() => openPopup(index)}>
        <span>
          <b>{index + 1}</b>
        </span>
      </div>
    </Marker>
  );
}
