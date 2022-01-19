import { useContext, useState } from 'react';
import { LoginContext } from '../Context';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { ActionMeta, OnChangeValue, StylesConfig } from 'react-select';
import chroma from "chroma-js";
import { Button } from 'react-bootstrap';
import FetchAPI from '../FetchAPI';

type SearchBarProps = {
    isDisabled?: boolean;
    onSubmit?: (submittedOptions: SubmittedOption[]) => any;
};

type FetchedOptionType = 'tag' | 'subject';
type OptionType = FetchedOptionType | 'content';

export type ColoredOption = {
    readonly __isNew__?: boolean;
    readonly type: OptionType;
    readonly value: string;
    readonly label: string;
    readonly isDisabled?: boolean;
};

type FetchedOption = {
    readonly type: FetchedOptionType;
    readonly id: string;
    readonly name: string;
};

export type SubmittedOption = {
    readonly type: OptionType;
    readonly value: string;
};

export function containsAnySubject(optionArr: readonly ColoredOption[] | readonly SubmittedOption[]) {
    return optionArr.filter(e => e.type === 'subject').length > 0;
}

export function containsAnyContent(optionArr: readonly ColoredOption[] | readonly SubmittedOption[]) {
    return optionArr.filter(e => e.type === 'content').length > 0;
}

export default function SearchBar(props: SearchBarProps) {
    const loginState = useContext(LoginContext);
    const [currentValue, setCurrentValue] = useState([] as ColoredOption[]);

    const formatCreateLabel = (inputValue: string) => `Find "${inputValue}" in content...`;

    const optionColors = { tag: '#ff5630', subject: '#5243aa', content: '#5f5f5f' };
    const colorSelectStyles: StylesConfig<ColoredOption, true> = {
        control: (styles) => ({ ...styles, backgroundColor: 'white' }),
        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
            if (!(data.type in optionColors))
                return { ...styles };

            const color = chroma(optionColors[data.type]);
            return {
                ...styles,
                backgroundColor: isDisabled ? undefined :
                    isSelected ? color.css() :
                        isFocused ? color.alpha(0.1).css() : undefined,
                color: isDisabled ? '#ccc' :
                    isSelected ? (chroma.contrast(color, 'white') > 2 ? 'white' : 'black') : color.css(),
                cursor: isDisabled ? 'not-allowed' : 'default',

                ':active': {
                    ...styles[':active'],
                    backgroundColor: !isDisabled ? (isSelected ? color.css() : color.alpha(0.3).css()) : undefined
                }
            };
        },
        multiValue: (styles, { data }) => {
            if (!(data.type in optionColors))
                return { ...styles };

            const color = chroma(optionColors[data.type]);
            return {
                ...styles,
                backgroundColor: color.alpha(0.1).css()
            };
        },
        multiValueLabel: (styles, { data }) => {
            if (!(data.type in optionColors))
                return { ...styles };

            return {
                ...styles,
                color: optionColors[data.type]
            };
        },
        multiValueRemove: (styles, { data }) => {
            if (!(data.type in optionColors))
                return { ...styles };

            return {
                ...styles,
                color: optionColors[data.type],
                ':hover': {
                    backgroundColor: optionColors[data.type],
                    color: 'white'
                }
            };
        },
    };

    const updateHints = async (input: string) => {
        if (!loginState.state.isLogged)
            return [];
        let searchCriteria = {};
        if (!!input)
            searchCriteria = { searchString: input };
        const fetchedTips: FetchedOption[] = await FetchAPI.getTaskSearchTips(searchCriteria);
        return fetchedTips.map(e => ({
            type: e.type,
            value: e.id,
            label: `${e.name} (${e.type})`
        }) as ColoredOption);
    };

    const handleChange = (
        newValue: OnChangeValue<ColoredOption, true>,
        actionMeta: ActionMeta<ColoredOption>
    ) => {
        let newCurrentValue = newValue.filter(e => e.type === 'tag');
        if (actionMeta.action === 'select-option' && actionMeta.option?.type === 'subject')
            newCurrentValue.unshift(actionMeta.option);
        else if (containsAnySubject(currentValue) && containsAnySubject(newValue))
            newCurrentValue.unshift(currentValue[0]);
        if (actionMeta.action === 'create-option')
            newCurrentValue.push({ ...actionMeta.option, type: 'content' });
        else if (containsAnyContent(currentValue) && containsAnyContent(newValue))
            newCurrentValue.push(currentValue[currentValue.length - 1]);
        setCurrentValue(newCurrentValue);
    };

    const handleSubmit = () => {
        if (!props.onSubmit)
            return;
        props.onSubmit(currentValue.map(e => ({ type: e.type, value: e.value })));
    };

    return (
        <div className="d-flex mb-2">
            <AsyncCreatableSelect<ColoredOption, true> isDisabled={props.isDisabled}
                isMulti cacheOptions defaultOptions loadOptions={updateHints} className="me-2 flex-grow-1"
                formatCreateLabel={formatCreateLabel} styles={colorSelectStyles}
                value={currentValue} onChange={handleChange} />
            <Button variant="primary" type="submit" disabled={props.isDisabled} onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
}
