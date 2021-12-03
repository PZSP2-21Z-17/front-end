export class FetchAPI {
    static readonly address = 'http://127.0.0.1:8000/';

    static fetchGet = async (route: string) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

    static fetchPost = async (route: string, data: {}) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

}

export default FetchAPI;
