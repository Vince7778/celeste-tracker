import { getDatabase } from "./db";

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

    return userRow as SQLUserProfile;
}
