export type Answer = {
    id: number;
    content: string;
    isCorrect: boolean;
};

export type FetchedAnswer = {
    answer_id: number;
    content: string;
    is_correct: string;
    task_id: number;
};

export const fromFetched = (fetched: FetchedAnswer) => ({
    id: fetched.answer_id,
    content: fetched.content,
    isCorrent: fetched.is_correct === 'Y'
});

export default Answer;