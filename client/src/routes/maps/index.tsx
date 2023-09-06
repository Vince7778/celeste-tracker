// Route that displays all the maps

import { useContext, useEffect, useState } from "react";
import { AddMapWidget } from "../../components/AddMapWidget";
import { UserContext } from "../../userContext";
import { MapList } from "../../components/maps/MapList";
import { getMapList } from "../../api/maps";

export function Maps() {
    const userInfo = useContext(UserContext).userInfo;

    const [mapList, setMapList] = useState<APIMapSummary[]>([]);

    // fetch map list from server
    useEffect(() => {
        async function fetchMapList() {
            const mapList = await getMapList();
            setMapList(mapList);
        }
        fetchMapList();
    }, []);

    async function refreshMaps() {
        const mapList = await getMapList();
        setMapList(mapList);
    }

    // only show add map widget if user is logged in
    let addMapWidget = null;
    if (userInfo?.loggedIn) {
        addMapWidget = <AddMapWidget onAddMap={refreshMaps} />;
    }

    return (
        <div>
            <h1>Maps</h1>
            {addMapWidget}
            <MapList mapList={mapList} />
        </div>
    );
}
