import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { indexToLetter } from "../Common";
import Task from "../entities/Task";

type ExamPreviewProps = {
    title: string;
    preface: string;
    tasks: Task[];
    defaultContent?: string;
};

export default function ExamPreview(props: ExamPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isInProgress, setIsInProgress] = useState(true);

    const generateDocument = () => {
        if (iframeRef.current == null) return;
        setIsInProgress(true);
        const flattenedTasks = props.tasks
            .map((task, qIndex) => {
                const answers = task.answers
                    .map((answer, aIndex) => `    ${indexToLetter(aIndex)}. ${answer.content}`)
                    .join('    \n');
                return `${qIndex + 1}. ${task.content}    \n${answers}`;
            })
            .join('\n\n');
        const quotedPreface = props.preface ? props.preface.split('\n').map(e => `> ${e}`).join('    \n') : '';
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
# ${props.title.replaceAll('\n', '')}

${quotedPreface}

${flattenedTasks.length ? flattenedTasks : props.defaultContent}
            </textarea>
            <img id="loader" src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif">
        `);
        iframeDocument.close();
        setTimeout(() => setIsInProgress(false), 500);  // TODO: user a proper debounce function
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

    useEffect(generateDocument, [props]);

    return (
        <div className="border border-dark border-2" style={{ flexBasis: '50%' }}>
            <Button variant="primary" style={{ position: 'fixed', right: '1.5em', bottom: '0.5em' }}
                onClick={downloadDocument} disabled={isInProgress}>
                Download PDF
            </Button>
            <iframe title="pdf-preview" ref={iframeRef} className="d-block w-100 h-100"></iframe>
        </div>
    );
}
