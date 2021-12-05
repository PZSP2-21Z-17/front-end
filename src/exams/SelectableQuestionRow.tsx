import { FunctionComponent, ChangeEvent } from 'react';
import Question from '../questions/Question';

export type SelectableQuestionRowProps = {
    selected: boolean;
    onChangeSelection: (questionId: number, selected: boolean) => void;
    question: Question;
};

export const SelectableQuestionRow: FunctionComponent<SelectableQuestionRowProps> = (props: SelectableQuestionRowProps) => {
    const changeListener = (evt: ChangeEvent<HTMLInputElement>) => {
        props.onChangeSelection(props.question.id, evt.target.checked);
    };

    return (
        <tr>
            <td className="border-end" style={{ textAlign: "center", verticalAlign: "middle"}}>
                <input type="checkbox" checked={props.selected} onChange={changeListener} />
            </td>
            <td>
                <p>{props.question.id}. {props.question.contents}</p>
                <ol>
                    {props.question.answers.map(answer => (<li key={answer.id}>{answer.content}</li>))}
                </ol>
            </td>
        </tr>
    );
}

export default SelectableQuestionRow;
