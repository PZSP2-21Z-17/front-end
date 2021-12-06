import { FunctionComponent, useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Answer from "../entities/Answer";
import Task from "../entities/Task";
import AnswerEditor from "./AnswerEditor";

type TaskEditorProps = {
    task: Task;
    taskChangeHandler: (changedTask: Task) => void;
};

export const TaskEditor: FunctionComponent<TaskEditorProps> = (props: TaskEditorProps) => {
    const [content, setContent] = useState(props.task.content);
    const [answers, setAnswers] = useState(props.task.answers);

    const taskChangeHandler = props.taskChangeHandler;

    const setAnswerCount = (count: number) => {
        if (answers.length > count)
            setAnswers(answers.slice(0, count));
        else if (answers.length < count)
            setAnswers(answers.concat(new Array(count - answers.length).fill(undefined).map(() => new Answer())));
    };

    const updateAnswer = (changedIndex: number, newAnswer: Answer) => {
        setAnswers(answers.map((oldAnswer, index) => index !== changedIndex ? oldAnswer : newAnswer ));
        updateTask();
    };

    const updateTask = () => {
        let task = new Task();
        task.content = content;
        task.answers = answers;
        taskChangeHandler(task);
    };

    return (
        <Form.Group as={Row} className="mb-3" controlId="formTaskName">
            <Form.Label column sm={3}>Task content</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" value={content} onChange={(evt: any) => {setContent(evt.target.value); updateTask(); }} />
            </Col>
            <Form.Label column sm={3}>Answers</Form.Label>
            <Col sm={9}>
                {answers.map((answer, index) => (
                    <AnswerEditor key={index} index={index} answer={answer} answerChangeHandler={updateAnswer} />
                ))}
                <Button onClick={() => setAnswerCount(answers.length + 1)}>Add answer</Button>
                <Button disabled={answers.length < 1} onClick={() => setAnswerCount(answers.length - 1)}>Remove answer</Button>
            </Col>
        </Form.Group>
    );
};

export default TaskEditor;
