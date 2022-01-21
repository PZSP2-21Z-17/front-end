export class Tag {
    tag_id: number;
    name: string;
    in_use: boolean;

    constructor(tag_id: number, name: string, in_use: boolean) {
        this.tag_id = tag_id;
        this.name = name;
        this.in_use = in_use;
    }

    toJSON() {
        return {
            tag_id: this.tag_id,
            name: this.name,
            in_use: this.in_use
        };
    }

    static fromJSON(json: { tag_id: number, name: string, in_use: boolean}) {
        return new Tag(json['tag_id'], json['name'], json['in_use']);
    }

    static createEmpty() {
        return new Tag(0, '', false);
    }
};

export default Tag;
