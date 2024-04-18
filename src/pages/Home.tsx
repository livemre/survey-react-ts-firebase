import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../services/firebase";
import Survey from "../components/Survey";
import { ISurvey } from "../types/Types";
import { ApiGetSurveys } from "../services/ApiCalls";

const Home = () => {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);

  const getSurveys = async () => {
    const surveys = await ApiGetSurveys();
    console.log(surveys);

    setSurveys(surveys);
  };

  return (
    <div>
      <button onClick={getSurveys}>GET DOCS</button>
      {surveys &&
        surveys.map((item, index) => {
          return (
            <Survey
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
