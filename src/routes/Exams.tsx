import { useState, useRef, useEffect, useContext } from 'react';
import { Row, Col, Button, Form, FormLabel, FormGroup, FormControl, Table } from 'react-bootstrap';

import { LoginContext } from '../Context';
import Task from '../entities/Task';
import SelectableTaskRow from '../exams/SelectableTaskRow';
import { indexToLetter } from '../Common';
import FetchAPI from '../FetchAPI';

export const Exams = () => {
    const loginState = useContext(LoginContext);
    const [tasks, setTasks] = useState([] as Task[]);
    const [taskSelection, setTaskSelection] = useState(tasks.map(() => true));
    const [title, setTitle] = useState('Exam');
    const [variantCount, setVariantCount] = useState(1);
    const [preface, setPreface] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const checkboxRef = useRef<HTMLInputElement>(null);
    const [isDownloadDisabled, setDownloadDisabled] = useState(true);

    let isLogged = loginState.state.isLogged;

    const generateDocument = () => {
        if (iframeRef.current == null) return;
        setDownloadDisabled(true);
        const flattenedTasks = tasks
            .filter((_task, index) => taskSelection[index])
            .map((task, qIndex) => {
                const answers = task.answers
                    .map((answer, aIndex) => `    ${indexToLetter(aIndex)}. ${answer.content}`)
                    .join('    \n');
                return `${qIndex + 1}. ${task.content}    \n${answers}`;
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

${flattenedTasks}
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

    const onChangeSelection = (taskId: number, newSelected: boolean) => {
        setTaskSelection(taskSelection.map((oldSelected, index) =>
            tasks[index].id === taskId ? newSelected : oldSelected));
    };

    useEffect(() => {
        FetchAPI.getAllTasks().then(result => {
            setTasks(result.map((task: any) => Task.fromJson(task)));
            console.log(result.map((task: any) => Task.fromJson(task)));
        });
    }, []);
    useEffect(() => {
        setTaskSelection(tasks.map(() => true));
    }, [tasks]);
    useEffect(generateDocument, [tasks, taskSelection, title, preface]);
    useEffect(() => {
        if (checkboxRef.current == null) return;
        checkboxRef.current.indeterminate = taskSelection.some(sel => sel) && taskSelection.some(sel => !sel);
    }, [taskSelection]);

    if (!isLogged) return (<div className="p-5">Log in to create exams.</div>);
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
                <p className="h5">Choose tasks:</p>
                <Table hover className="w-100" style={{ maxHeight: '100vh', overflow: 'auto' }}>
                <thead>
                    <tr>
                        <th className="border-end" style={{ textAlign: "center", maxWidth: '40px' }}>
                            <input ref={checkboxRef} type="checkbox" checked={taskSelection.every(sel => sel)}
                                onChange={evt => setTaskSelection(taskSelection.map(sel => evt.target.checked))} />
                        </th>
                        <th>Task</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task, index) => (
                        <SelectableTaskRow key={task.id} task={task} selected={taskSelection[index]}
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
