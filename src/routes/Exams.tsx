import { useState, useRef, useEffect, useContext } from 'react';
import { Row, Col, Button, Form, FormLabel, FormGroup, FormControl } from 'react-bootstrap';
import { LoginContext } from '../Context';
import Task from '../entities/Task';
import { indexToLetter } from '../Common';
import SearchWithResults from '../tasks/SearchWithResults';
import TaskListing, { TaskAction } from '../tasks/TaskListing';

export const Exams = () => {
    const loginState = useContext(LoginContext);
    const [pool, setPool] = useState([] as Task[]);
    const [title, setTitle] = useState('Exam');
    const [variantCount, setVariantCount] = useState(1);
    const [preface, setPreface] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isDownloadDisabled, setDownloadDisabled] = useState(true);

    const generateDocument = () => {
        if (iframeRef.current == null) return;
        setDownloadDisabled(true);
        const flattenedTasks = pool
            .map((task, qIndex) => {
                const answers = task.answers
                    .map((answer, aIndex) => `    ${indexToLetter(aIndex)}. ${answer.content}`)
                    .join('    \n');
                return `${qIndex + 1}. ${task.content}    \n${answers}`;
            })
            .join('\n\n');
        const quotedPreface = preface ? preface.split('\n').map(e => `> ${e}`).join('    \n') : '';
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

${flattenedTasks.length ? flattenedTasks : 'Add some tasks to the pool...'}
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

    useEffect(generateDocument, [pool, title, preface]);

    const poolIds = pool.map(e => e.id);

    const taskSorter = (a: Task, b: Task) => a.id! === b.id! ? 0 : a.id! < b.id! ? -1 : 1;

    const onTaskAction = (action: TaskAction, task: Task) => {
        if (action === 'add' && poolIds.indexOf(task.id!) === -1)
            setPool([...pool, task].sort(taskSorter));
        if (action === 'remove' && poolIds.indexOf(task.id!) !== -1)
            setPool(pool.filter(e => e.id! !== task.id!));
    };

    if (!loginState.state.isLogged)
        return (<div className="p-5">Log in to create exams.</div>);
    return (
        <>
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
                <p className="h5">Current pool:</p>
                <TaskListing chosenTasks={pool} tasks={pool} onTaskAction={onTaskAction} />
                <p className="h5">Choose tasks:</p>
                <SearchWithResults chosenTasks={pool} chosenTasksVisibility={false} onTaskAction={onTaskAction} />
            </div>
            <div className="border border-dark border-2" style={{ flexBasis: '50%' }}>
                <iframe title="pdf-preview" ref={iframeRef} className="d-block w-100 h-100"></iframe>
            </div>
        </>
    );
}

export default Exams;
