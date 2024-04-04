import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../services/firebase";

interface Survey {
  options: Option[];
  question: string;
  uid: string;
}

interface Option {
  id: number;
  option: string;
}

const Home = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);

  const getSurveys = async () => {
    const surveysQuery = query(collection(db, "surveys"));
    const docSnap = await getDocs(surveysQuery);

    if (docSnap.empty) {
      console.log("No surveys found");
    } else {
      const fetchedSurveys: Survey[] = [];
      docSnap.forEach((doc) => {
        const surveyData = doc.data() as Survey;
        fetchedSurveys.push(surveyData);
      });
      setSurveys(fetchedSurveys);
    }
  };

  return (
    <div>
      <button onClick={getSurveys}>GET DOCS</button>
      {surveys &&
        surveys.map((item) => {
          return (
            <div>
              <p>{item.uid}</p>
              <p>{item.question}</p>
              <p>
                {item.options.map((item) => {
                  return <p>{item.option}</p>;
                })}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default Home;
