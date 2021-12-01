export class FetchAPI {
    static address = 'http://127.0.0.1:8080/';

    static fetchGet = async (route: string, func: Function) => {
        return fetch(FetchAPI.address + route
        ).then(
            res => {console.log(res); res.json();}
        ).then(
            func(), (error) => {console.log(error)}
        );
    };

    static fetchPost = async (route: string, data: {}, func: Function) => {
        return fetch(FetchAPI.address + route, {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}}
        ).then(
            res => {res.json()}
        ).then(
            func(), (error) => {console.log(error)}
        );
    };

}

export default FetchAPI;
