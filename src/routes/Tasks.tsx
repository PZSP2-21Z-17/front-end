import { useEffect, useState } from "react";
import { Form, Button, ListGroup, Accordion } from "react-bootstrap";
import Answer from "../entities/Answer";
import Task from "../entities/Task";
import FetchAPI from "../FetchAPI";
import ReactSession from "../ReactSession";
import TaskEditor from "../tasks/TaskEditor";

export const Tasks = () => {
    const [taskList, setTaskList] = useState([] as Task[]);
    const [editedTask, setEditedTask] = useState(() => {
        let task = new Task();
        task.answers = new Array(4).fill(undefined).map(() => new Answer());
        return task;
    });

    let isLogged = ReactSession.checkValue('username');

    const handleTaskSubmit = (event: any) => {
        event.preventDefault();
        console.log(editedTask.toJson());
        //if (isLogged) {
            FetchAPI.fetchPost('task/create_with_answers', editedTask.toJson()).then(
                () => {
                    updateTasks();
                }
            )
        //}
    }

    const updateTasks = () => {
        if (isLogged) return;
        FetchAPI.fetchGet('/task/all_with_answers').then((fetchedTasks: any) => {
            setTaskList(fetchedTasks.map((fetchedTask: any) => Task.fromJson(fetchedTask)));
        });
    }

    useEffect(updateTasks, [isLogged]);

    if (isLogged)
        return <p>Log in to create tasks.</p>;

    return <div className="p-5">
        <Accordion className="mb-3">
            {taskList.map(task => (
                <Accordion.Item key={task.id} eventKey={task.id!.toString()}>
                    <Accordion.Header>{task.id}. {task.content}</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {task.answers.map(answer => (
                                <ListGroup.Item key={answer.id}>{answer.id}. {answer.content}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
        
        <Form onSubmit={handleTaskSubmit}>
            <TaskEditor task={editedTask} taskChangeHandler={setEditedTask} />
            <Button className="mb-3" type="submit" variant="primary">
                Submit new task
            </Button>
            <Button onClick={() => {console.log(editedTask)}}></Button>
        </Form>
    </div>;
}

export default Tasks;
