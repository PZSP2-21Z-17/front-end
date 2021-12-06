import React, { FunctionComponent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import FetchAPI from '../FetchAPI';
import ReactSession from '../ReactSession';
import { setArray, refresh } from '../Common';
import { ListGroupItem } from 'react-bootstrap';
import Subject from '../entities/Subject';

type SubjectsProps = {};

export const Subjects: FunctionComponent<SubjectsProps> = () => {
    const [subject, setSubject] = useState(Subject.createEmpty());
    const [subjectList, setSubjectList] = useState([] as Subject[]);

    let isLogged = ReactSession.checkValue('username');

    const handleSubjectSubmit = (event: any) => {
        event.preventDefault();
        if (isLogged) {
            FetchAPI.fetchPost('subject/create/', subject).then(
                (json: any) => {
                    refresh();
                }
            )
        }
    }

    let subjectForm = isLogged ? (<>
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

    if (subjectList.length === 0) {FetchAPI.fetchGet('subject/all/').then((jsonArray: []) => setArray(setSubjectList, jsonArray.map(json => Subject.fromJSON(json)))); }

    let subjectListView = (isLogged && subjectList.length > 0) ? (<>
        <ListGroup>
            {subjectList.map((subject_) => <ListGroupItem key={subject_.subject_code}>{subject_.subject_code} - {subject_.name}</ListGroupItem>)}
        </ListGroup>
    </>) : (<></>);

    let userMessage = isLogged ? (<></>) : (<>Log in to create subjects.</>);

    return <div className="p-5">
        {userMessage}
        {subjectListView}
        <p></p>
        {subjectForm}
    </div>;
}

export default Subjects;
