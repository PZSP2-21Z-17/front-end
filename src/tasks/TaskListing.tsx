import { ListGroup, Accordion, Button } from "react-bootstrap";
import Answer from "../entities/Answer";
import Task from "../entities/Task";

export type TaskAction = 'add' | 'remove';
export type TaskActionFunc = (action: TaskAction, task: Task) => any;

type TaskListingProps = {
    tasks: Task[];
    chosenTasks?: Task[];
    chosenTasksVisibility?: boolean;
    onTaskAction?: TaskActionFunc;
    onClickDelete?: (taskId: number) => any;
};

export default function TaskListing(props: TaskListingProps) {
    const chosenTaskIds = props.chosenTasks?.map(e => e.id) ?? [];

    const generateActionButton = (task: Task) => {
        if (!props.onTaskAction)
            return;
        if (chosenTaskIds.indexOf(task.id!) !== -1)
            return (<Button variant="danger" onClick={() => props.onTaskAction!('remove', task)}>-</Button>);
        return (<Button variant="success" onClick={() => props.onTaskAction!('add', task)}>+</Button>);
    };

    const generateDeleteButton = (task: Task) => {
        if (!props.onClickDelete || task.in_use)
            return;
        return (<Button variant="danger" onClick={() => props.onClickDelete!(task.id!)}>X</Button>);
    };

    const generateAnswer = (answer: Answer) => {
        return (
            <ListGroup.Item key={answer.id} className={ answer.isCorrect ? 'fw-bold bg-success bg-opacity-10' : '' }>
                {answer.content}
            </ListGroup.Item>
        );
    }

    return (
        <Accordion className="mb-3">
            {props.tasks.filter(e => (props.chosenTasksVisibility ?? true) || chosenTaskIds.indexOf(e.id!) === -1)
                .map(task => (
                    <div className="d-flex mb-1" key={task.id}>
                        {generateActionButton(task)}
                        <Accordion.Item className="flex-grow-1" eventKey={task.id!.toString()}>
                            <Accordion.Header>
                                <span style={{ wordBreak: 'break-word', userSelect: 'text', cursor: 'text', display: 'contents' }}
                                    onClick={evt => evt.stopPropagation()}>
                                    {task.id}. {task.content}
                                </span>
                            </Accordion.Header>
                            <Accordion.Body className="p-0">
                                <ListGroup variant="flush">
                                    {task.answers.map(answer => generateAnswer(answer))}
                                </ListGroup>
                            </Accordion.Body>
                        </Accordion.Item>
                        {generateDeleteButton(task)}
                    </div>
                ))}
        </Accordion>
    );
}
