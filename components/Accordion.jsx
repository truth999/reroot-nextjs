import styles from "./Accordion.module.scss";
import NextButton from "./nextButton";

export default function Accordion(props) {
  const to2digits = (n) => Number.parseFloat(n).toFixed(2);
  return (
    <div
      className={`${styles.accordion} accordion overflow-auto ms-3`}
      id={`accordion-${props.type}-Counties`}
    >
      {props.counties.length === 0 && (
        <p className={`${styles.emptyText}`}>{props.emptyText}</p>
      )}
      {props.counties.map((county) => (
        // Accordion Item
        <div
          className={`${styles.item} accordion-item mb-4 pb-2`}
          key={county.code}
        >
          {/* Header */}
          <h2
            className={`${styles.header} accordion-header`}
            id={`heading-${props.type}-${county.code}`}
          >
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${props.type}-${county.code}`}
              aria-expanded="false"
              aria-controls={`collapse-${props.type}-${county.code}`}
              onClick={() => {
                props.map.current.flyTo({
                  center: county.lng_lat,
                  zoom: 12,
                });
              }}
            >
              <p>{county.name}</p>
            </button>
            {/* Display */}
            <div className="row">
              <div
                className={`${styles.progress} col-10 progress`}
                style={{ height: "2.5rem" }}
              >
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  aria-valuenow={county.score}
                  aria-valuemin="0"
                  aria-valuemax="10"
                  aria-label={county.name}
                  style={{ width: `${county.score * 10}%` }}
                >
                  {to2digits(county.score)}
                </div>
              </div>
              <div className="col-2">{props.rightBtn(county)}</div>
            </div>
          </h2>

          {/* Body */}
          <div
            className="accordion-collapse collapse"
            id={`collapse-${props.type}-${county.code}`}
            aria-labelledby={`heading-${props.type}-${county.code}`}
            data-bs-parent={`#accordion-${props.type}-Counties`}
          >
            <div className="accordion-body">
              {Object.entries(county.breakdown).map(([param, score]) => (
                <div key={param}>{`${param}: ${to2digits(score)}`}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {props.counties.length !== 0 && (
        <div className="text-center">
          {props.loadMoreButton}
        </div>
      )}
    </div>
  );
}
