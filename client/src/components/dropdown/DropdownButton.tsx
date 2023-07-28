// button part of a dropdown, with a label and a callback action

import "./Dropdown.css";

export interface DropdownButtonProps {
    label: string;
    action: () => void;
    keepOpen?: boolean;
    parentClose: () => void;
}

export function DropdownButton(props: DropdownButtonProps) {
    function handleClick() {
        props.action();

        if (!props.keepOpen) {
            props.parentClose();
        }
    }

    return (
        <button className="dropdown-button" onClick={handleClick}>
            {props.label}
        </button>
    );
}
