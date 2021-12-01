export class FetchAPI {
    static address = 'http://127.0.0.1:8000/';

    static fetchGet = async (route: string, func: Function) => {
        return fetch(FetchAPI.address + route
        ).then(
            res => {console.log(res); res.json();}
        ).then(
            func(), (error) => {console.log(error)}
        );
    };

    static fetchPost = async (route: string, data: {}, func: Function) => {
        return fetch(FetchAPI.address + route, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}
        ).then(
            res => res.json()
        ).then(
            res => func(res), (error) => {console.log(error)}
        );
    };

}

export default FetchAPI;
