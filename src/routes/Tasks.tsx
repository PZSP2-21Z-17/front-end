import { useContext } from "react";
import { LoginContext } from '../Context';
import Answer from "../entities/Answer";
import Task from "../entities/Task";
import FetchAPI from "../FetchAPI";
import TaskAdder from "../tasks/TaskAdder";
import SearchWithResults from "../tasks/SearchWithResults";

export default function Tasks() {
    const loginState = useContext(LoginContext);

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
        <SearchWithResults />
        <TaskAdder onSubmit={handleTaskSubmit} />
    </>;
}
