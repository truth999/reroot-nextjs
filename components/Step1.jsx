import { Factor } from "./factor";
import styles from "./Step.module.scss";

export default function Step1({ factors, currentStep, handleClick }) {
  if (currentStep !== 1) {
    // Prop: The current step
    return null;
  }

  // The markup for the Step 1 UI
  return (
    <section className="select-factors">
      <div className="question-text text-center pb-4">
        <div className={`${styles.title} pb-4`}>
          What&apos;s important to you?
        </div>
        <div className={`${styles.subtitle} pb-3`}>
          Click as many as you like.
          <br />
          You can edit and fine-tune your preferences later.
        </div>
      </div>

      <div className="option-group">
        {factors.map((factor) => (
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
                      onClick={handleClick}
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
