import { useState, useEffect } from 'react';
import { Form, Button, Col, Row } from "react-bootstrap";
import Task from "../entities/Task";
import Answer from "../entities/Answer";
import AnswerEditor from "./AnswerEditor";
import FetchAPI from "../FetchAPI";
import { addToDict } from '../Common';
import TagSearchBar from './TagSearchBar';
import Subject from '../entities/Subject';
import { setArray } from '../Common';

type TaskAdderProps = {
    onSubmit?: (addedTask: Task) => void;
};

export default function TaskAdder(props: TaskAdderProps) {
    const [editedTask, setEditedTask] = useState(() => {
        let task = new Task();
        task.answers = new Array(4).fill(undefined).map(() => new Answer());
        return task;
    });
    const [subjectList, setSubjectList] = useState([] as Subject[]);

    const getSubjects = () => {
        FetchAPI.getSubjects().then(
            (jsonArray: []) => {
                if (jsonArray.length > 0) setArray(setSubjectList, jsonArray.map(json => Subject.fromJSON(json)))
            }
        );
    };

    useEffect(getSubjects, []);

    const taskEditorCallback = {
        setAnswerCount: (count: number) => {
            if (editedTask.answers.length > count)
                addToDict(setEditedTask, editedTask, 'answers', editedTask.answers.slice(0, count));
            else if (editedTask.answers.length < count)
                addToDict(setEditedTask, editedTask, 'answers', editedTask.answers.concat(new Array(count - editedTask.answers.length).fill(undefined).map(() => new Answer())));
        },
        updateAnswer: (index: number, newAnswer: Answer) => {
            let newAnswers = editedTask.answers.map((oldAnswer, i) => i !== index ? oldAnswer : newAnswer);
            addToDict(setEditedTask, editedTask, 'answers', newAnswers);
        },
        updateContent: (newContent: string) => {
            addToDict(setEditedTask, editedTask, 'content', newContent);
        }
    };

    const handleSubmit = (evt: any) => {
        evt.preventDefault();
        if (!props.onSubmit)
            return;
        props.onSubmit(editedTask);
    };

    const updateSearchResults = (pickedTags: any) => {
        editedTask['tags'] = pickedTags;
        setEditedTask(editedTask);
    }

    const generateSubjectSelect = (<>{
        subjectList.map((subject_: Subject) => 
            <option key={subject_.subject_id} value={subject_.subject_id}>{subject_.name}</option>
        )
    }</>)

    const editPrivacy = (a: boolean) => {
        addToDict(setEditedTask, editedTask, 'is_visible', a? 'Y': 'N');
    }
    
    return (
        <Form onSubmit={handleSubmit}>

            <Form.Select className="mb-2" onChange={e => addToDict(setEditedTask, editedTask, 'subject_code', e.target.value)}>
                <option>Select subject</option>
                {generateSubjectSelect}
            </Form.Select>
            <TagSearchBar onSubmit={updateSearchResults} />
            <Form.Check className="mb-2" label="Public task" onChange={e => editPrivacy(e.target.checked)} />

            <Form.Group as={Row} className="mb-3" controlId="formTaskName">
                <Form.Label column sm={2}>Task content</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={editedTask.content} className="mb-2" onChange={(evt: any) => taskEditorCallback.updateContent(evt.target.value)} />
                </Col>
                <Form.Label column sm={2}>Answers</Form.Label>
                <Col sm={9}>
                    {editedTask.answers.map((answer, index) => (
                        <AnswerEditor key={index} index={index} answer={answer} answerChangeHandler={taskEditorCallback.updateAnswer} />
                    ))}
                    <Button className="me-3" onClick={() => taskEditorCallback.setAnswerCount(editedTask.answers.length + 1)}>Add answer</Button>
                    <Button disabled={editedTask.answers.length < 1} onClick={() => taskEditorCallback.setAnswerCount(editedTask.answers.length - 1)}>Remove answer</Button>
                </Col>
            </Form.Group>
        </Form>
    );
}

//<Button className="mb-3" type="submit" variant="primary">
//Submit new task
//</Button>