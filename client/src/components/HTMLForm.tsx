// HTML <form> wrapper that handles submission better.

// action, method, style: as in the HTML form element
// onSuccess: callback for when the form is successfully submitted
// onError: callback for when the form submission fails
// ignoreResponseData: if true, the onSuccess and onError callbacks will be called without any data
// beforeSubmit: callback for before the form is submitted
interface HTMLFormProps {
    action: string;
    method: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    onSuccess?: (data?: any) => void;
    onError?: (data?: any) => void;
    beforeSubmit?: () => void;
    ignoreResponseData?: boolean;
}

export function HTMLForm(props: HTMLFormProps) {
    async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        props.beforeSubmit?.();

        const form = e.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        // this may fail if the form contains a file input
        const myParams = new URLSearchParams(formData as any);

        const res = await fetch(form.action, {
            method: form.method,
            body: myParams,
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
            },
        });

        if (props.ignoreResponseData) {
            if (res.ok) {
                props.onSuccess?.();
            } else {
                props.onError?.();
            }
        } else {
            const json = await res.json();
            if (res.ok) {
                props.onSuccess?.(json);
            } else {
                props.onError?.(json);
            }
        }
    }

    return (
        <form
            action={props.action}
            method={props.method}
            onSubmit={submitHandler}
            style={props.style}
        >
            {props.children}
        </form>
    );
}
