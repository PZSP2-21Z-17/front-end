import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';

import { LoginContext } from '../Context';
import FetchAPI from '../FetchAPI';
import { setArray, addToArray, gSortPred } from '../Common';
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
            FetchAPI.postSubjectCreate(subject).then((json: any) => {
                const newSubject = new Subject(json['subject_code'], subject.name, subject.in_use);
                addToArray(setSubjectList, subjectList, newSubject);
            })
        }
    }

    let subjectForm = loginState.state.isLogged ? (<>
        <Form onSubmit={handleSubjectSubmit}>
            <Form.Group className="mb-3" controlId="formSubjectCode">
                <Form.Label>Subject code</Form.Label>
                <Form.Control type="text" placeholder="Enter subject code" onChange={e => subject.modify(setSubject, 'subject_id', e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formSubjectName">
                <Form.Label>Subject name</Form.Label>
                <Form.Control type="text" placeholder="Enter subject name" onChange={e => subject.modify(setSubject, 'name', e.target.value)}/>
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

    const removeSubject = (subject: Subject) => {
        FetchAPI.deleteSubject(subject).then(() => {
            let newSubjectList = subjectList.filter((other: Subject) => subject.subject_id !== other.subject_id);
            setSubjectList(newSubjectList);
        })
    }

    const generateButton = (subject: Subject) => {
        if (subject.in_use)
            return <></>
        else
            return (<Button variant="danger" onClick={() => removeSubject(subject)}>X</Button>);
    }

    useEffect(getSubjects, [loginState.state.isLogged]);

    let subjectListView = (loginState.state.isLogged && subjectList.length > 0) ? (<>
        <ListGroup>
            {subjectList.sort((a: Subject, b: Subject) => gSortPred(a, b, 'subject_id')).map((subject_) => 
            <div className="d-flex mb-1" key={subject_.subject_id}>
                <ListGroupItem className="flex-grow-1">
                    {subject_.subject_id} - {subject_.name}
                </ListGroupItem>
                {generateButton(subject_)}
            </div>)}
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
