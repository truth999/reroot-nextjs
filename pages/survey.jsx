import { useState, useContext } from "react";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import NextButton from "../components/NextButton";
import styles from "../styles/Survey.module.scss";

export default function Survey() {
  const { data, setData } = useContext(AppContext);

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFactors, setFactors] = useState([]);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [isLastStep, setIsLastStep] = useState(false);
  const router = useRouter();

  const handleStep1 = (event) => {
    selectedFactors = Array.from(
      document.querySelectorAll("input[name=factor]:checked")
    ).map((f) => f.value);
    setFactors(selectedFactors);
    if (selectedFactors.length === 0) setIsLastStep(false);
  };

  const handleStep2 = (event) => {
    language =
      document.querySelector("input[name=language]:checked")?.value ?? "";
    country =
      document.querySelector("input[name=country]:checked")?.value ?? "";
    setLanguage(language);
    setCountry(country);
    setIsLastStep(
      (selectedFactors.includes("language") && !(language == "")) ||
        (selectedFactors.includes("origin") && !(country == ""))
    );
  };

  const handleNext = () => {
    let max_steps = selectedFactors.some(
      (f) => f == "language" || f == "origin"
    )
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
    const ON = 3;
    let paramsSelected = {
      community_language_spanish: ON,
      affordability_rent: ON,
    };

    // Update factors
    data.factors.forEach((factor) => {
      factor.selected = selectedFactors.includes(factor.name);
    });
    setData(data);

    router.push({ pathname: "/results", query: paramsSelected });
  };

  const showButton = () => {
    if (currentStep == 1) {
      if (selectedFactors.length > 0) {
        if (!isLastStep)
          return (
            <NextButton handleClick={handleNext} value="Next"></NextButton>
          );
        else
          return (
            <NextButton handleClick={handleSubmit} value="Submit"></NextButton>
          );
      }
    } else {
      if (isLastStep)
        return (
          <NextButton handleClick={handleSubmit} value="Submit"></NextButton>
        );
    }
  };

  return (
    <Layout survey>
      <form onSubmit={handleSubmit}>
        <Step1
          handleClick={handleStep1}
          currentStep={currentStep}
          selectedFactors={selectedFactors}
        />
        <Step2
          handleClick={handleStep2}
          currentStep={currentStep}
          askLanguage={selectedFactors.includes("language")}
          askCountry={selectedFactors.includes("origin")}
        />
        <div className="survey-button text-center pt-5">{showButton()}</div>
      </form>
    </Layout>
  );
}
