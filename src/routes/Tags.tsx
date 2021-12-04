import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import FetchAPI from '../FetchAPI';
import ReactSession from '../ReactSession';
import { setDict,  setArray, refresh } from '../Common';
import { ListGroupItem } from 'react-bootstrap';

type TagsProps = {};

export const Tags: FunctionComponent<TagsProps> = () => {
    const [form, setForm] = useState({tag_code: '', name: ''});
    const [tagList, setTagList] = useState([]);

    let isLogged = ReactSession.checkValue('username');

    const handleTagSubmit = (event: any) => {
        event.preventDefault();
        if (isLogged) {
            FetchAPI.fetchPost('tag/create/', form).then(
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
                <Form.Control type="text" placeholder="Enter tag name" className="w-25" onChange={e => setDict(setForm, {tag_code: e.target.value.substr(0, 3), name: e.target.value})}/>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">
                Create
            </Button>
        </Form>
    </>) : (<></>);

    
    if (tagList.length === 0) {FetchAPI.fetchGet('tag/all/').then((json: []) => setArray(setTagList, json)); }

    let tagListView = (isLogged && tagList.length > 0) ? (<>
        <ListGroup>
            {tagList.map((tag) => <ListGroupItem key={tag['tag_code']}>{tag['tag_code']} - {tag['name']}</ListGroupItem>)}
        </ListGroup>
    </>) : (<></>);

    let userMessage = isLogged ? (<></>) : (<>Log in to create tags.</>);

    return <div className="p-5">
        {userMessage}
        {tagListView}
        
        {tagForm}
    </div>;
}

export default Tags;
