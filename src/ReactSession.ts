// Partially adapted for TypeScript from https://github.com/grizzthedj/react-session

export class ReactSession {
    static SESSION: string = "__react_session__";
    static EXPIRE: number = 15;

    static getCookie() {
        let name = ReactSession.SESSION + '=';
        let bigCookie = decodeURIComponent(document.cookie);
        let cookies = bigCookie.split(';');

        for(var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];

            while (cookie.charAt(0) === ' ') {
                cookie = cookie.substring(1);
            }
            if (cookie.indexOf(name) === 0) {
                return cookie.substring(name.length, cookie.length);
            }
        }
        return "{}";
    }

    static getUpdatedTime(){
        var now = new Date();
        now.setTime(now.getTime() + (ReactSession.EXPIRE  * 60 * 1000));
        return now.toUTCString();
    }

    static getValue(key: string) {
        return JSON.parse(ReactSession.getCookie())[key];
    };

    static checkValue(key: string) {
        let value = ReactSession.getValue(key);
        return value !== undefined
    };

    static setValue(key: string, value: any) {
        let cookieString = ReactSession.getCookie();
        let cookie;

        if (cookieString){
            cookie = JSON.parse(cookieString);
        }
        cookie[key] = value;

        cookieString = ReactSession.SESSION + '=' + JSON.stringify(cookie) + ';expires=' + ReactSession.getUpdatedTime() + ';path=/';
        document.cookie = cookieString;
    };

    static removeValue(key: string){
        let cookieString = ReactSession.getCookie();
        let cookie;

        if (cookieString){
            cookie = JSON.parse(cookieString);
            delete cookie[key];
        }

        cookieString = ReactSession.SESSION + '=' + JSON.stringify(cookie) + ';expires=' + ReactSession.getUpdatedTime() + ';path=/';
        document.cookie = cookieString;
    };
}

export default ReactSession;
