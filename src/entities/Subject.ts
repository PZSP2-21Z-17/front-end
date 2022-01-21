export class Subject {
    subject_id: string;
    name: string;
    in_use: boolean;

    constructor(subject_id: string, name: string, in_use: boolean){
        this.subject_id = subject_id;
        this.name = name;
        this.in_use = in_use;
    }

    toJSON() {
        return {
            subject_code: this.subject_id,
            name: this.name,
            in_use: this.in_use
        };
    }

    static fromJSON(json: {subject_code: string, name: string, in_use: boolean}) {
        return new Subject(json['subject_code'], json['name'], json['in_use']);
    }

    static createEmpty() {
        return new Subject('', '', false);
    }

    // hella ugly, I know
    modify(setter: any, field: string, value: any) {
        switch(field) {
            case 'subject_id': {
                this.subject_id = value;
                break;
            }
            case 'name': {
                this.name = value;
                break;
            }
            case 'in_use': {
                this.in_use = value;
                break;
            }
        }
        setter(this);
    }
};

export default Subject;
