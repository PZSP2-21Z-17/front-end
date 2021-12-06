import Answer, * as AnswerUtils from "./Answer";

export type Question = {
    id: number;
    contents: string;
    answers: Answer[];
};

export type FetchedQuestion = {
    answers: AnswerUtils.FetchedAnswer[];
    author_id: number;
    contents: string;
    date_creation: string;
    is_visible: string;
    score: number;
    subject_code: string;
    task_id: number;
};

export const fromFetched = (fetched: FetchedQuestion) => ({
    id: fetched.task_id,
    contents: fetched.contents,
    answers: fetched.answers.map(fetchedAnswer => AnswerUtils.fromFetched(fetchedAnswer))
});

export default Question;
