import { getDatabase } from "./db";

// only publically available user info
interface SQLUserProfile {
    id: number;
    username: string;
    creation_date?: string;
    roles: SQLRoles[];
}

// Get the list of roles a user has
export async function getUserRoles(username: string) {
    const db = getDatabase();
    const rows = await db.all<SQLRoles[]>(
        `SELECT roles.id, roles.name, roles.display_name
        FROM users
            LEFT JOIN user_roles ON user_roles.user_id = users.id
            LEFT JOIN roles ON roles.id = user_roles.role_id
        WHERE users.username = ?`,
        [username],
    );
    return rows;
}

// Gets publically visible user data from the database
export async function getUserProfile(
    username: string,
): Promise<SQLUserProfile | null> {
    const db = getDatabase();
    const userRow: Partial<SQLUserProfile> | undefined = await db.get(
        "SELECT id, username, creation_date FROM users WHERE username = ?",
        [username],
    );
    if (!userRow || !userRow.id || !userRow.username) {
        return null;
    }

    userRow.roles = await getUserRoles(username);

    return userRow as SQLUserProfile;
}
