import React, { FC } from "react";
import Trigger from "rc-trigger";
import styled from "styled-components";
import { ArrowDown } from "../../../lib/Icons";

type DropdownProps = {
    options?: any[];
    value: string;
    onChange?: (e?) => void;
    withArrow?: boolean;
    disabled?: boolean;
};

const Dropdown = ({ options, onChange }) => {
    return (
        <StyledDropdown>
            {options.map(x => (
                <li onClick={() => onChange(x)} key={x.id}>
                    {x.name}
                </li>
            ))}
        </StyledDropdown>
    );
};
const Input: FC<DropdownProps> = ({ options, value, onChange, withArrow, disabled }) => {
    if (!options?.length)
        return (
            <StyledInput>
                {withArrow && <ArrowDown size={21} />}
                <input disabled onChange={e => console.log(e)} value={value} />
            </StyledInput>
        );
    return (
        <Trigger
            action={["click", "focus"]}
            popup={<Dropdown options={options} onChange={onChange} />}
            mask={false}
            stretch="width"
            destroyPopupOnHide
            popupAlign={{
                points: ["t", "b"],
                offset: [0, 3]
            }}
        >
            <StyledInput>
                {withArrow && <ArrowDown size={21} />}
                <input onChange={e => console.log(e)} value={value} />
            </StyledInput>
        </Trigger>
    );
};

const StyledInput = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 54px;

    input {
        height: 100%;
        width: 100%;
        border-radius: 4px;
        border: 1px solid ${props => props.theme.D40};
        font-size: 14px;
        margin: 0;
        padding: 0 18px;
        background: ${props => props.theme.D80};
        color: ${props => props.theme.D10};

        &:hover {
            border: 1px solid ${props => props.theme.D30};
        }

        &:focus {
            border: 1px solid ${props => props.theme.D10};
            outline: none;
        }
    }
    svg {
        position: absolute;
        right: 12px;
        pointer-events: none;
        fill: ${props => props.theme.D10};
    }
`;
const StyledDropdown = styled.ul`
    max-height: 200px;
    overflow: scroll;
    box-shadow: rgba(0, 0, 0, 0.0470588) 0px 0px 0px 1px, rgba(0, 0, 0, 0.0784314) 0px 4px 8px,
        rgba(0, 0, 0, 0.0784314) 0px 2px 4px;
    list-style: none;
    padding: 6px 0;
    margin: 0;
    border-radius: 4px;
    background: ${props => props.theme.D50};
    li {
        height: 36px;
        padding: 0 12px;
        line-height: 36px;
        white-space: nowrap;
        display: block;
        text-overflow: ellipsis;
        overflow-x: hidden;
        font-size: 14px;
        color: ${props => props.theme.D10};
        &:hover {
            cursor: pointer;
            background: ${props => props.theme.D70};
        }
    }
`;

export default Input;
