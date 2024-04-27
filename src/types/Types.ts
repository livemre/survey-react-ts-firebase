export interface ISurvey {
    options: IOption[];
    question: string;
    uid: string;
    docId: string
    getSurveys: () => void
    image: string
}

interface IOption {
    id: number;
    option: string;
}

export type VoteCounts = {
    [key: number]: number; // Anahtar: Sayı, Değer: Sayı
};

export type surveyResult = {
    value: number
    count: number
}