// Component to display the list of maps

import { useEffect, useState } from "react";
import { getMapList } from "../../api/maps";
import { Map } from "./Map";
import "./MapList.css";

export function MapList() {
    const [mapList, setMapList] = useState<APIMapSummary[]>([]);

    // fetch map list from server
    useEffect(() => {
        async function fetchMapList() {
            const mapList = await getMapList();
            setMapList(mapList);
        }
        fetchMapList();
    }, []);

    // create map elements
    const mapElements = mapList.map((map) => {
        return <Map key={map.id} map={map} />;
    });

    return <div className="map-list-container">{mapElements}</div>;
}
