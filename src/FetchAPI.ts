import User from "./entities/User";
import Subject from "./entities/Subject";
import Tag from "./entities/Tag";
import Task from "./entities/Task";

export default class FetchAPI {
    static getAllTasks = () => fetchData('/task/all_with_answers/', 'GET');
    static getSubjects = () => fetchData('subject/all/', 'GET');
    static getTags = () => fetchData('tag/all/', 'GET');

    static postUserLogin = (user: User) => fetchData('user/login/', 'POST', user);
    static postUserRegister = (user: User) => fetchData('user/register/', 'POST', user);
    static postSubjectCreate = (subject: Subject) => fetchData('subject/create/', 'POST', subject);
    static postTagCreate = (tag: Tag) => fetchData('tag/create/', 'POST', tag);
    static postTaskCreate = (task: Task) => fetchData('task/create_with_answers/', 'POST', task.toJson());

}

export function fetchData(url: string, method: string = 'GET', payload?: {}) {
    const config: RequestInit = {
        method: method
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
