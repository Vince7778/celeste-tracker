// Functions to fetch information about maps/chapters from the database.

import { getDatabase } from "./db";

// List of every map, including some basic information
export async function getMapList(): Promise<SQLMapSummary[]> {
    const db = getDatabase();
    const rows = await db.all<SQLMapSummary[]>(`\
        SELECT
            celeste_maps.id,
            celeste_maps.name,
            celeste_maps.gb_mod_id,
            celeste_maps.preview_image_url,
            COUNT(celeste_map_chapters.map_id) AS num_chapters
        FROM celeste_maps
            LEFT JOIN celeste_map_chapters 
                ON celeste_map_chapters.map_id = celeste_maps.id
        GROUP BY celeste_maps.id
    `);
    return rows;
}

// Add a map to the database
export async function addMap(mapData: SQLMapData) {
    const db = getDatabase();
    await db.run(
        `INSERT INTO celeste_maps(name, gb_mod_id, last_updated, preview_image_url) VALUES (?, ?, ?, ?)`,
        [
            mapData.name,
            mapData.gb_mod_id,
            mapData.last_updated,
            mapData.preview_image_url,
        ],
    );
}
