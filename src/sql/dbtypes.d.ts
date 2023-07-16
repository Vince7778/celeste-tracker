interface SQLAccounts {
    id: number;
    hashed_password: Uint8Array?;
    salt: Uint8Array?;
}

interface SQLUsers {
    id: number;
    username: string;
    creation_date: string?;
}
