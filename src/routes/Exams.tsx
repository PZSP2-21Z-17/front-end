import { useState, useRef } from 'react';
import TestQuestionList from '../exams/TestQuestionList';
import SelectableQuestion from '../exams/SelectableQuestion';
import { indexToLetter } from '../Common';

export const Exams = () => {
    const questions = TestQuestionList;
    const [questionSelection, setQuestionSelection] = useState(questions.map(() => false));
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
        const iframeDocument = iframeRef.current.contentWindow!.document;
        iframeDocument.write(`
            <script src="https://raw.githack.com/eKoopmans/html2pdf/master/dist/html2pdf.bundle.js"></script>
            <script>window.texme = { style: 'plain' }</script>
            <script src="https://cdn.jsdelivr.net/npm/texme@1.0.0"></script>
            <textarea>
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
            <div className="bg-warning p-3" style={{ flexBasis: "50%", overflow: "auto" }}>
                <p>Hello! This is Exams page.</p>
                {questions.map((question, index) => (
                    <SelectableQuestion key={question.id} question={question} selected={questionSelection[index]}
                        onChangeSelection={onChangeSelection} />
                ))}
                <button onClick={onClickGenerate}>Generate</button>
                <button onClick={onClickDownload}>Download</button>
            </div>
            <div className="border border-dark border-2" style={{ flexBasis: "50%" }}>
                <iframe title="pdf-preview" ref={iframeRef} className="d-block w-100 h-100"></iframe>
            </div>
        </div>
    );
}

export default Exams;
