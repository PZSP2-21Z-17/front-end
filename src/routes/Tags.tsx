import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';
import { setArray, refresh } from '../Common';
import { ListGroupItem } from 'react-bootstrap';
import Tag from '../entities/Tag';

type TagsProps = {};

export const Tags: FunctionComponent<TagsProps> = () => {
    const loginState = useContext(LoginContext);
    const [tag, setTag] = useState(Tag.createEmpty());
    const [tagList, setTagList] = useState([] as Tag[]);

    const handleTagSubmit = (event: any) => {
        event.preventDefault();
        if (loginState.state.isLogged) {
            FetchAPI.postTagCreate(tag).then(
                (json: any) => {
                    refresh();
                }
            )
        }
    }

    let tagForm = loginState.state.isLogged ? (<>
        <Form onSubmit={handleTagSubmit}>
            <Form.Group className="mb-3" controlId="formTagName">
                <Form.Label>Tag name</Form.Label>
                <Form.Control type="text" placeholder="Enter tag name" className="w-25" onChange={e => setTag(new Tag(Number(e.target.value), e.target.value))}/>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">
                Create
            </Button>
        </Form>
    </>) : (<></>);
 
    const getTags = () => {
        if (loginState.state.isLogged) {
            FetchAPI.getTags().then(
                (jsonArray: []) => {
                    if (jsonArray.length > 0) setArray(setTagList, jsonArray.map(json => Tag.fromJSON(json)))
                }
            );
        }
    };

    useEffect(getTags, [loginState.state.isLogged]);

    let tagListView = (loginState.state.isLogged && tagList.length > 0) ? (<>
        <ListGroup>
            {tagList.map((tag_) => <ListGroupItem key={tag_.tag_id}>{tag_.tag_id} - {tag_.name}</ListGroupItem>)}
        </ListGroup>
    </>) : (<></>);

    let userMessage = loginState.state.isLogged ? (<></>) : (<>Log in to create tags.</>);

    return (
        <>
            {userMessage}
            {tagListView}
            <p></p>
            {tagForm}
        </>
    );
}

export default Tags;
