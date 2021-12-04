import { useState, useContext, useEffect } from "react";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import NextButton from "../components/nextButton";

export default function Survey({ parameters }) {
  // Constants
  const ON = "2";

  const { data, setData } = useContext(AppContext);
  const router = useRouter();
  const factors = parameters.factors;
  const community = factors.filter((factor) => factor.name == "community")[0];

  setData(
    Object.assign(data, {
      factors: parameters.factors,
      languages: community.sub.filter((s) => s.name == "language")[0].sub,
      countries: community.sub.filter((s) => s.name == "origin")[0].sub,
    })
  );

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFactors, setFactors] = useState([]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
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
      // Language only
      (selectedFactors.includes("language") &&
        !selectedFactors.includes("origin") &&
        language != "") ||
        // Country only
        (selectedFactors.includes("origin") &&
          !selectedFactors.includes("language") &&
          country != "") ||
        // Both
        (selectedFactors.includes("language") &&
          selectedFactors.includes("origin") &&
          language != "" &&
          country != "")
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

    const newParams = Object.fromEntries(
      selectedParams.map((p) => [[`${p}`], ON])
    );

    // Update factors
    const newFactors = factors.map((factor) => {
      factor.selected = selectedFactors.includes(factor.name);
      return factor;
    });

    const newData = Object.assign(data, {
      factors: newFactors,
      params: newParams,
      selectedCountry: country || "",
      selectedLanguage: language || "",
    });
    setData(newData);

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
          <div className="survey-button text-center pt-5">{showButton()}</div>
        </form>
      </div>
    </Layout>
  );
}
export async function getStaticProps(context) {
  const res = await fetch(`https://reroot-data-app.herokuapp.com/parameters`);
  const parameters = await res.json();

  if (!parameters) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
      notFound: true,
    };
  }

  return {
    props: { parameters }, // will be passed to the page component as props
  };
}
