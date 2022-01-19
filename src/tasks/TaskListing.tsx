import { ListGroup, Accordion } from "react-bootstrap";
import Task from "../entities/Task";

type TaskListingProps = {
    tasks: Task[];
};

export default function TaskListing(props: TaskListingProps) {
    return (
        <Accordion className="mb-3">
            {props.tasks.map(task => (
                <Accordion.Item key={task.id} eventKey={task.id!.toString()}>
                    <Accordion.Header>{task.id}. {task.content}</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                            {task.answers.map(answer => (
                                <ListGroup.Item key={answer.id}>{answer.content}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            ))}
        </Accordion>
    );
}
