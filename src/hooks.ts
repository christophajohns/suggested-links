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
                const { sources, targets, context, existingLinks, currentUserId } = applicationState;
                const suggestedLinks = await getLinks(sources, targets, context, existingLinks, currentUserId, model);
                setLinks(suggestedLinks);
                setStatus("success");
            } catch (error) {
                setStatus("error");
                throw error;
            }
        }
        fetchLinks();
    }, [applicationState]);
    return {links, status};
}