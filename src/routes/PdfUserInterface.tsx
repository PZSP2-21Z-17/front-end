import { FunctionComponent, useState } from 'react';
import download from 'downloadjs';
import generatePdf from '../pdf/PdfGenerator';
import { nullOf } from '../Common';
import Button from 'react-bootstrap/Button';

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
            <Button variant="primary" className="mr-1" onClick={onClickDownload}>
                Download PDF
            </Button>
        );
    }

    return <>
        <p>Custom text: <pre>{customText}</pre></p>
        <Button variant="secondary" className="mr-1" onClick={onClickGenerate}>
            Generate PDF
        </Button>
        {isGenerating ? <span>Generating...</span> : downloadButton}
    </>;
}

export default PdfUserInterface;
