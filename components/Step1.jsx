import { Factor } from "./Factor";
import AppContext from "../contexts/AppContext";
import { useContext } from "react";
import styles from "./Step.module.scss";

export default function Step1(props) {
  const { data } = useContext(AppContext);

  if (props.currentStep !== 1) {
    // Prop: The current step
    return null;
  }

  // The markup for the Step 1 UI
  return (
    <section className="select-factors">
      <div className="question-text text-center pb-4">
        <div className={`${styles.title} pb-2`}>
          What&apos;s important to you?
        </div>
        <div className={styles.subtitle}>
          Click as many as you like.
          <br />
          You can edit and fine-tune your preferences later.
        </div>
      </div>

      <div className="option-group">
        {data.factors.map((factor) => (
          <div key={factor.name} className="row">
            <div className={`${styles.factor} col-lg-3 pb-2`}>
              {factor.text}
            </div>
            <div className="col-9 ps-2">
              <div className="row">
                {factor.sub.map((sub) => {
                  const id = `toggle-${sub.name}`;
                  return (
                    <Factor
                      name={sub.name}
                      param={sub.param}
                      key={id}
                      id={id}
                      text={sub.text}
                      onClick={props.handleClick}
                    ></Factor>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
