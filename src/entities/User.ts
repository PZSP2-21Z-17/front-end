export class User {
    e_mail: string;
    first_name: string;
    last_name: string;
    password: string;

    constructor(e_mail: string, first_name: string, last_name: string, password: string) {
        this.e_mail = e_mail;
        this.first_name = first_name;
        this.last_name = last_name;
        this.password = password;
    }

    toJSON() {
        return {
            password: this.password,
            first_name: this.first_name,
            last_name: this.last_name,
            e_mail: this.e_mail
        };
    }

    static fromJSON(json: {e_mail: string, first_name: string, last_name: string, password: string}) {
        return new User(json['e_mail'], json['first_name'], json['last_name'], json['password']);
    }

    static createEmpty() {
        return new User('', '', '', '');
    }

    // hella ugly, I know
    modifyUser(setter: any, field: string, value: string) {
        switch(field) {
            case 'e_mail': {
                this.e_mail = value;
                break;
            }
            case 'first_name': {
                this.first_name = value;
                break;
            }
            case 'last_name': {
                this.last_name = value;
                break;
            }
            case 'password': {
                this.password = value;
                break;
            }
        }
        setter(this);
    }
};

export default User;
