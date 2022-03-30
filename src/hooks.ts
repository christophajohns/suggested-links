import { useEffect, useState } from "preact/hooks";
import { getLinks } from "./utils";
import { SuggestedLinks, Model, ApplicationState } from './types';

export function useLinks(applicationState: ApplicationState, model: Model) {
    const [status, setStatus] = useState("idle");
    const [links, setLinks] = useState<SuggestedLinks | null>(null);
    useEffect(() => {
        const fetchLinks = async () => {
            setStatus("fetching");
            try {
                const { pages, existingLinks, currentUserId, backendURL } = applicationState;
                const suggestedLinks = await getLinks(pages, existingLinks, currentUserId, model, backendURL);
                setLinks(suggestedLinks);
                setStatus("success");
            } catch (error) {
                setStatus("error");
                throw error;
            }
        }
        fetchLinks();
    }, [applicationState, model]);
    return {links, status};
}