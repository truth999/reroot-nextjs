import Factor from "../components/factor";

import styles from "./Step.module.scss";

export default function Step1({
  categories,
  factors,
  currentStep,
  handleChange,
  selectedFactors,
  setSelectedFactors,
}) {
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
        {categories.map((category) => (
          <div key={category.name} className="row mx-0">
            <div className={`${styles.factor} col-lg-3 pb-2 text-center`}>
              {category.text}
            </div>
            <div className="col-9">
              <div className="row mx-0">
                {factors
                  .filter((f) => f.categoryId === category.id)
                  .map((factor) => {
                    const id = `toggle-${factor.name}`;
                    return (
                      <Factor
                        key={id}
                        value={factor.id}
                        name="factor"
                        id={id}
                        handleChange={handleChange}
                        selectedFactors={selectedFactors}
                        setSelectedFactors={setSelectedFactors}
                      >
                        {factor.text}
                      </Factor>
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
