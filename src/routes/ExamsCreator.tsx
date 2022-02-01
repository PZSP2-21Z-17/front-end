import { useState, useContext } from 'react';
import { Row, Col, Button, Form, FormLabel, FormGroup, FormControl } from 'react-bootstrap';
import { LoginContext } from '../Context';
import Task from '../entities/Task';
import SearchWithResults from '../tasks/SearchWithResults';
import TaskListing, { TaskAction } from '../tasks/TaskListing';
import FetchAPI from '../FetchAPI';
import ExamPreview from '../exams/ExamPreview';
import { useNavigate } from 'react-router-dom';

export const ExamsCreator = () => {
    const loginState = useContext(LoginContext);
    const navigate = useNavigate();
    const [pool, setPool] = useState([] as Task[]);
    const [title, setTitle] = useState('Exam');
    const [groupCount, setGroupCount] = useState(1);
    const [tasksPerGroup, setTasksPerGroup] = useState(5);
    const [preface, setPreface] = useState('');

    const poolIds = pool.map(e => e.id!);

    const taskSorter = (a: Task, b: Task) => a.id! === b.id! ? 0 : a.id! < b.id! ? -1 : 1;

    const onTaskAction = (action: TaskAction, task: Task) => {
        if (action === 'add' && poolIds.indexOf(task.id!) === -1)
            setPool([...pool, task].sort(taskSorter));
        if (action === 'remove' && poolIds.indexOf(task.id!) !== -1)
            setPool(pool.filter(e => e.id! !== task.id!));
    };

    const generateGroups = () => {
        FetchAPI.postExamGenerate({
            content: title,
            description: preface,
            task_ids: poolIds,
            group_count: groupCount,
            tasks_per_exam: tasksPerGroup
        }).then(() => {
            navigate('/exams', { replace: false });
        });
    };

    const isValid = pool.length >= tasksPerGroup;

    if (!loginState.state.isLogged)
        return (<div className="p-5">Log in to create exams.</div>);
    return (
        <>
            <div className="bg-light bg-gradient p-3" style={{ flexBasis: '50%', overflow: 'auto' }}>
                <p className="h2">Exam creation</p>
                <Form className="mb-3">
                    <FormGroup className="mb-1" as={Row} controlId="exam-title">
                        <FormLabel column sm={3}>Title</FormLabel>
                        <Col sm={9}>
                            <FormControl type="text" value={title} onChange={evt => setTitle(evt.target.value)} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" as={Row} controlId="exam-preface">
                        <FormLabel column sm={3}>Preface</FormLabel>
                        <Col sm={9}>
                            <FormControl as="textarea" value={preface} onChange={evt => setPreface(evt.target.value)} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" as={Row} controlId="exam-group-count">
                        <FormLabel column sm={3}>Group count</FormLabel>
                        <Col sm={9}>
                            <FormControl type="number" value={groupCount} onChange={evt => setGroupCount(Number(evt.target.value))} />
                        </Col>
                    </FormGroup>
                    <FormGroup className="mb-1" as={Row} controlId="exam-tasks-per-group">
                        <FormLabel column sm={3}>Tasks per group</FormLabel>
                        <Col sm={9}>
                            <FormControl type="number" value={tasksPerGroup} onChange={evt => setTasksPerGroup(Number(evt.target.value))} />
                        </Col>
                    </FormGroup>
                    <Button variant="primary" onClick={generateGroups} disabled={!isValid}>Generate groups</Button>
                </Form>
                <p className="h5">Current pool:</p>
                <TaskListing chosenTasks={pool} tasks={pool} onTaskAction={onTaskAction} />
                <p className="h5">Choose tasks:</p>
                <SearchWithResults chosenTasks={pool} chosenTasksVisibility={false} onTaskAction={onTaskAction} />
            </div>
            <ExamPreview title={title} preface={preface} tasks={pool} defaultContent="Add some tasks to the pool..." />
        </>
    );
}

export default ExamsCreator;
