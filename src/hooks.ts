import { useEffect, useState } from "preact/hooks";
import { addDetails, compareSuggestedAndExistingLinks } from "./utils";

interface LinkWithFullInfo {
    source: {
        id: string,
        name: string,
    },
    target: {
        id: string,
        name: string,
    }
}

interface SuggestedLinks {
    linksToAdd: LinkWithFullInfo[],
    linksToUpdate: LinkWithFullInfo[],
    linksToRemove: LinkWithFullInfo[],
}

interface Link {
    sourceId: string,
    targetId: string,
}

export interface Source {
    // TODO: Add potential source element specification
    id: string,
    name: string,
    characters: string,
    color: {
        r: number,
        g: number,
        b: number,
    },
    parentId: string,
}

export interface Target {
    // TODO: Add potential target page specification
    id: string,
    name: string,
    topics: string[],
}

export function useLinks(sources: Source[], targets: Target[], existingLinks: Link[]) {
    const [status, setStatus] = useState("idle");
    const [links, setLinks] = useState<SuggestedLinks | null>(null);
    useEffect(() => {
        const fetchLinks = async () => {
            setStatus("fetching");
            const response = await fetch(
                "http://127.0.0.1:5000/links",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sources, targets })
                }
            );
            if (!response.ok) {
                setStatus("error");
                throw new Error("Failed to fetch links");
            }
            const { links } = await response.json();
            const linksWithDetails = addDetails(links, sources, targets);
            const suggestedLinks = compareSuggestedAndExistingLinks(linksWithDetails, existingLinks, sources, targets);
            setLinks(suggestedLinks);
            setStatus("success");
        }
        fetchLinks();
    }, []);
    return {links, status};
}