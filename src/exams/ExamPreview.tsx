import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { indexToLetter } from "../Common";
import Task from "../entities/Task";
import './ExamPreview.css';

type ExamPreviewProps = {
    title?: string;
    preface?: string;
    tasks: Task[];
    defaultContent?: string;
    disableButtons?: boolean;
};

type ExamRendererWindow = Window & {
    isInProgress: {
        get: () => boolean,
        set: (newValue: boolean) => void
    },
    render: (text: string) => Promise<void>,
    save: (filename?: string) => Promise<void>
};

export default function ExamPreview(props: ExamPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [areCorrectAnswersMarked, setAreCorrectAnswersMarked] = useState(false);
    const [isRendering, setIsRendering] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    const isInProgress = isDownloading || isRendering;

    const markdownHeading = props.title ? `# ${props.title.replaceAll('\n', '')}` : '';
    const markdownPreface = props.preface ? props.preface.split('\n').map(e => `> ${e}`).join('    \n') : '';
    const markdownTasks = props.tasks.map((task, qIndex) => {
        const answers = task.answers
            .map((answer, aIndex) => {
                let letter = indexToLetter(aIndex);
                if (areCorrectAnswersMarked && answer.isCorrect)
                    letter = `**(${letter})**`;
                return `    ${letter}. ${answer.content}`;
            }).join('    \n');
        return `${qIndex + 1}. ${task.content}    \n${answers}`;
    });

    const textareaContent = [
        markdownHeading,
        markdownPreface,
        markdownTasks.length ? markdownTasks.join('\n\n') : props.defaultContent ?? ''
    ].join('\n\n');

    const getRendererWindow = () => {
        if (!iframeRef?.current?.contentWindow)
            return null;
        return iframeRef.current.contentWindow as ExamRendererWindow;
    };

    const downloadDocument = () => {
        const saveFunc = getRendererWindow()?.save;
        if (!saveFunc)
            return;
        setIsDownloading(true);
        saveFunc(props.title?.toLowerCase()).then(() => {
            setIsDownloading(false);
        });
    };

    const renderDocument = () => {
        const renderFunc = getRendererWindow()?.render;
        if (!renderFunc)
            return;
        setIsRendering(true);
        renderFunc(textareaContent).then(() => {
            setIsRendering(false);
        });
    };

    useEffect(renderDocument, [iframeRef, textareaContent]);

    const generateDownloadButtonContent = () => {
        if (isInProgress)
            return (<>
                <span className="spinner-border spinner-border-sm"></span>{' '}
                {isDownloading ? 'Downloading...' : 'Rendering...'}
            </>);
        return 'Download PDF';
    };

    const buttonPanel = (
        <div className="d-flex align-items-center button-panel">
            <Form.Check type="switch" label="Show correct" className="me-2" disabled={isInProgress}
                value={areCorrectAnswersMarked.toString()} onChange={evt => setAreCorrectAnswersMarked(evt.target.checked)} />
            <Button variant="primary" onClick={downloadDocument} disabled={isInProgress}>
                {generateDownloadButtonContent()}
            </Button>
        </div>
    );

    return (
        <div className="border border-dark border-2" style={{ flexBasis: '50%' }}>
            {props.disableButtons !== true ? buttonPanel : <></>}
            <iframe className="d-block w-100 h-100" src="/exam_renderer.html" title="Exam renderer"
                ref={iframeRef} onLoad={renderDocument}></iframe>
        </div>
    );
}
