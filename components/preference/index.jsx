import styles from "./preference.module.scss";
import AdjustButton from "../../components/adjustButton";
import Slider from "../../components/slider";

export default function Preference({ factors, params, updateScores }) {
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
        {factors.map((factor) => (
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
              <ul className="btn-toggle-nav list-unstyled pb-1">
                {factor.sub.map(
                  (sub, i) =>
                    sub.name != "origin" &&
                    sub.name != "language" && (
                      <li key={sub.i} className="py-2">
                        <label
                          htmlFor={`${sub.name}-range`}
                          className={`${styles.sidebarParam} form-label`}
                        >
                          {sub.text}
                        </label>
                        <Slider
                          sub={sub}
                          defaultValue={params[sub] || "0"}
                          updateScores={updateScores}
                        />
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
