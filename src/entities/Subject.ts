export class Subject {
    subject_code: string;
    name: string;

    constructor(subject_code: string, name: string){
        this.subject_code = subject_code;
        this.name = name;
    }

    toJSON() {
        return {
            subject_code: this.subject_code,
            name: this.name
        };
    }

    static fromJSON(json: {subject_code: string, name: string}) {
        return new Subject(json['subject_code'], json['name']);
    }

    static createEmpty() {
        return new Subject('', '');
    }

    // hella ugly, I know
    modify(setter: any, field: string, value: string) {
        switch(field) {
            case 'subject_code': {
                this.subject_code = value;
                break;
            }
            case 'name': {
                this.name = value;
                break;
            }
        }
        setter(this);
    }
};

export default Subject;
