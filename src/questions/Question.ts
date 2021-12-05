import Answer from "./Answer";

export type Question = {
    id: number;
    contents: string;
    answers: Answer[];
};

export default Question;
