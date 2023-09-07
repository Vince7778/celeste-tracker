// Single map to be displayed in the map list

import "./Map.css";

interface MapProps {
    map: APIMapSummary;
}

export function Map({ map }: MapProps) {
    const gbLink = map.gb_mod_id
        ? `https://gamebanana.com/mods/${map.gb_mod_id}`
        : null;

    const imageElem = map.preview_image_url ? (
        <img
            src={map.preview_image_url}
            className="map-image"
            alt={`Thumbnail for map ${map.name}`}
        />
    ) : null;

    // TODO: redirect to map page
    return (
        <div className="map-container">
            <div>{gbLink ? <a href={gbLink}>{imageElem}</a> : imageElem}</div>
            <div>{gbLink ? <a href={gbLink}>{map.name}</a> : map.name}</div>
            <div>
                {map.num_chapters} chapter{map.num_chapters !== 1 && "s"}
            </div>
        </div>
    );
}
