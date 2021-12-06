import { FunctionComponent, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import Answer from "../entities/Answer";

type AnswerEditorProps = {
    index: number;
    answer: Answer;
    answerChangeHandler: (index: number, changedAnswer: Answer) => void;
};

export const AnswerEditor: FunctionComponent<AnswerEditorProps> = (props: AnswerEditorProps) => {
    const [content, setContent] = useState(props.answer.content);
    const [isCorrect, setIsCorrect] = useState(props.answer.isCorrect);

    const answerChangeHandler = props.answerChangeHandler;
    const index = props.index;

    const updateAnswer = () => {
        let answer = new Answer();
        answer.content = content;
        answer.isCorrect = isCorrect;
        answerChangeHandler(index, answer);
    };

    return (
        <Form.Group as={Row} className="mb-3" controlId={`formAnswerName-${props.answer.id}`}>
            <Form.Label column sm={3}>Answer content</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" value={content} onChange={(evt: any) => { setContent(evt.target.value); updateAnswer(); } } />
            </Col>
            <Form.Label column sm={3}>Is correct?</Form.Label>
            <Col sm={9}>
                <Form.Check checked={isCorrect} onChange={(evt: any) => { setIsCorrect(evt.target.checked); updateAnswer(); } } />
            </Col>
        </Form.Group>
    );
};

export default AnswerEditor;
