import styles from "./Accordion.module.scss";
import Progress from "../components/progress";

export default function Accordion(props) {
  const top = (counties) => (n) => counties.slice(0, n);

  return (
    <div
      className={`${styles.accordion} accordion overflow-auto`}
      id="accordionCounties"
    >
      {props.counties.length === 0 && props.emptyText}
      {top(props.counties)(props.per_page).map((county) => (
        // Accordion Item
        <div className="accordion-item" key={county.county_code}>
          {/* Header */}
          <h2 className="accordion-header" id={`heading-${county.county_code}`}>
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${county.county_code}`}
              aria-expanded="false"
              aria-controls={`collapse-${county.county_code}`}
              onClick={() => {
                props.map.current.flyTo({
                  center: county.lngLat,
                  zoom: 12.5,
                });
              }}
            >
              {county.county_name}
            </button>
          </h2>

          {/* Display */}
          <div className="row">
            <div className="col-10 progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={county.score}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={county.county_name}
                style={{ width: `${county.score * 10}%` }}
              ></div>
            </div>

            <div className="col-2">{props.rightBtn(county)}</div>
          </div>

          {/* Body */}
          <div
            className="accordion-collapse collapse"
            id={`collapse-${county.county_code}`}
            aria-labelledby={`heading-${county.county_code}`}
            data-bs-parent="#accordionCounties"
          >
            <div className="accordion-body">
              {Object.entries(county.breakdown).map(([factor, score]) => (
                <div key={factor}>{`${factor}: ${score}`}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
