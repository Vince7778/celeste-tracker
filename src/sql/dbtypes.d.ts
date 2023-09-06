interface SQLAccounts {
    id: number;
    hashed_password: Uint8Array?;
    salt: Uint8Array?;
}

interface SQLUsers {
    id: number;
    username: string;
    creation_date?: string;
}

interface SQLRoles {
    id: number;
    name: string;
    display_name?: string;
}

interface SQLMapData {
    name: string;
    gb_mod_id?: string;
    last_updated: string;
    preview_image_url?: string;
}

interface SQLMapSummary {
    id: number;
    name: string;
    num_chapters: number;
    gb_mod_id?: string;
    preview_image_url?: string;
}
