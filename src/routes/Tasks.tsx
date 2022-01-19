import { useEffect, useState, useContext } from "react";
import { LoginContext } from '../Context';
import Answer from "../entities/Answer";
import Task from "../entities/Task";
import FetchAPI from "../FetchAPI";
import Tag from "../entities/Tag";
import Subject from "../entities/Subject";
import TaskAdder from "../tasks/TaskAdder";
import SearchWithResults from "../tasks/SearchWithResults";

export default function Tasks() {
    const loginState = useContext(LoginContext);
    const [tagList, setTagList] = useState([] as Tag[]);
    const [subjectList, setSubjectList] = useState([] as Subject[]);

    useEffect(() => {
        FetchAPI.getTags()
            .then((jsonArray: []) => setTagList(jsonArray.map(json => Tag.fromJSON(json))));
        FetchAPI.getSubjects()
            .then((jsonArray: []) => setSubjectList(jsonArray.map(json => Subject.fromJSON(json))));
    }, [loginState.state.isLogged]);

    const handleTaskSubmit = (addedTask: Task) => {
        if (!loginState.state.isLogged)
            return;
        let task = new Task(undefined, addedTask.content, addedTask.answers
            .map(a => new Answer(undefined, a.content, a.isCorrect)));
        FetchAPI.postTaskCreate(task).then(
            () => {
                alert('Added successfully');
            }
        );
    }

    if (!loginState.state.isLogged)
        return <p>Log in to create tasks.</p>;

    return <>
        <SearchWithResults tags={tagList} subjects={subjectList} />
        <TaskAdder onSubmit={handleTaskSubmit} />
    </>;
}
