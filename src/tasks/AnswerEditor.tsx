import { Form, Row, Col } from "react-bootstrap";
import Answer from "../entities/Answer";

type AnswerEditorProps = {
    index: number;
    answer: Answer;
    answerChangeHandler: (index: number, changedAnswer: Answer) => void;
};

export default function AnswerEditor(props: AnswerEditorProps) {
    const answerChangeHandler = props.answerChangeHandler;
    const index = props.index;

    const updateAnswer = (changedContent?: string, changedIsCorrect?: boolean) => {
        let answer = new Answer();
        answer.content = props.answer.content;
        answer.isCorrect = props.answer.isCorrect;
        if (changedContent !== undefined)
            answer.content = changedContent;
        if (changedIsCorrect !== undefined)
            answer.isCorrect = changedIsCorrect;
        answerChangeHandler(index, answer);
    };

    return (
        <Form.Group as={Row} className="mb-3" controlId={`formAnswerName-${props.answer.id}`}>
            <Form.Label column sm={3}>Answer content</Form.Label>
            <Col sm={9}>
                <Form.Control type="text" className="mb-2" value={props.answer.content}
                    onChange={(evt: any) => updateAnswer(evt.target.value) } />
            </Col>
            <Form.Label column sm={3}>Is correct?</Form.Label>
            <Col sm={9}>
                <Form.Check checked={props.answer.isCorrect}
                    onChange={(evt: any) => updateAnswer(undefined, evt.target.checked) } />
            </Col>
        </Form.Group>
    );
};
