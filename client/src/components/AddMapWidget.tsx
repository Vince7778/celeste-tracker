// Widget that allows a user to add a map.

import { useState } from "react";
import { HTMLForm } from "./HTMLForm";
import "./AddMapWidget.css";

// onAddMap: callback when a map is successfully added
interface AddMapWidgetProps {
    onAddMap?: () => void;
}

export function AddMapWidget({ onAddMap }: AddMapWidgetProps) {
    // TODO: Automatically fetch information from GameBanana
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [didSucceed, setDidSucceed] = useState(false);

    function onError({ error }: { error: string }) {
        setErrorMessage(error);
    }

    function onSuccess() {
        setDidSucceed(true);
        onAddMap?.();
    }

    const errorDiv = errorMessage ? (
        <div className="error-div">{errorMessage}</div>
    ) : null;
    const successDiv = didSucceed ? (
        <div className="success-div">Map added successfully!</div>
    ) : null;

    function beforeSubmit() {
        setErrorMessage(null);
        setDidSucceed(false);
    }

    return (
        <>
            <HTMLForm
                action="/api/maps/add"
                method="post"
                onError={onError}
                onSuccess={onSuccess}
                beforeSubmit={beforeSubmit}
            >
                <section>
                    <label htmlFor="gblink">
                        <a href="https://gamebanana.com/games/6460">
                            GameBanana
                        </a>{" "}
                        Link
                    </label>
                    <input id="gblink" type="text" name="gblink" required />
                </section>
                <button type="submit">Add Map</button>
            </HTMLForm>
            {errorDiv}
            {successDiv}
        </>
    );
}
