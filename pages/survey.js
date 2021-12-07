import { useState, useContext, useEffect } from "react";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import NextButton from "../components/nextButton";

export default function Survey({ factorsData }) {
  // Constants
  const ON = "2";

  const { data, setData } = useContext(AppContext);
  const router = useRouter();
  const factors = factorsData.factors;
  const community = factors.filter((factor) => factor.name == "community")[0];

  setData(
    Object.assign(data, {
      factors,
      languages: community.sub.filter((s) => s.name == "language")[0].sub,
      countries: community.sub.filter((s) => s.name == "origin")[0].sub,
    })
  );

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFactors, setFactors] = useState([]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLastStep, setIsLastStep] = useState(false);

  const handleStep1 = (event) => {
    let checkedFactors = Array.from(
      document.querySelectorAll("input[name=factor]:checked")
    );

    // Update factors
    selectedFactors = checkedFactors.map((f) => f.value);
    setFactors(selectedFactors);

    if (selectedFactors.length === 0) {
      setIsLastStep(false);
    } else
      setIsLastStep(
        !selectedFactors.some((f) => f == "language" || f == "origin")
      );

    // Update params
    const newSelectedParams = checkedFactors
      .filter((f) => f.getAttribute("param"))
      .map((f) => f.getAttribute("param"));

    setSelectedParams(newSelectedParams);
  };

  const handleStep2 = (event) => {
    // console.log(event.target.value);
    // console.log(event.target.name);
    // console.log(event.target.checked);
    const checkedLanguages = Array.from(
      document.querySelectorAll("input[name=language]:checked")
    ).map((_) => _.value);
    setLanguages(checkedLanguages);

    const checkedCountries = Array.from(
      document.querySelectorAll("input[name=country]:checked")
    ).map((_) => _.value);
    setCountries(checkedCountries);

    setIsLastStep(
      // Language only
      (selectedFactors.includes("language") &&
        !selectedFactors.includes("origin") &&
        checkedLanguages.length > 0) ||
        // Country only
        (selectedFactors.includes("origin") &&
          !selectedFactors.includes("language") &&
          checkedCountries.length > 0) ||
        // Both
        (selectedFactors.includes("language") &&
          selectedFactors.includes("origin") &&
          checkedLanguages.length > 0 &&
          checkedCountries.length > 0)
    );
  };

  const handleNext = () => {
    let max_steps = selectedFactors.some(
      (f) => f == "language" || f == "origin"
    )
      ? 2
      : 1;
    if (currentStep !== max_steps) {
      setIsLastStep(false);
      let nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSelectedParams = selectedParams.map((_) => _);

    // Update params
    countries.forEach((country) => {
      newSelectedParams.push(
        data.countries.filter((c) => c.name == country).map((c) => c.param)[0]
      );
    });

    languages.forEach((language) => {
      newSelectedParams.push(
        data.languages.filter((l) => l.name == language).map((l) => l.param)[0]
      );
    });

    const newParams = Object.fromEntries(
      newSelectedParams.map((p) => [[`${p}`], ON])
    );

    // Update factors
    const newFactors = factors.map((_) => _);

    const newData = Object.assign(data, {
      factors: newFactors,
      selectedCountries: countries,
      selectedLanguages: languages,
    });
    setData(newData);
    console.log(newData);

    router.push({ pathname: "/results", query: newParams });
  };

  const showButton = () => {
    if (currentStep == 1) {
      if (selectedFactors.length > 0) {
        if (!isLastStep)
          return <NextButton handleClick={handleNext}>Next</NextButton>;
        else return <NextButton handleClick={handleSubmit}>Submit</NextButton>;
      }
      return <NextButton disabled={true}>Next</NextButton>;
    }

    if (currentStep == 2) {
      if (isLastStep) {
        return <NextButton handleClick={handleSubmit}>Submit</NextButton>;
      } else {
        return <NextButton disabled={true}>Submit</NextButton>;
      }
    }
  };

  return (
    <Layout survey>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <Step1
            factors={data.factors}
            handleClick={handleStep1}
            currentStep={currentStep}
          />
          <Step2
            handleClick={handleStep2}
            currentStep={currentStep}
            languages={data.languages}
            countries={data.countries}
            askLanguage={selectedFactors.includes("language")}
            askCountry={selectedFactors.includes("origin")}
          />
          <div className="survey-button text-center py-3">{showButton()}</div>
        </form>
      </div>
    </Layout>
  );
}
export async function getStaticProps(context) {
  const res = await fetch(`https://reroot-data-app.herokuapp.com/factors`);
  const factorsData = await res.json();

  if (!factorsData) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      notFound: true,
    };
  }

  return {
    props: { factorsData }, // will be passed to the page component as props
  };
}
