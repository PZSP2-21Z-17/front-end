import { useState } from "react";
import { ListGroup, Accordion } from "react-bootstrap";
import Exam from "../entities/Exam";

type ExamListingProps = {
    exams: Exam[];
    onGroupClick?: (examId: number, groupNo: number) => any;
};

export default function ExamListing(props: ExamListingProps) {
    const [chosenExamId, setChosenExamId] = useState<number | undefined>(undefined);
    const [chosenGroupNo, setChosenGroupNo] = useState<number | undefined>(undefined);

    const handleClick = (examId: number, groupNo: number) => {
        setChosenExamId(examId);
        setChosenGroupNo(groupNo);
        if (!props.onGroupClick)
            return;
        props.onGroupClick(examId, groupNo);
    };

    const isSelected = (examId: number, groupNo: number) => examId === chosenExamId && groupNo === chosenGroupNo;

    return (
        <Accordion className="mb-3">
            {props.exams.map(exam => (
                <Accordion.Item className="flex-grow-1" key={exam.exam_id!} eventKey={exam.exam_id!.toString()}>
                    <Accordion.Header>
                        <span>{exam.content} ({new Date(exam.date_of_exam).toLocaleDateString('en-CA')})</span>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {exam.groups.map(group => (
                                <ListGroup.Item key={group.group_nr}  style={{ cursor: 'pointer' }}
                                    onClick={() => handleClick(exam.exam_id!, group.group_nr)}
                                    className={isSelected(exam.exam_id!, group.group_nr) ? 'bg-primary bg-opacity-25' : ''}>
                                    Group no. {group.group_nr}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
