// generic non-selectable dropdown component with a label and a list of clickable buttons

import { PropsWithChildren, useState } from "react";
import { DropdownButton } from "./DropdownButton";
import "./Dropdown.css";
import OutsideClickHandler from "react-outside-click-handler";

interface DropdownProps {
    label: string;
    buttons: DropdownButtonSettings[];
}

interface DropdownButtonSettings {
    label: string;
    action: () => void;
    keepOpen?: boolean;
}

export function Dropdown(props: PropsWithChildren<DropdownProps>) {
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(!open);
    const close = () => setOpen(false);

    return (
        <OutsideClickHandler onOutsideClick={close}>
            <div className="dropdown">
                <button
                    className="dropdown-toggle"
                    onClick={toggle}
                    aria-expanded={open}
                >
                    {props.label}
                </button>
                <div className="dropdown-menu-container">
                    <div
                        className={`dropdown-menu`}
                        style={{ display: open ? "block" : "none" }}
                    >
                        {props.buttons.map((button, index) => (
                            <DropdownButton
                                key={index}
                                {...button}
                                parentClose={close}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </OutsideClickHandler>
    );
}
