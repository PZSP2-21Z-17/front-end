import { ListGroup, Accordion, Button } from "react-bootstrap";
import Task from "../entities/Task";

export type TaskAction = 'add' | 'remove';
export type TaskActionFunc = (action: TaskAction, task: Task) => any;

type TaskListingProps = {
    tasks: Task[];
    chosenTasks?: Task[];
    chosenTasksVisibility?: boolean;
    onTaskAction?: TaskActionFunc;
};

export default function TaskListing(props: TaskListingProps) {
    const chosenTaskIds = props.chosenTasks?.map(e => e.id) ?? [];

    const generateButton = (task: Task) => {
        if (!props.onTaskAction)
            return;
        if (chosenTaskIds.indexOf(task.id!) !== -1)
            return (<Button variant="danger" onClick={() => props.onTaskAction!('remove', task)}>-</Button>);
        return (<Button variant="success" onClick={() => props.onTaskAction!('add', task)}>+</Button>);
    };

    return (
        <Accordion className="mb-3">
            {props.tasks.filter(e => (props.chosenTasksVisibility ?? true) || chosenTaskIds.indexOf(e.id!) === -1)
                .map(task => (
                    <div className="d-flex mb-1" key={task.id}>
                        {generateButton(task)}
                        <Accordion.Item className="flex-grow-1" eventKey={task.id!.toString()}>
                            <Accordion.Header>
                                <span>{task.id}. {task.content}</span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ListGroup>
                                    {task.answers.map(answer => (
                                        <ListGroup.Item key={answer.id}>{answer.content}</ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                    </div>
                ))}
        </Accordion>
    );
}
