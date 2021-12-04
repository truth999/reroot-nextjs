import styles from "./countyAccordion.module.scss";

export default function CountyAccordion({
  type,
  counties,
  emptyText,
  map,
  actionBtn,
  loadMoreBtn,
}) {
  const to2digits = (n) => Number.parseFloat(n).toFixed(2);
  return (
    <div
      className={`${styles.accordion} accordion overflow-auto ms-3`}
      id={`accordion-${type}-Counties`}
    >
      {counties.length === 0 && (
        <p className={`${styles.emptyText}`}>{emptyText}</p>
      )}
      {counties.map((county) => (
        // Accordion Item
        <div
          className={`${styles.item} accordion-item mb-4 pb-2`}
          key={county.county_code}
        >
          {/* Header */}
          <h2
            className={`${styles.header} accordion-header`}
            id={`heading-${type}-${county.county_code}`}
          >
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse-${type}-${county.county_code}`}
              aria-expanded="false"
              aria-controls={`collapse-${type}-${county.county_code}`}
              onClick={() => {
                map.current.flyTo({
                  center: [
                    county.coordinates.county_long,
                    county.coordinates.county_lat,
                  ],
                  zoom: 12,
                });
              }}
            >
              <p>{county.county_name}</p>
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
                  aria-label={county.county_name}
                  style={{ width: `${county.score * 10}%` }}
                >
                  {to2digits(county.score)}
                </div>
              </div>
              <div className="col-2">{actionBtn(county)}</div>
            </div>
          </h2>

          {/* Body */}
          <div
            className="accordion-collapse collapse"
            id={`collapse-${type}-${county.county_code}`}
            aria-labelledby={`heading-${type}-${county.county_code}`}
            data-bs-parent={`#accordion-${type}-Counties`}
          >
            <div className="accordion-body">
              {Object.entries(county.breakdown).map(([param, score]) => (
                <div key={param}>{`${param}: ${to2digits(score)}`}</div>
              ))}
            </div>
          </div>
        </div>
      ))}
      {counties.length !== 0 && (
        <div className="text-center">{loadMoreBtn}</div>
      )}
    </div>
  );
}
