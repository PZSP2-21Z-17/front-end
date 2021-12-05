import { useState, useRef } from 'react';
import TestQuestionList from '../exams/TestQuestionList';
import SelectableQuestion from '../exams/SelectableQuestion';
import { indexToLetter } from '../Common';

export const Exams = () => {
    const questions = TestQuestionList;
    const [questionSelection, setQuestionSelection] = useState(questions.map(() => true));
    const [title, setTitle] = useState('Exam');
    const [variantCount, setVariantCount] = useState(1);
    const [preface, setPreface] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const onClickGenerate = () => {
        if (iframeRef.current == null) return;
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
            <textarea>
# ${title}

${quotedPreface}

${flattenedQuestions}
            </textarea>
        `);
        iframeDocument.close();
    };

    const onClickDownload = () => {
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

    return (
        <div className="d-flex h-100">
            <div className="bg-warning p-3" style={{ flexBasis: '50%', overflow: 'auto' }}>
                <p className="h2">Exam creation</p>
                <table className="w-100">
                <tbody>
                    <tr>
                        <td><label htmlFor="exam-title">Title</label></td>
                        <td><input id="exam-title" className="w-100" type="text"
                            value={title} onChange={evt => setTitle(evt.target.value)} /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="exam-variant-count">Variant count</label></td>
                        <td><input id="exam-variant-count" className="w-100" type="number" min="1"
                            value={variantCount} onChange={evt => setVariantCount(Number(evt.target.value))} /></td>
                    </tr>
                    <tr>
                        <td><label htmlFor="exam-preface">Preface</label></td>
                        <td><textarea id="exam-preface" className="w-100"
                            value={preface} onChange={evt => setPreface(evt.target.value)} /></td>
                    </tr>
                </tbody>
                </table>
                <div style={{ maxHeight: '100vh', overflow: 'auto' }}>
                    {questions.map((question, index) => (
                        <SelectableQuestion key={question.id} question={question} selected={questionSelection[index]}
                            onChangeSelection={onChangeSelection} />
                    ))}
                </div>
                <button onClick={onClickGenerate}>Generate</button>
                <button onClick={onClickDownload}>Download</button>
            </div>
            <div className="border border-dark border-2" style={{ flexBasis: '50%' }}>
                <iframe title="pdf-preview" ref={iframeRef} className="d-block w-100 h-100"></iframe>
            </div>
        </div>
    );
}

export default Exams;
