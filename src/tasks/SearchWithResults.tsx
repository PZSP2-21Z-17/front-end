import { useContext, useEffect, useState } from 'react';
import { LoginContext } from '../Context';
import Subject from "../entities/Subject";
import Tag from "../entities/Tag";
import Task from "../entities/Task";
import FetchAPI, { TaskSearchCriteria } from '../FetchAPI';
import SearchBar, { SubmittedOption, containsAnySubject, containsAnyContent } from "./SearchBar";
import TaskListing from "./TaskListing";

type SearchWithResultsProps = {
    tags: Tag[];
    subjects: Subject[];
};

export default function SearchWithResults(props: SearchWithResultsProps) {
    const loginState = useContext(LoginContext);
    const [searchResults, setSearchResults] = useState([] as Task[]);

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

    return (<>
        <SearchBar onSubmit={updateSearchResults} />
        <TaskListing tasks={searchResults} />
    </>);
}
