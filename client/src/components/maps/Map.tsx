// Single map to be displayed in the map list

import "./Map.css";

interface MapProps {
    map: APIMapSummary;
}

export function Map({ map }: MapProps) {
    const gbLink = `https://gamebanana.com/mods/${map.gb_mod_id}`;

    // TODO: redirect to map page
    return (
        <div className="map-container">
            <a href={gbLink}>{map.name}</a>
            <div>{map.num_chapters} chapters</div>
        </div>
    );
}
