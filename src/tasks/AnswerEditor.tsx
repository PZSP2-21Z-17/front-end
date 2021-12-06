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

    const updateAnswer = (changedContent?: string, changedIsCorrect?: boolean) => {
        let answer = new Answer();
        answer.content = content;
        answer.isCorrect = isCorrect;
        if (changedContent) {
            answer.content = changedContent;
            setContent(changedContent);
        }
        if (changedIsCorrect) {
            answer.isCorrect = changedIsCorrect;
            setIsCorrect(changedIsCorrect);
        }
        answerChangeHandler(index, answer);
    };

    return (
        <Form.Group as={Row} className="mb-3" controlId={`formAnswerName-${props.answer.id}`}>
            <Form.Label column sm={3}>Answer content</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" className="mb-2" value={content} onChange={(evt: any) => updateAnswer(evt.target.value) } />
            </Col>
            <Form.Label column sm={3}>Is correct?</Form.Label>
            <Col sm={9}>
                <Form.Check checked={isCorrect} onChange={(evt: any) => updateAnswer(undefined, evt.target.checked) } />
            </Col>
        </Form.Group>
    );
};

export default AnswerEditor;
