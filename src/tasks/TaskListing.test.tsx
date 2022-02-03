import { render, screen } from '@testing-library/react';
import Task from '../entities/Task';
import TaskListing from './TaskListing';

const taskList: Task[] = [
    {
        id: 1,
        content: 'My task content',
        answers: [
            { id: 1, content: 'My answer', isCorrect: true, toJson: (() => {}) as any }
        ],
        tags: [
            { tag_id: 1, name: 'My tag', in_use: true, toJSON: (() => {}) as any }
        ],
        subject_code: 'My subject code',
        is_visible: 'y',
        in_use: false,
        toJson: (() => {}) as any
    }
];

test('exam shown properly', () => {
    render(<TaskListing tasks={taskList} />);

    const examTitle = screen.getByText(new RegExp(taskList[0].content, 'i'));
    expect(examTitle).toBeInTheDocument();

    const examPreface = screen.getByText(new RegExp(taskList[0].answers[0].content, 'i'));
    expect(examPreface).toBeInTheDocument();
});
