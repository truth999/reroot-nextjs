import { useState, useMemo } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

const HEART = (
  <path
    d="M14.2608 6.98673C14.0267 6.75316 13.7487 6.56788 13.4427 6.44147C13.1366 6.31506 12.8087 6.25 12.4774 6.25C12.1462 6.25 11.8182 6.31506 11.5122 6.44147C11.2062 6.56788 10.9282 6.75316 10.694 6.98673L10.208 7.47122L9.72206 6.98673C9.24907 6.51516 8.60756 6.25024 7.93864 6.25024C7.26973 6.25024 6.62821 6.51516 6.15522 6.98673C5.68223 7.45829 5.4165 8.09786 5.4165 8.76475C5.4165 9.43163 5.68223 10.0712 6.15522 10.5428L6.64119 11.0273L10.208 14.5833L13.7749 11.0273L14.2608 10.5428C14.4951 10.3093 14.681 10.0321 14.8078 9.72705C14.9345 9.42197 14.9998 9.09498 14.9998 8.76475C14.9998 8.43452 14.9345 8.10752 14.8078 7.80244C14.681 7.49736 14.4951 7.22018 14.2608 6.98673V6.98673Z"
    fill="#E7654B"
    stroke="#E7654B"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);
export default function CountyMarkers({ counties, onClick }) {
  const WIDTH = 20;
  const HEIGHT = 26;
  // Only rerender markers if props.data has changed
  const markers = useMemo(() => {
    return counties.map((county) => {
      const [lng, lat] = county.lng_lat;
      return (
        <Marker key={`marker-${county.index}`} longitude={lng} latitude={lat}>
          <svg
            height={HEIGHT}
            width={WIDTH}
            viewBox={`0 0 ${HEIGHT} ${WIDTH}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              cursor: "pointer",
              stroke: "black",
              transform: `translate(${-WIDTH / 2}px,${-HEIGHT}px)`,
            }}
            onClick={() => onClick(county)}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.99911 0C4.49155 0 8.31837e-05 4.49659 8.31837e-05 10.0061C-0.00880049 12.1707 0.6941 14.2801 1.99848 16.0068L9.1841 25.6818H10.8159L17.9998 16.0068C19.3023 14.2801 20.0052 12.1707 19.9999 10.0061C19.9999 4.49659 15.5084 0 9.99911 0V0Z"
              fill="#E7654B"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.99951 0V25.6818H10.8163L18.0002 16.0068C19.3063 14.2801 20.0057 12.1707 20.0003 10.0061C20.0003 4.49659 15.5089 0 9.99951 0V0Z"
              fill="#924430"
            />
            <circle cx="10.0119" cy="9.93569" r="7.02554" fill="#FFF7EC" />

            {county.faved && HEART}
          </svg>
        </Marker>
      );
    });
  }, [onClick, counties]);

  return markers;
}
