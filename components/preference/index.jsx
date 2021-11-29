import AdjustButton from "../../components/adjustButton";
import styles from "./preference.module.scss";

export default function Preference(props) {
  return (
    <div className="flex-shrink-0 p-3" style={{ width: "13vw" }}>
      <div className="d-flex flex-column align-items-center pb-2 link-dark text-decoration-none fs-5">
        <div>
          <AdjustButton side={25}></AdjustButton>
        </div>
        <div className={`${styles.sidebarTitle}`}>
          <p>PREFERENCE</p>
        </div>
      </div>
      <ul className="list-unstyled ps-0">
        {props.factors.map((factor) => (
          <li className="mb-1" key={factor.name}>
            <button
              className={`${styles.factor} btn btn-toggle align-items-center border-bottom collapsed pt-4`}
              data-bs-toggle="collapse"
              data-bs-target={`#${factor.name}-collapse`}
              aria-expanded="true"
            >
              <p>
                {factor.text}
                <span id={`${factor.name}`}>▼</span>
              </p>
            </button>
            <div
              className={`collapse ${factor.selected ? "show" : ""}`}
              id={`${factor.name}-collapse`}
            >
              <ul className="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                {factor.sub.map(
                  (sub) =>
                    sub.name != "origin" &&
                    sub.name != "language" && (
                      <li key={sub.name} className="py-2">
                        <label
                          htmlFor={`${sub.name}-range`}
                          className={`${styles.sidebarParam} form-label`}
                        >
                          {sub.text}
                        </label>
                        <div className="range">
                          <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="4"
                            defaultValue={props.params[sub.param] || "0"}
                            step="1"
                            id={`${sub.name}-range`}
                            onChange={(event) => {
                              event.preventDefault();
                              let newValue = event.target.value;
                              if (sub.param)
                                props.updateScores({
                                  [`${sub.param}`]: newValue,
                                });
                            }}
                          />
                        </div>
                      </li>
                    )
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
