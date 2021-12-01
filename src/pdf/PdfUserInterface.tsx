import React, { FunctionComponent, useState } from 'react';
import download from 'downloadjs';
import generatePdf from './PdfGenerator';
import { nullOf } from '../Common';

type PdfUserInterfaceProps = {
    customText: string;
};

export const PdfUserInterface: FunctionComponent<PdfUserInterfaceProps> = ({customText}) => {
    const [generatedPdf, setGeneratedPdf] = useState(nullOf(new Uint8Array()));
    const [isGenerating, setIsGenerating] = useState(false);

    const onClickDownload = () => download(generatedPdf, 'exam.pdf', 'application/pdf');
    const onClickGenerate = () => {
        setIsGenerating(true);
        generatePdf(customText, 'Egzamin').then((pdf: Uint8Array) => {
            setGeneratedPdf(pdf);
            setIsGenerating(false);
        });
    }

    let downloadButton = null;
    if (generatedPdf) {
        downloadButton = (
            <button onClick={onClickDownload}>
                Download PDF
            </button>
        );
    }

    return <>
        <button onClick={onClickGenerate}>
            Generate PDF
        </button>{' '}
        {isGenerating ? <span>Generating...</span> : downloadButton}
    </>;
}

export default PdfUserInterface;
