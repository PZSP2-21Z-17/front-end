import Answer, { FetchedAnswer } from './Answer';
import Tag from './Tag';

export type FetchedTask = {
    answers: FetchedAnswer[];
    author_id?: number;
    content: string;
    date_creation: string;
    is_visible: string;
    score: number;
    subject_code?: string;
    task_id?: number;
    tags: Tag[];
};

export class Task {
    id: number | undefined;
    content: string;
    answers: Answer[];
    tags: Tag[];
    subject_code: string;

    constructor(id?: number, content: string = '', answers: Answer[] = [], subject_code = '') {
        this.id = id;
        this.content = content;
        this.answers = answers;
        this.tags = [];
        this.subject_code = subject_code;
    }

    toJson = () => {
        return {
            answers: this.answers.map(answer => answer.toJson()),
            content: this.content,
            date_creation: '2019-11-08T09:00:37.247426',
            is_visible: 'Y',
            score: 1,
            subject_code: this.subject_code,
            //author_id: 1,
            tags: this.tags
        } as FetchedTask;
    }

    static fromJson(json: FetchedTask) {
        let task = new Task();
        task.id = json.task_id;
        task.content = json.content;
        task.answers = json.answers.map(fetchedAnswer => Answer.fromJson(fetchedAnswer));
        return task;
    }
};

export default Task;
