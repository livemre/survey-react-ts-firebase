import {
    addDoc,
    and,
    collection,
    doc,
    documentId,
    getDoc,
    getDocs,
    or,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";
import { ISurvey, surveyResult } from "../types/Types";
import { AuthContext, AuthProps, UserProps } from "../Context";
import { useContext } from "react";
import _ from "lodash";



export const ApiGetSurveys = async () => {
    const surveysQuery = query(collection(db, "surveys"));
    const docSnap = await getDocs(surveysQuery);
    const fetchedSurveys: ISurvey[] = [];

    if (docSnap.empty) {
        console.log("No surveys found");
    } else {
        docSnap.forEach((doc) => {
            const surveyData = doc.data() as ISurvey;
            const docId = doc.id;
            const combinedData = { ...surveyData, docId };
            fetchedSurveys.push(combinedData);
            console.log("selam");

            console.log(doc.id);
        });
    }
    return fetchedSurveys;
};

// survey hangi uyeye aitse profil fotosunu ve kullanici adini al geri dondur.

export const ApiGetUserData = async (uid: string) => {
    let userData: UserProps | null = null;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        console.log("Data Empty");
    } else {
        snapshot.forEach((item) => {
            console.log(item.data());
            const _data = item.data() as UserProps;
            userData = _data;
        });
    }
    return userData;
};

export const ApiAnswerToSurvey = async (
    surveyID: string,
    userId: string,
    answerId: string | null
) => {

    const isUserAnsweredBefore = await isUserAnsweredTheSurvey(userId, surveyID)

    if (!isUserAnsweredBefore) {
        const answerData = {
            id: surveyID,
            answeredUserId: userId,
            answerId: answerId,
        };

        const result = await addDoc(collection(db, "answeredSurveys"), answerData);
        console.log(result);
    } else {
        console.log("User has answered already!");

    }


};

export const isUserAnsweredTheSurvey = async (userID: string, surveyID: string) => {
    const q = query(collection(db, "answeredSurveys"),
        and(
            where("answeredUserId", '==', userID),
            where("id", "==", surveyID)
        )
    )

    const snapshot = await getDocs(q)
    // User eger daha once oy verdiyse .empty false olarak donecek.
    return !snapshot.empty
}


export const GetUserAnswer = async (surveyID: string, userID: string | undefined): Promise<number> => {

    const q = query(collection(db, "answeredSurveys"),
        and(where("id", "==", surveyID),
            where("answeredUserId", "==", userID)))
    console.log(userID);


    const data = await getDocs(q)

    const answerIds: number[] = [];
    const result = data.forEach((_data) => {
        const res = _data.data()
        console.log(res);

        console.log(res.answerId);
        answerIds.push(res.answerId)




    })


    return answerIds[0]

}

export const ApiGetSurveysAllAnswers = async (surveyID: string) => {
    const answers: surveyResult[] = [];
    let optionsLength: number = 0



    // Anketin tum seceneklerininin sayisini bul.

    const docRef = doc(db, "surveys", surveyID)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        optionsLength = docSnap.data().options.length
        console.log(optionsLength);

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }

    let optionsResult: Array<{ value: number; count: number }> = [];

    for (let i = 0; i < optionsLength; i++) {
        optionsResult.push({ value: i, count: 0 });
    }

    console.log(optionsResult);


    const q = query(collection(db, "answeredSurveys"), where("id", "==", surveyID));
    const result = await getDocs(q);



    result.forEach((item) => {
        const answerId = item.data().answerId; // Assuming answerId is a property within the document data

        optionsResult.map((item) => {
            if (answerId - 1 == item.value) {
                return item.count++
            }
        })

    });

    console.log(optionsResult);





    return optionsResult;
};

// export const ApiGetSurveysAllAnswers = async (surveyID: string) => {
//     const answers: number[] = [];

//     const q = query(collection(db, "answeredSurveys"), where("id", "==", surveyID));
//     const snapshot = await getDocs(q);

//     // Use Lodash's chain and flatten to efficiently extract and combine answerIds
//     const allAnswerIds = _(snapshot.docs)
//         .chain()
//         .map((doc) => doc.data().answerId) // Extract answerId from each document
//         .flatten() // Combine answerIds from all documents into a single array
//         .value() as number[]; // Cast to number[] for type safety

//     answers.push(...allAnswerIds);

//     console.log(answers);

//     return answers;
// };