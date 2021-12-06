import Answer, { FetchedAnswer } from './Answer';

export type FetchedTask = {
    answers: FetchedAnswer[];
    author_id?: number;
    contents: string;
    date_creation: string;
    is_visible: string;
    score: number;
    subject_code?: string;
    task_id?: number;
};

export class Task {
    id: number | undefined;
    content: string;
    answers: Answer[];

    constructor(id?: number, content: string = '', answers: Answer[] = []) {
        this.id = id;
        this.content = content;
        this.answers = answers;
    }

    toJson = () => {
        return {
            answers: this.answers.map(answer => answer.toJson()),
            contents: this.content,
            date_creation: '2019-11-08T09:00:37.247426',
            is_visible: 'Y',
            score: 1,
            subject_code: 'PZSP2',
            author_id: 1
        } as FetchedTask;
    }

    static fromJson(json: FetchedTask) {
        let task = new Task();
        task.id = json.task_id;
        task.content = json.contents;
        task.answers = json.answers.map(fetchedAnswer => Answer.fromJson(fetchedAnswer));
        return task;
    }
};

export default Task;
