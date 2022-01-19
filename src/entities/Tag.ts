export class Tag {
    tag_id: number;
    name: string;

    constructor(tag_id: number, name: string) {
        this.tag_id = tag_id;
        this.name = name;
    }

    toJSON() {
        return {
            tag_code: this.tag_id,
            name: this.name
        };
    }

    static fromJSON(json: {tag_id: number, name: string}) {
        return new Tag(json['tag_id'], json['name']);
    }

    static createEmpty() {
        return new Tag(0, '');
    }
};

export default Tag;
