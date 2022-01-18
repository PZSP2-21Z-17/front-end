export class FetchAPI {
    static readonly address = `${window.location.protocol}//${window.location.host}/rest/`;

    static fetchGet = async (route: string) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

    static fetchPost = async (route: string, data: any) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

    static fetchDelete = async (route: string) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url, {method: 'DELETE'}
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

    static fetchPatch = async (route: string, data: any) => {
        const url = new URL(route, FetchAPI.address).toString();
        return fetch(url, {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)}
        ).then(
            res => res.json()
        ).catch(
            error => console.log(error)
        );
    };

}

export default FetchAPI;
