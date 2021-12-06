export type FetchedAnswer = {
    answer_id?: number;
    content: string;
    is_correct: string;
    task_id?: number;
};

export class Answer {
    id: number | undefined;
    content: string;
    isCorrect: boolean;

    constructor(id?: number, content: string = '', isCorrect: boolean = false) {
        this.id = id;
        this.content = content;
        this.isCorrect = isCorrect;
    }

    toJson() {
        return {
            content: this.content,
            is_correct: this.isCorrect ? 'Y' : 'N'
        } as FetchedAnswer;
    }

    static fromJson(json: FetchedAnswer) {
        let answer = new Answer();
        answer.id = json.answer_id;
        answer.content = json.content;
        answer.isCorrect = json.is_correct === 'Y';
        return answer;
    }
};

export default Answer;
