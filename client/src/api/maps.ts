// get list of maps from server
export async function getMapList() {
    const res = await fetch("/api/maps/list", {
        method: "POST",
    });
    const mapList = (await res.json()) as APIMapSummary[];
    return mapList;
}
