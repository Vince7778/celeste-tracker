interface MapDataError {
    success: false;
    error: string;
}

interface MapDataSuccess {
    success: true;
    data: {
        name: string;
        previewImageURL: string;
    };
}

type MapData = MapDataError | MapDataSuccess;

const apiFields = [
    "name",
    "Game().name",
    "Category().name",
    "Preview().sSubFeedImageUrl()",
].join(",");

const categoryTypes = [
    "Maps",
    "Campaign",
    "Collab/Contest",
    "Multiplayer",
    "Standalone",
];

export async function getMapData(id: string): Promise<MapData> {
    const url = `https://api.gamebanana.com/Core/Item/Data?itemtype=Mod&itemid=${id}&fields=${apiFields}&return_keys=1`;
    const resp = await fetch(url);
    const data = await resp.json();

    function createError(msg: string): MapDataError {
        return {
            success: false,
            error: msg,
        };
    }

    if (data.error) {
        if (data.error_code === "INVALID_PARAMS") {
            return createError("Invalid mod ID");
        }
        // unknown error type
        throw new Error(data.error);
    }

    if (data["Game().name"] !== "Celeste") {
        return createError("Mod is not for Celeste");
    }

    if (!categoryTypes.includes(data["Category().name"])) {
        return createError("Mod is not in a valid category");
    }

    return {
        success: true,
        data: {
            name: data.name,
            previewImageURL: data["Preview().sSubFeedImageUrl()"],
        },
    };
}
