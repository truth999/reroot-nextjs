import { useState, useContext, useEffect, useCallback } from "react";
import AppContext from "../contexts/AppContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Step1 from "../components/Step1";
import Step2 from "../components/Step2";
import NextButton from "../components/nextButton";
import Container from "react-bootstrap/Container";
import styles from "../styles/Survey.module.scss";
import prisma from "../lib/prisma.ts";

export default function Survey({
  categories,
  factors,
  parameters,
  languages,
  countries,
}) {
  const router = useRouter();
  const { data, setData } = useContext(AppContext);
  const originId = factors.find((f) => f.name === "origin").id;
  const languageId = factors.find((f) => f.name === "language").id;
  const parameters1 = parameters.filter(
    (parameter) =>
      parameter.factorId != originId && parameter.factorId != languageId
  );

  // Constants

  const ON = 2;

  // States
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFactors, setSelectedFactors] = useState([]);
  const [selectedParams, setSelectedParams] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isLastStep, setIsLastStep] = useState(false);

  const handleStep1 = useCallback(
    (newSelectedFactors) => {
      // Update last step
      if (newSelectedFactors.length === 0) {
        setIsLastStep(false);
      } else
        setIsLastStep(
          !(
            newSelectedFactors.includes(languageId) ||
            newSelectedFactors.includes(originId)
          )
        );

      // Update params
      const newSelectedParams = parameters1.filter((p) =>
        newSelectedFactors.includes(p.factorId)
      );

      setSelectedParams(newSelectedParams);
    },
    [languageId, originId, parameters1]
  );

  const handleStep2 = (newSelectedFactors, name, asks) => {
    let newIsLastStep = false;
    console.log(asks);
    const { askLanguage, askCountry } = asks;
    const languageOnly = askLanguage && !askCountry;
    const countryOnly = !askLanguage && askCountry;
    const both = askLanguage && askCountry;
    const newSelectOthers =
      name === "language" ? selectedCountries : selectedLanguages;

    newIsLastStep =
      // Language only
      (languageOnly && newSelectedFactors.length > 0) ||
      // Country only
      (countryOnly && newSelectedFactors.length > 0) ||
      // Both
      (both && newSelectedFactors.length > 0 && newSelectOthers.length > 0);

    setIsLastStep(newIsLastStep);
  };

  const handleNext = () => {
    const maxSteps =
      selectedFactors.includes(languageId) || selectedFactors.includes(originId)
        ? 2
        : 1;

    if (currentStep !== maxSteps) {
      setIsLastStep(false);
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newSelectedParams = selectedParams.map((_) => _);

    // Update params
    selectedCountries.forEach((country) => {
      const newCountry = countries.find((c) => c.id === country);
      const newParam = parameters.find((p) => p.id === newCountry.parameterId);
      newSelectedParams.push(newParam);
    });

    selectedLanguages.forEach((language) => {
      const newLang = languages.find((l) => l.id === language);
      const newParam = parameters.find((p) => p.id === newLang.parameterId);
      newSelectedParams.push(newParam);
    });

    const newParams = Object.fromEntries(
      newSelectedParams.map((p) => [[`${p.name}`], ON])
    );

    // Update factors
    const newData = Object.assign(data, {
      selectedCountries: selectedCountries,
      selectedLanguages: selectedLanguages,
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
      <Container fluid="xxl" className={styles.container}>
        <form onSubmit={handleSubmit}>
          <Step1
            categories={categories}
            factors={factors}
            handleChange={handleStep1}
            currentStep={currentStep}
            selectedFactors={selectedFactors}
            setSelectedFactors={setSelectedFactors}
          />
          <Step2
            handleChange={handleStep2}
            currentStep={currentStep}
            languages={languages}
            countries={countries}
            askLanguage={selectedFactors.includes(languageId)}
            askCountry={selectedFactors.includes(originId)}
            selectedLanguages={selectedLanguages}
            setSelectedLanguages={setSelectedLanguages}
            selectedCountries={selectedCountries}
            setSelectedCountries={setSelectedCountries}
          />
          <div className="survey-button text-center py-3">{showButton()}</div>
        </form>
      </Container>
    </Layout>
  );
}
export async function getStaticProps(context) {
  const categories = await prisma.category.findMany();
  const factors = await prisma.factor.findMany();
  const parameters = await prisma.parameter.findMany();
  const languages = await prisma.language.findMany();
  const countries = await prisma.country.findMany();

  return {
    props: {
      categories,
      factors,
      parameters,
      languages,
      countries,
    }, // will be passed to the page component as props
  };
}
