import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../Context";
import Task, { FetchedTask } from "../entities/Task";
import ExamPreview from "../exams/ExamPreview";
import FetchAPI from "../FetchAPI";
import Exam from "../entities/Exam";
import ExamListing from "../exams/ExamListing";
import { gSortPred } from "../Common";

type ExamGroup = {
    task_affs: {
        nr_on_sheet: number,
        tasks: FetchedTask
    }[];
};

export default function ExamBrowser() {
    const loginState = useContext(LoginContext);
    const [examList, setExamList] = useState([] as Exam[]);
    const [title, setTitle] = useState('');
    const [preface, setPreface] = useState('');
    const [taskList, setTaskList] = useState([] as Task[]);

    useEffect(() => {
        FetchAPI.getExams()
            .then((data: Exam[]) => setExamList(data));
    }, [loginState.state.isLogged]);

    const updateGroupPreview = (examId: number, groupNo: number) => {
        FetchAPI.getExamGroup(examId, groupNo)
            .then((data: ExamGroup) => {
                const soughtExam = examList.filter(e => e.exam_id === examId)[0];
                setTitle(soughtExam.content);
                setPreface(soughtExam.description);
                setTaskList(data.task_affs.sort((a, b) => gSortPred(a, b, 'nr_on_sheet'))
                    .map(e => Task.fromJson(e.tasks)));
            });
    };

    if (!loginState.state.isLogged)
        return (<div className="p-5">Log in to create exams.</div>);
    return (
        <>
            <div className="bg-light bg-gradient p-3" style={{ flexBasis: '50%', overflow: 'auto' }}>
                <p className="h2">Exam browsing</p>
                <ExamListing exams={examList} onGroupClick={updateGroupPreview} />
            </div>
            <ExamPreview title={title} preface={preface} tasks={taskList} defaultContent="Choose an exam group for preview." />
        </>
    );
}
