import { useEffect, useState } from "preact/hooks";
import { getLinks } from "./utils";
import { MinimalLink, Source, Target, UserId, SuggestedLinks, Model } from './types';

export function useLinks(sources: Source[], targets: Target[], context: string[][], existingLinks: MinimalLink[], currentUserId: UserId, model: Model, refreshToggle: boolean) {
    const [status, setStatus] = useState("idle");
    const [links, setLinks] = useState<SuggestedLinks | null>(null);
    useEffect(() => {
        const fetchLinks = async () => {
            setStatus("fetching");
            try {
                const suggestedLinks = await getLinks(sources, targets, context, existingLinks, currentUserId, model);
                setLinks(suggestedLinks);
                setStatus("success");
            } catch (error) {
                setStatus("error");
                throw error;
            }
        }
        fetchLinks();
    }, [refreshToggle]);
    return {links, status};
}