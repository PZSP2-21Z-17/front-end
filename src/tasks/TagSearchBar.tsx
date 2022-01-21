import { useContext, useState } from 'react';
import { LoginContext } from '../Context';
import AsyncSelect from 'react-select/async';
import { OnChangeValue, StylesConfig } from 'react-select';
import chroma from "chroma-js";
import { Button } from 'react-bootstrap';
import FetchAPI from '../FetchAPI';

import Tag from '../entities/Tag';

type TagSearchBarProps = {
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
    readonly name: string;
};

export type SubmittedOption = {
    readonly tag_id: number;
    readonly name: string;
};

export default function TagSearchBar(props: TagSearchBarProps) {
    const loginState = useContext(LoginContext);
    const [currentValue, setCurrentValue] = useState([] as ColoredOption[]);

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
        const fetchedTips: Tag[] = await FetchAPI.getFindTags(input);
        return fetchedTips.map((e: Tag) => ({
            type: 'tag',
            value: e.tag_id.toString(),
            label: `${e.name} (tag)`,
            name: e.name
        }) as ColoredOption);
    };

    const handleChange = (
        newValue: OnChangeValue<ColoredOption, true>,
    ) => {
        setCurrentValue([...newValue]);
    };

    const handleSubmit = () => {
        if (!props.onSubmit)
            return;
        props.onSubmit(currentValue.map(e => (new Tag(parseInt(e.value), e.name, true))));
    };

    return (
        <div className="d-flex mb-2">
            <AsyncSelect<ColoredOption, true> isDisabled={props.isDisabled}
                isMulti defaultOptions loadOptions={updateHints} className="me-2 flex-grow-1"
                styles={colorSelectStyles} value={currentValue} onChange={handleChange} />
            <Button variant="primary" type="submit" disabled={props.isDisabled} onClick={handleSubmit}>
                Submit
            </Button>
        </div>
    );
}
