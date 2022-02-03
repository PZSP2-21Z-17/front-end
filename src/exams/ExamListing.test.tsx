import { render, screen } from '@testing-library/react';
import Exam from '../entities/Exam';
import ExamListing from './ExamListing';

const examList: Exam[] = [
    {
        exam_id: 1,
        content: 'My title',
        description: 'My preface',
        date_of_exam: new Date(2022, 1, 1),
        groups: [
            { group_nr: 1 }
        ]
    }
];

test('exam shown properly', () => {
    render(<ExamListing exams={examList} />);

    const examTitle = screen.getByText(new RegExp(examList[0].content, 'i'));
    expect(examTitle).toBeInTheDocument();

    const examPreface = screen.queryByText(new RegExp(examList[0].description, 'i'));
    expect(examPreface).not.toBeInTheDocument();

    const examDate = screen.getByText(new RegExp(examList[0].date_of_exam.toLocaleDateString('en-CA'), 'i'));
    expect(examDate).toBeInTheDocument();

    const examGroup = screen.getByText(new RegExp(`Group no. ${examList[0].groups[0].group_nr}`, 'i'));
    expect(examGroup).toBeInTheDocument();
});
