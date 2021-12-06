import { useState, useRef, useEffect } from 'react';
import Question, * as QuestionUtils from '../entities/Question';
import SelectableQuestionRow from '../exams/SelectableQuestionRow';
import { indexToLetter } from '../Common';
import { Row, Col, Button, Form, FormLabel, FormGroup, FormControl, Table } from 'react-bootstrap';
import FetchAPI from '../FetchAPI';

export const Exams = () => {
    const [questions, setQuestions] = useState([] as Question[]);
    const [questionSelection, setQuestionSelection] = useState(questions.map(() => true));
    const [title, setTitle] = useState('Exam');
    const [variantCount, setVariantCount] = useState(1);
    const [preface, setPreface] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isDownloadDisabled, setDownloadDisabled] = useState(true);

    const generateDocument = () => {
        if (iframeRef.current == null) return;
        setDownloadDisabled(true);
        const flattenedQuestions = questions
            .filter((_question, index) => questionSelection[index])
            .map((question, qIndex) => {
                const answers = question.answers
                    .map((answer, aIndex) => `    ${indexToLetter(aIndex)}. ${answer.content}`)
                    .join('    \n');
                return `${qIndex + 1}. ${question.contents}    \n${answers}`;
            })
            .join('\n\n');
        const quotedPreface = preface ? `> ${preface}` : '';
        const iframeDocument = iframeRef.current.contentWindow!.document;
        iframeDocument.write(`
            <script src="https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>
            <script>window.texme = { style: 'plain' }</script>
            <script src="https://cdn.jsdelivr.net/npm/texme@1.0.0"></script>
            <style>
                textarea { visibility: hidden; }
                #loader { display: none; width: 75px; }
                textarea + #loader { display: block; }
            </style>
            <textarea>
# ${title}

${quotedPreface}

${flattenedQuestions}
            </textarea>
            <img id="loader" src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif">
        `);
        iframeDocument.close();
        setTimeout(() => setDownloadDisabled(false), 500);  // TODO: user a proper debounce function
    };

    const downloadDocument = () => {
        if (iframeRef.current == null) return;
        (iframeRef.current.contentWindow! as any).eval(`
            scrollTo(0, 0);
            html2pdf()
                .set({ html2canvas: { scale: 8 }, pagebreak: { mode: 'avoid-all' } })
                .from(document.body.parentNode)
                .save();
        `);
    };

    const onChangeSelection = (questionId: number, newSelected: boolean) => {
        setQuestionSelection(questionSelection.map((oldSelected, index) =>
            questions[index].id === questionId ? newSelected : oldSelected));
    };

    useEffect(() => {
        FetchAPI.fetchGet('/group/answers/1/1').then(result => {
            setQuestions(result.task_affs.map((taskAff: any) => QuestionUtils.fromFetched(taskAff.tasks)));
            console.log(result.task_affs.map((taskAff: any) => QuestionUtils.fromFetched(taskAff.tasks)));
        });
    }, []);
    useEffect(() => {
        setQuestionSelection(questions.map(() => true));
    }, [questions]);
    useEffect(generateDocument, [questions, questionSelection, title, preface]);
    useEffect(() => {
        if (checkboxRef.current == null) return;
        checkboxRef.current.indeterminate = questionSelection.some(sel => sel) && questionSelection.some(sel => !sel);
    }, [questionSelection]);

    return (
        <div className="d-flex h-100">
            <div className="bg-light bg-gradient p-3" style={{ flexBasis: '50%', overflow: 'auto' }}>
                <p className="h2">Exam creation</p>
                <Form className="mb-3">
                    <FormGroup className="mb-1" as={Row} controlId="exam-title">
                        <FormLabel column sm={3}>Title</FormLabel>
                        <Col sm={9}>
                            <FormControl type="text" value={title} onChange={evt => setTitle(evt.target.value)} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" as={Row} controlId="exam-variant-count">
                        <FormLabel column sm={3}>Variant count</FormLabel>
                        <Col sm={9}>
                            <FormControl type="number" value={variantCount} onChange={evt => setVariantCount(Number(evt.target.value))} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" as={Row} controlId="exam-preface">
                        <FormLabel column sm={3}>Preface</FormLabel>
                        <Col sm={9}>
                            <FormControl as="textarea" value={preface} onChange={evt => setPreface(evt.target.value)} />
                        </Col>
                    </FormGroup>
                    <Button variant="primary" onClick={downloadDocument} disabled={isDownloadDisabled}>Download generated PDF</Button>
                </Form>
                <p className="h5">Choose questions:</p>
                <Table hover className="w-100" style={{ maxHeight: '100vh', overflow: 'auto' }}>
                <thead>
                    <tr>
                        <th className="border-end" style={{ textAlign: "center", maxWidth: '40px' }}>
                            <input ref={checkboxRef} type="checkbox" checked={questionSelection.every(sel => sel)}
                                onChange={evt => setQuestionSelection(questionSelection.map(sel => evt.target.checked))} />
                        </th>
                        <th>Question</th>
                    </tr>
                </thead>
                <tbody>
                    {questions.map((question, index) => (
                        <SelectableQuestionRow key={question.id} question={question} selected={questionSelection[index]}
                            onChangeSelection={onChangeSelection} />
                    ))}
                </tbody>
                </Table>
            </div>
            <div className="border border-dark border-2" style={{ flexBasis: '50%' }}>
                <iframe title="pdf-preview" ref={iframeRef} className="d-block w-100 h-100"></iframe>
            </div>
        </div>
    );
}

export default Exams;
