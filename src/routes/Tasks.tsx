import { useEffect, useState } from "react";
import { Form, Button, ListGroup, Accordion, Col, Row } from "react-bootstrap";
import Answer from "../entities/Answer";
import Task from "../entities/Task";
import FetchAPI from "../FetchAPI";
import ReactSession from "../ReactSession";
import AnswerEditor from "../tasks/AnswerEditor";
import { addToDict } from '../Common';

export const Tasks = () => {
    const [taskList, setTaskList] = useState([] as Task[]);
    const [editedTask, setEditedTask] = useState(() => {
        let task = new Task();
        task.answers = new Array(4).fill(undefined).map(() => new Answer());
        return task;
    });

    let isLogged = ReactSession.checkValue('username');

    const taskEditorCallback = {
        setAnswerCount: (count: number) => {
            if (editedTask.answers.length > count)
                addToDict(editedTask, setEditedTask, 'answers', editedTask.answers.slice(0, count));
            else if (editedTask.answers.length < count)
                addToDict(editedTask, setEditedTask, 'answers', editedTask.answers.concat(new Array(count - editedTask.answers.length).fill(undefined).map(() => new Answer())));
        },
        updateAnswer: (index: number, newAnswer: Answer) => {
            let newAnswers = editedTask.answers.map((oldAnswer, i) => i !== index ? oldAnswer : newAnswer);
            addToDict(editedTask, setEditedTask, 'answers', newAnswers);
        },
        updateContent: (newContent: string) => {
            addToDict(editedTask, setEditedTask, 'content', newContent);
        }
    };

    const handleTaskSubmit = () => {
        let task = new Task(undefined, editedTask.content, editedTask.answers
            .map(a => new Answer(undefined, a.content, a.isCorrect)));
        console.log(editedTask);
        console.log(task.toJson());
        if (isLogged) {
            FetchAPI.fetchPost('task/create_with_answers', task.toJson()).then(
                () => {
                    updateTasks();
                }
            )
        }
        return false;
    }

    const updateTasks = () => {
        if (!isLogged) return;
        FetchAPI.fetchGet('/task/all_with_answers').then((fetchedTasks: any) => {
            setTaskList(fetchedTasks.map((fetchedTask: any) => Task.fromJson(fetchedTask)));
        });
    }

    useEffect(updateTasks, [isLogged]);

    if (!isLogged)
        return <p>Log in to create tasks.</p>;

    return <div className="p-5" style={{ overflow: "auto", height: "100%"}}>
        <Accordion className="mb-3">
            {taskList.map(task => (
                <Accordion.Item key={task.id} eventKey={task.id!.toString()}>
                    <Accordion.Header>{task.id}. {task.content}</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {task.answers.map(answer => (
                                <ListGroup.Item key={answer.id}>{answer.content}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        
        <Form onSubmit={(evt: any) => {evt.preventDefault(); console.log(editedTask); return handleTaskSubmit();}}>
        <Form.Group as={Row} className="mb-3" controlId="formTaskName">
            <Form.Label column sm={2}>Task content</Form.Label>
                <Col sm={9}>
                    <Form.Control type="text" value={editedTask.content} className="mb-2" onChange={(evt: any) => taskEditorCallback.updateContent(evt.target.value) } />
                </Col>
                <Form.Label column sm={2}>Answers</Form.Label>
                <Col sm={9}>
                    {editedTask.answers.map((answer, index) => (
                        <AnswerEditor key={index} index={index} answer={answer} answerChangeHandler={ taskEditorCallback.updateAnswer } />
                    ))}
                    <Button className="me-3" onClick={() => taskEditorCallback.setAnswerCount(editedTask.answers.length + 1)}>Add answer</Button>
                    <Button disabled={editedTask.answers.length < 1} onClick={() => taskEditorCallback.setAnswerCount(editedTask.answers.length - 1)}>Remove answer</Button>
                </Col>
            </Form.Group>
            <Button className="mb-3" type="submit" variant="primary">
                Submit new task
            </Button>
        </Form>
    </div>;
}

export default Tasks;
