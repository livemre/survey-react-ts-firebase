export interface ISurvey {
    options: IOption[];
    question: string;
    uid: string;
    docId: string
}

interface IOption {
    id: number;
    option: string;
}

export type VoteCounts = {
    [key: number]: number; // Anahtar: Sayı, Değer: Sayı
};