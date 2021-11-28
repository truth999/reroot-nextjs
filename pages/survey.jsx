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
  const [selectedParams, setSelectedParams] = useState([]);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [isLastStep, setIsLastStep] = useState(false);
  const router = useRouter();

  const handleStep1 = (event) => {
    let checkedFactors = Array.from(
      document.querySelectorAll("input[name=factor]:checked")
    );

    // Update factors
    selectedFactors = checkedFactors.map((f) => f.value);
    setFactors(selectedFactors);

    if (selectedFactors.length === 0) setIsLastStep(false);

    // Update params
    selectedParams = checkedFactors
      .filter((f) => f.getAttribute("param"))
      .map((f) => f.getAttribute("param"));

    setSelectedParams(selectedParams);
  };

  const handleStep2 = (event) => {
    let checkedLanguage = document.querySelector(
      "input[name=language]:checked"
    );
    language = checkedLanguage?.value ?? "";
    setLanguage(language);

    let checkedCountry = document.querySelector("input[name=country]:checked");
    country = checkedCountry?.value ?? "";
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
    if (country) {
      selectedParams.push(
        data.countries.filter((c) => c.name == country).map((c) => c.param)[0]
      );
    }

    if (language) {
      selectedParams.push(
        data.languages.filter((l) => l.name == language).map((l) => l.param)[0]
      );
    }

    const ON = "3";
    const params = Object.fromEntries(
      selectedParams.map((p) => [[`${p}`], ON])
    );
    data.params = params;

    // Update factors
    data.factors.forEach((factor) => {
      factor.selected = selectedFactors.includes(factor.name);
    });
    setData(data);

    router.push({ pathname: "/results", query: params });
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
      <div className="container">
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
      </div>
    </Layout>
  );
}
