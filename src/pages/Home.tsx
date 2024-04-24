import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import Survey from "../components/Survey";
import { ISurvey } from "../types/Types";
import { ApiGetSurveys } from "../services/ApiCalls";
import ComBarChart from "../components/ComBarChart";

const Home = () => {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);

  useEffect(() => {
    getSurveys();
  }, []);

  const getSurveys = async () => {
    const surveys = await ApiGetSurveys();
    console.log(surveys);
    console.log("Getsurveys calisti");

    setSurveys(surveys);
  };

  return (
    <div>
      {surveys &&
        surveys.map((item, index) => {
          return (
            <Survey
              getSurveys={getSurveys}
              docId={item.docId}
              key={index}
              question={item.question}
              uid={item.uid}
              options={item.options}
            />
          );
        })}
    </div>
  );
};

export default Home;
