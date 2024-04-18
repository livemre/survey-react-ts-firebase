import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { BiLike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { BiShare } from "react-icons/bi";
import { ISurvey, VoteCounts } from "../types/Types";
import { FaCheckCircle } from "react-icons/fa";

import {
  ApiAnswerToSurvey,
  ApiGetSurveysAllAnswers,
  ApiGetUserData,
  GetUserAnswer,
  isUserAnsweredTheSurvey,
} from "../services/ApiCalls";
import { AuthContext, UserProps } from "../Context";

const Survey: React.FC<ISurvey> = ({ question, uid, options, docId }) => {
  const user = useContext(AuthContext);
  const [userData, setUserData] = useState<UserProps | null>();
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [surveyResults, setSurveyResuts] = useState<VoteCounts>();

  useEffect(() => {
    getUserData();
    checkSurveyAnswer();
  }, [user]);

  const getUserData = async () => {
    let username;
    let avatarURL;
    if (uid) {
      const data: UserProps | null = await ApiGetUserData(uid);
      console.log(data);
      setUserData(data);
    }
    return "true";
  };

  const checkSurveyAnswer = async () => {
    console.log("check ediliyor");
    const userId = user?.curUser?.uid;

    if (userId) {
      const isCheck = await isUserAnsweredTheSurvey(userId, docId);
      setIsAnswered(isCheck);
      setLoading(false);
      console.log(userId);

      console.log(isCheck);
    } else {
      console.log("user ID cekilmedi");
    }
  };

  const answerToSurvey = async () => {
    console.log(answer);
    const userId = user?.curUser?.uid;
    if (userId) {
      const _answer = await ApiAnswerToSurvey(docId, userId, answer);
      console.log(_answer);
    }
  };

  const getUserAnswer = async () => {
    const _answer = await GetUserAnswer(docId, user?.curUser?.uid);

    if (_answer !== null) {
      setUserAnswer(_answer);
    }
  };

  const getSurveysAllAnswers = async () => {
    const _results = await ApiGetSurveysAllAnswers(docId);
    setSurveyResuts(_results);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-3 p-3 bg-gray-700 border m-12 rounded">
      {isAnswered && isAnswered == true ? (
        <div>
          <p>Cevap Verilmis</p>
        </div>
      ) : (
        <p>Cevap Verilmemis</p>
      )}
      <div className="flex flex-row items-center gap-2">
        <img className="avatar" src={userData?.photoURL} />
        <p>{userData?.username}</p>
      </div>
      <button onClick={getSurveysAllAnswers}>GET ANSWERS</button>
      <p className="text-2xl">{question}</p>
      {isAnswered && isAnswered == true ? (
        <div>
          <button onClick={getUserAnswer}>GET ANSWER</button>
          {options.map((item, index) => {
            return (
              <div key={index} className="flex flex-row gap-3">
                <p>{item.option}</p>

                <p>{surveyResults?.[item.id]}</p>
                {item.id == userAnswer ? (
                  <FaCheckCircle size={18} color="green" />
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div>
          {options.map((item, index) => {
            return (
              <div key={index} className="flex flex-row gap-3">
                <input
                  type="radio"
                  id="html"
                  name="fav_language"
                  value={item.id}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setAnswer(e.currentTarget.value);
                  }}
                ></input>
                <p>{item.option}</p>
              </div>
            );
          })}
          <button
            onClick={answerToSurvey}
            className="border py-3 bg-primary text-color-white w-full"
          >
            Send
          </button>
        </div>
      )}
      <div className="bg-gray-400 flex flex-row gap-3">
        <div className="px-6 py-3 border rounded">
          <BiLike size={18} className="like-icon" />
        </div>
        <div className="px-6 py-3 border rounded">
          <BiCommentDetail size={18} className="comment-icon" />
        </div>
        <div className="px-6 py-3 border rounded">
          <BiShare size={18} className="comment-icon" />
        </div>
      </div>
    </div>
  );
};

export default Survey;
