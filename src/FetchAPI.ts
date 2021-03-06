import User from "./entities/User";
import Subject from "./entities/Subject";
import Tag from "./entities/Tag";
import Task, { FetchedTask } from "./entities/Task";

export type TaskSearchCriteria = {
    subjectCode?: Subject['subject_id'];
    tagIds: Tag['tag_id'][];
    searchString?: string;
    pageOffset?: number;
};

export type TaskSearchTipCriteria = {
    searchString?: string;
    pageOffset?: number;
};

export type ExamGenerationRequest = {
    description: string;
    content: string;
    tasks_per_exam: number;
    group_count: number;
    task_ids: number[];
};

export default class FetchAPI {
    static getAllTasks = () => fetchData('/task/all_with_answers/', 'GET');
    static getTasks = (criteria: TaskSearchCriteria) => {
        let searchParams = new URLSearchParams();
        if (criteria.subjectCode !== undefined)
            searchParams.append('subject_code', criteria.subjectCode);
        criteria.tagIds.forEach(e => searchParams.append('tags', e.toString()));
        if (criteria.searchString !== undefined)
            searchParams.append('search_string', criteria.searchString);
        if (criteria.pageOffset !== undefined)
            searchParams.append('offset', criteria.pageOffset.toString());
        return fetchData(`/task/find/?${searchParams.toString()}`, 'GET')
            .then(async data => data.map((e: { Task: FetchedTask, in_use: boolean }) => ({ ...e.Task, in_use: e.in_use })));
    };
    static getTaskSearchTips = (criteria: TaskSearchTipCriteria) => {
        let searchParams = new URLSearchParams();
        if (criteria.searchString !== undefined)
            searchParams.append('search_string', criteria.searchString);
        if (criteria.pageOffset !== undefined)
            searchParams.append('offset', criteria.pageOffset.toString());
        return fetchData(`/task/search_tips/?${searchParams.toString()}`, 'GET');
    };
    static getSubjects = () => fetchData('subject/all/', 'GET');
    static getTags = () => fetchData('tag/all/', 'GET');
    static getFindTags = (input: string) => fetchData(`tag/find/?search_string=${input}`, 'GET');
    static getUserLogged = () => fetchData('user/is_logged/', 'GET')
    static getExam = (exam_id: number) => fetchData(`exam/${exam_id}/groups/`);
    static getExams = () => fetchData(`exam/all/`);
    static getExamGroup = (exam_id: number, group_nr: number) => fetchData(`group/${exam_id}/${group_nr}/`);

    static postUserLogout = () => fetchData('user/logout', 'POST');
    static postUserLogin = (user: User) => fetchData('user/login/', 'POST', user);
    static postUserRegister = (user: User) => fetchData('user/register/', 'POST', user);
    static postSubjectCreate = (subject: Subject) => fetchData('subject/create/', 'POST', subject);
    static postTagCreate = (tag: Tag) => fetchData('tag/create/', 'POST', tag);
    static postTaskCreate = (task: Task) => fetchData('task/create_with_answers/', 'POST', task.toJson());
    static postExamGenerate = (data: ExamGenerationRequest) => fetchData('exam/generate/', 'POST', data);

    static deleteTag = (tag: Tag) => fetchData('tag/delete/', 'DELETE', {tag_id: tag.tag_id});
    static deleteSubject = (subject: Subject) => fetchData('subject/delete/', 'DELETE', {subject_code: subject.subject_id});
    static deleteExam = (examId: number) => fetchData('exam/delete/', 'POST', { exam_id: examId });
    static deleteTask = (taskId: number) => fetchData('task/delete/', 'POST', { task_id: taskId });
}

export function fetchData(url: string, method: string = 'GET', payload?: {}) {
    const config: RequestInit = {
        method: method,
        credentials: 'include'
    };
    if (payload !== undefined) {
        config.headers = {
            'Content-Type': 'application/json'
        };
        config.body = JSON.stringify(payload);
    }
    return fetch(new URL(url, `${window.location.protocol}//${window.location.hostname}:8000`).toString(), config)
        .then(async response => {
            // based on: https://jasonwatmore.com/post/2021/09/22/fetch-vanilla-js-check-if-http-response-is-json-in-javascript
            const isJson = response.headers.get('content-type')?.includes('application/json') ||
                response.headers.get('content-type')?.includes('application/problem+json');
            const data = isJson ? await response.json() : null;
            if (!response.ok) {
                console.log(data);
                let returnData = response.statusText;
                if (data && data.message)
                    returnData = data.message;
                if (data && data.errors && Object.entries(data.errors)[0])
                    returnData = `${Object.entries(data.errors)[0][0]}: ${Object.entries(data.errors)[0][1]}`
                return Promise.reject(returnData);
            }
            return Promise.resolve(data);
        });
}
