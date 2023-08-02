// Functions to fetch information about maps/chapters from the database.

import { getDatabase } from "./db";

interface SQLMapSummary {
    id: number;
    name: string;
    num_chapters: number;
}

// List of every map, including some basic information
export async function getMapList(): Promise<SQLMapSummary[]> {
    const db = getDatabase();
    const rows = await db.all<SQLMapSummary[]>(`\
        SELECT
            id,
            name,
            COUNT(celeste_map_chapters.map_id) AS num_chapters
        FROM celeste_maps
            LEFT JOIN celeste_map_chapters 
                ON celeste_map_chapters.map_id = celeste_maps.id
        GROUP BY celeste_maps.id
    `);
    return rows;
}
