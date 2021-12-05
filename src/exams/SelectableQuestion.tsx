import { FunctionComponent, ChangeEvent } from 'react';
import Question from '../questions/Question';

export type SelectableQuestionProps = {
    selected: boolean;
    onChangeSelection: (questionId: number, selected: boolean) => void;
    question: Question;
};

export const SelectableQuestion: FunctionComponent<SelectableQuestionProps> = (props: SelectableQuestionProps) => {
    const changeListener = (evt: ChangeEvent<HTMLInputElement>) => {
        props.onChangeSelection(props.question.id, evt.target.checked);
    };
    return (
        <>
        <div className="w-100 d-flex">
            <div className="pe-2">
                <input className="h-100" type="checkbox" checked={props.selected} onChange={changeListener} />
            </div>
            <div>
                <p>{props.question.id}. {props.question.contents}</p>
                <ol>
                    {props.question.answers.map(answer => (<li key={answer.id}>{answer.content}</li>))}
                </ol>
            </div>
        </div>
        </>
    );
}

export default SelectableQuestion;
