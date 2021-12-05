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
};

export default Subject;
