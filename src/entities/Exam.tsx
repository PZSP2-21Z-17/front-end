type Exam = {
    exam_id: number;
    date_of_exam: Date;
    content: string;
    description: string;
    groups: { group_nr: number }[];
};

export default Exam;
