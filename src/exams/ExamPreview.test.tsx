import { render, screen } from '@testing-library/react';
import ExamPreview from './ExamPreview';

test('buttons visible by default', () => {
    render(<ExamPreview tasks={[]} />);

    const correctSwitch = screen.getByText(/show correct/i);
    expect(correctSwitch).toBeInTheDocument();

    const downloadButton = screen.getByText(/download pdf/i);
    expect(downloadButton).toBeInTheDocument();
});

test('buttons not visible when disabled', () => {
    render(<ExamPreview tasks={[]} disableButtons />);

    const correctSwitch = screen.queryByText(/show correct/i);
    expect(correctSwitch).toBeNull();

    const downloadButton = screen.queryByText(/download pdf/i);
    expect(downloadButton).toBeNull();
});
