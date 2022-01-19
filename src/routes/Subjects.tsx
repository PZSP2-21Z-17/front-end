import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';
import { setArray, refresh } from '../Common';
import { ListGroupItem } from 'react-bootstrap';
import Subject from '../entities/Subject';

type SubjectsProps = {};

export const Subjects: FunctionComponent<SubjectsProps> = () => {
    const loginState = useContext(LoginContext);
    const [subject, setSubject] = useState(Subject.createEmpty());
    const [subjectList, setSubjectList] = useState([] as Subject[]);

    const handleSubjectSubmit = (event: any) => {
        event.preventDefault();
        if (loginState.state.isLogged) {
            FetchAPI.postSubjectCreate(subject).then(
                (json: any) => {
                    refresh();
                }
            )
        }
    }

    let subjectForm = loginState.state.isLogged ? (<>
        <Form onSubmit={handleSubjectSubmit}>
            <Form.Group className="mb-3" controlId="formSubjectCode">
                <Form.Label>Subject code</Form.Label>
                <Form.Control type="text" placeholder="Enter subject code" className="w-25" onChange={e => subject.modify(setSubject, 'subject_code', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectName">
                <Form.Label>Subject name</Form.Label>
                <Form.Control type="text" placeholder="Enter subject name" className="w-25" onChange={e => subject.modify(setSubject, 'name', e.target.value)}/>
            </Form.Group>

            <Button type="submit" variant="primary" className="mb-3">
                Create
            </Button>
        </Form>
    </>) : (<></>);

    const getSubjects = () => {
        if (loginState.state.isLogged) {
            FetchAPI.getSubjects().then(
                (jsonArray: []) => {
                    if (jsonArray.length > 0) setArray(setSubjectList, jsonArray.map(json => Subject.fromJSON(json)))
                }
            );
        }
    };

    useEffect(getSubjects, [loginState.state.isLogged]);

    let subjectListView = (loginState.state.isLogged && subjectList.length > 0) ? (<>
        <ListGroup>
            {subjectList.map((subject_) => <ListGroupItem key={subject_.subject_code}>{subject_.subject_code} - {subject_.name}</ListGroupItem>)}
        </ListGroup>
    </>) : (<></>);

    let userMessage = loginState.state.isLogged ? (<></>) : (<>Log in to create subjects.</>);

    return (
        <>
            {userMessage}
            {subjectListView}
            <p></p>
            {subjectForm}
        </>
    );
}

export default Subjects;
