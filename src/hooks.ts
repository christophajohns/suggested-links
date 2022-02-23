import { useEffect, useState } from "preact/hooks";
import { getLinks } from "./utils";
import { MinimalLink, Source, Target, UserId, SuggestedLinks } from './types';

export function useLinks(sources: Source[], targets: Target[], existingLinks: MinimalLink[], currentUserId: UserId) {
    const [status, setStatus] = useState("idle");
    const [links, setLinks] = useState<SuggestedLinks | null>(null);
    useEffect(() => {
        const fetchLinks = async () => {
            setStatus("fetching");
            try {
                const suggestedLinks = await getLinks(sources, targets, existingLinks, currentUserId);
                setLinks(suggestedLinks);
                setStatus("success");
            } catch (error) {
                setStatus("error");
                throw error;
            }
        }
        fetchLinks();
    }, []);
    return {links, status};
}