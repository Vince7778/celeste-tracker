// Route that displays all the maps

import { useContext } from "react";
import { AddMapWidget } from "../../components/AddMapWidget";
import { UserContext } from "../../userContext";
import { MapList } from "../../components/maps/MapList";

export function Maps() {
    const userInfo = useContext(UserContext).userInfo;

    // only show add map widget if user is logged in
    let addMapWidget = null;
    if (userInfo?.loggedIn) {
        addMapWidget = <AddMapWidget />;
    }

    return (
        <div>
            <h1>Maps</h1>
            {addMapWidget}
            <MapList />
        </div>
    );
}
