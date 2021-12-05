export class Tag {
    tag_code: string;
    name: string;

    constructor(tag_code: string, name: string) {
        this.tag_code = tag_code;
        this.name = name;
    }

    toJSON() {
        return {
            tag_code: this.tag_code,
            name: this.name
        };
    }

    static fromJSON(json: {tag_code: string, name: string}) {
        return new Tag(json['tag_code'], json['name']);
    }

    static createEmpty() {
        return new Tag('', '');
    }
};

export default Tag;
