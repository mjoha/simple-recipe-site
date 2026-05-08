import type { IndexData } from "./types.js";

export async function fetchIndex(): Promise<IndexData> {
    const response = await fetch("./data/index.json");

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<IndexData>;
}
