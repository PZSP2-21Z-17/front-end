import { PageSizes, PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { fetchBytes } from '../Common';

import LinuxRegular from './fonts/LinLibertine_R.ttf';

export const generatePdf = async (customText: string, title: string) => {
	const pdfDoc = await PDFDocument.create();
	if (title != null) {
		pdfDoc.setTitle(title);
	}
	pdfDoc.registerFontkit(fontkit);
	const linuxRegularFont = await pdfDoc.embedFont(await fetchBytes(LinuxRegular));

	const page = pdfDoc.addPage(PageSizes.A4);
	const { width, height } = page.getSize();
	const heightFromTop = (units: number, fontSize: number) => height - fontSize - units;

	const fontSize = 24;
	const commonOptions = {
		x: 50,
		maxWidth: width - 100,
		size: fontSize,
		font: linuxRegularFont
	};

	page.drawText(
		'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
		Object.assign(commonOptions, { y: heightFromTop(50, fontSize) })
	);
	page.drawText(
		'ZzAaŻżÓóŁłĆć GgĘęŚśLlĄą JjAaŹźŃń.',
		Object.assign(commonOptions, { y: heightFromTop(100, fontSize) })
	);
	page.drawText(customText, Object.assign(commonOptions, { y: heightFromTop(150, fontSize) }));

	return await pdfDoc.save();
};

export default generatePdf;
