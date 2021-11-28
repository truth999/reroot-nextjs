import { useState, useContext } from "react";
import { useRouter } from "next/router";
import AppContext from "../contexts/AppContext";
import Layout from "../components/Layout";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import NextButton from "../components/NextButton";
import styles from "../styles/Survey.module.scss";

export default function Survey() {
  const { data, setData } = useContext(AppContext);

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [factors, setFactors] = useState([]);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [isLastStep, setIsLastStep] = useState(false);
  const router = useRouter();

  const ON = 3;

  const handleStep1 = (event) => {
    console.log("handleStep1 called");
    document.querySelector("input[name=next]").disabled =
      document.querySelectorAll("input[name=factor]:checked").length === 0;
  };
  const handleStep2 = (event) => {
    console.log("handleStep2 called");
    setIsLastStep = false;
  };

  const handleNext = () => {
    console.log("clicked");
    if (currentStep === 1) {
      factors = Array.from(
        document.querySelectorAll("input[name=factor]:checked")
      ).map((f) => f.value);
      setFactors(factors);
    } else {
      language =
        document.querySelector("input[name=language]:checked")?.value ?? "";
      country =
        document.querySelector("input[name=country]:checked")?.value ?? "";
      setLanguage(language);
      setCountry(country);
    }

    let max_steps = factors.some((f) => f == "language" || f == "origin")
      ? 2
      : 1;
    if (currentStep === max_steps) {
      setIsLastStep(true);
    } else {
      setIsLastStep(false);
      let nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Update params
    let paramsSelected = {
      community_language_spanish: ON,
      affordability_rent: ON,
    };

    // Update factors
    data.factors.forEach((factor) => {
      factor.selected = factors.includes(factor.name);
    });

    setData(data);
    router.push({ pathname: "/results", query: paramsSelected });
  };

  return (
    <Layout survey>
      <form onSubmit={handleSubmit}>
        <Step1
          handleNext={handleStep1}
          currentStep={currentStep}
          factors={factors}
        />
        <Step2
          handleNext={handleStep2}
          currentStep={currentStep}
          askLanguage={factors.includes("language")}
          askCountry={factors.includes("origin")}
        />
        <div className="survey-button text-center pt-5">
          <NextButton handleClick={handleNext}></NextButton>
          {isLastStep && (
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          )}
        </div>
      </form>
    </Layout>
  );
}
