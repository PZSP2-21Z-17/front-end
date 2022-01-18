import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import FetchAPI from '../FetchAPI';
import ReactSession from '../ReactSession';
import { setArray, refresh } from '../Common';
import { ListGroupItem } from 'react-bootstrap';
import Tag from '../entities/Tag';

type TagsProps = {};

export const Tags: FunctionComponent<TagsProps> = () => {
    const [tag, setTag] = useState(Tag.createEmpty());
    const [tagList, setTagList] = useState([] as Tag[]);

    let isLogged = ReactSession.checkValue('username');

    const handleTagSubmit = (event: any) => {
        event.preventDefault();
        if (isLogged) {
            FetchAPI.postTagCreate(tag).then(
                (json: any) => {
                    refresh();
                }
            )
        }
    }

    let tagForm = isLogged ? (<>
        <Form onSubmit={handleTagSubmit}>
            <Form.Group className="mb-3" controlId="formTagName">
                <Form.Label>Tag name</Form.Label>
                <Form.Control type="text" placeholder="Enter tag name" className="w-25" onChange={e => setTag(new Tag(e.target.value.substr(0, 3), e.target.value))}/>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">
                Create
            </Button>
        </Form>
    </>) : (<></>);
    
    if (tagList.length === 0) {
        FetchAPI.getTags().then(
            (jsonArray: []) => {
                if (jsonArray.length > 0) setArray(setTagList, jsonArray.map(json => Tag.fromJSON(json)))
            }
        );
    }
    let tagListView = (isLogged && tagList.length > 0) ? (<>
        <ListGroup>
            {tagList.map((tag_) => <ListGroupItem key={tag_.tag_code}>{tag_.tag_code} - {tag_.name}</ListGroupItem>)}
        </ListGroup>
    </>) : (<></>);

    let userMessage = isLogged ? (<></>) : (<>Log in to create tags.</>);

    return <div className="p-5">
        {userMessage}
        {tagListView}
        <p></p>
        {tagForm}
    </div>;
}

export default Tags;
