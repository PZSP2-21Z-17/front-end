import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../Context';
import Task from "../entities/Task";
import FetchAPI, { TaskSearchCriteria } from '../FetchAPI';
import SearchBar, { SubmittedOption, containsAnySubject, containsAnyContent } from "./SearchBar";
import TaskListing, { TaskActionFunc } from "./TaskListing";

type SearchWithResultsProps = {
    chosenTasks?: Task[];
    chosenTasksVisibility?: boolean;
    onTaskAction?: TaskActionFunc;
    allowDeletion?: boolean;
};

export default function SearchWithResults(props: SearchWithResultsProps) {
    const loginState = useContext(LoginContext);
    const [searchResults, setSearchResults] = useState([] as Task[]);

    const { allowDeletion, ...passedProps } = props;

    const updateSearchResults = (options?: SubmittedOption[]) => {
        if (!loginState.state.isLogged)
            return;
        let searchCriteria: TaskSearchCriteria = { tagIds: [] };
        if (options)
            searchCriteria = { tagIds: options.filter(e => e.type === 'tag').map(e => Number(e.value)) };
        if (options && containsAnySubject(options))
            searchCriteria = { ...searchCriteria, subjectCode: options.filter(e => e.type === 'subject')[0].value };
        if (options && containsAnyContent(options))
            searchCriteria = { ...searchCriteria, searchString: options.filter(e => e.type === 'content')[0].value };
        FetchAPI.getTasks(searchCriteria).then((fetchedTasks: any) => {
            setSearchResults(fetchedTasks.map((fetchedTask: any) => Task.fromJson(fetchedTask)));
        });
    }

    useEffect(updateSearchResults, [loginState.state.isLogged]);

    const deleteTask = (taskId: number) => {
        FetchAPI.deleteTask(taskId)
            .then(() => updateSearchResults());
    };

    return (<>
        <SearchBar onSubmit={updateSearchResults} />
        <TaskListing tasks={searchResults} {...passedProps} onClickDelete={allowDeletion ? deleteTask : undefined} />
    </>);
}
