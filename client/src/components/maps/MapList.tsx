// Component to display the list of maps

import { Map } from "./Map";
import "./MapList.css";

interface MapListProps {
    mapList: APIMapSummary[];
}

export function MapList({ mapList }: MapListProps) {
    // create map elements
    const mapElements = mapList.map((map) => {
        return <Map key={map.id} map={map} />;
    });

    return <div className="map-list-container">{mapElements}</div>;
}
