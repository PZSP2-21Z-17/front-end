import { FunctionComponent, ChangeEvent } from 'react';
import Task from '../entities/Task';

export type SelectableTaskRowProps = {
    selected: boolean;
    onChangeSelection: (taskId: number, selected: boolean) => void;
    task: Task;
};

export const SelectableTaskRow: FunctionComponent<SelectableTaskRowProps> = (props: SelectableTaskRowProps) => {
    const changeListener = (evt: ChangeEvent<HTMLInputElement>) => {
        props.onChangeSelection(props.task.id!, evt.target.checked);
    };

    return (
        <tr>
            <td className="border-end" style={{ textAlign: "center", verticalAlign: "middle"}}>
                <input type="checkbox" checked={props.selected} onChange={changeListener} />
            </td>
            <td>
                <p>{props.task.id}. {props.task.content}</p>
                <ol>
                    {props.task.answers.map(answer => (<li key={answer.id}>{answer.content}</li>))}
                </ol>
            </td>
        </tr>
    );
}

export default SelectableTaskRow;
