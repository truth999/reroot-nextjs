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

/*
<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.78692 0C3.49785 0 6.47803e-05 3.50177 6.47803e-05 7.79234C-0.00685348 9.47806 0.540539 11.1208 1.55634 12.4655L7.15223 20H8.42301L14.0175 12.4655C15.0319 11.1208 15.5793 9.47806 15.5752 7.79234C15.5752 3.50177 12.0774 0 7.78692 0V0Z" fill="#E7654B"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.78711 0V20H8.4232L14.0177 12.4655C15.0349 11.1208 15.5795 9.47806 15.5754 7.79234C15.5754 3.50177 12.0776 0 7.78711 0V0Z" fill="#924430"/>
<circle cx="7.7969" cy="7.73782" r="5.47122" fill="#FFF7EC"/>
<path d="M11.1059 5.44092C10.9235 5.25903 10.707 5.11474 10.4687 5.0163C10.2304 4.91786 9.97499 4.86719 9.71704 4.86719C9.45909 4.86719 9.20366 4.91786 8.96536 5.0163C8.72705 5.11474 8.51054 5.25903 8.32818 5.44092L7.94972 5.81823L7.57127 5.44092C7.20292 5.07369 6.70333 4.86738 6.18241 4.86738C5.66148 4.86738 5.1619 5.07369 4.79355 5.44092C4.4252 5.80815 4.21826 6.30623 4.21826 6.82558C4.21826 7.34492 4.4252 7.843 4.79355 8.21023L5.172 8.58754L7.94972 11.3569L10.7274 8.58754L11.1059 8.21023C11.2883 8.02843 11.4331 7.81257 11.5318 7.57498C11.6306 7.3374 11.6814 7.08275 11.6814 6.82558C11.6814 6.5684 11.6306 6.31375 11.5318 6.07617C11.4331 5.83859 11.2883 5.62273 11.1059 5.44092V5.44092Z" fill="#E7654B" stroke="#E7654B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>


*/
