import ReactMapGL, { Marker, Popup } from "react-map-gl";
import CountyStats from "../../components/countyStats";

export default function CountyPopup({ county, onClose }) {
  const [lng, lat] = county.lng_lat;

  return (
    <Popup
      tipSize={5}
      anchor="top"
      latitude={lat}
      longitude={lng}
      closeButton={true}
      closeOnClick={true}
      onClose={onClose}
    >
      <CountyStats county={county} />
    </Popup>
  );
}
