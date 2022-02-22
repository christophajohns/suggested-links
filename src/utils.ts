export const getAllTextOrFrameNodes = () => {
    return figma.currentPage.findAllWithCriteria({
        types: ['TEXT', 'FRAME']
    });
}

export function getPotentialSourceElementsTargetFramesAndExistingLinks() {
    figma.skipInvisibleInstanceChildren = true;
    const textOrFrameNodes = getAllTextOrFrameNodes();

    const potentialSourceElements: TextNode[] = [];
    const potentialTargetPages: FrameNode[] = [];
    const existingLinks: Link[] = [];

    textOrFrameNodes.forEach(node => {
        if (node.type == "TEXT") {
            potentialSourceElements.push(node);
        } else {
            potentialTargetPages.push(node);
        }
        node.reactions.forEach(reaction => {
            if (reaction.action?.type === "NODE" && reaction.action?.destinationId) {
                existingLinks.push({
                    sourceId: node.id,
                    targetId: reaction.action.destinationId,
                })
            } 
        });
    });

    return {
        potentialSourceElements,
        potentialTargetPages,
        existingLinks,
    };
}

export function preprocess(potentialSourceElements: TextNode[], potentialTargetPages: FrameNode[]) {
    // TODO: Add preprocessing here.
    return {
        sources: potentialSourceElements.map(extractRelevantData),
        targets: potentialTargetPages.map(extractRelevantData),
    }
}

function extractRelevantData(node: TextNode | FrameNode) {
    return {
        id: node.id,
        name: node.name,
    }
}

interface Source {
    // TODO: Add potential source element specification
    id: string,
    name: string,
}

interface Target {
    // TODO: Add potential target page specification
    id: string,
    name: string
}

interface Link {
    sourceId: string,
    targetId: string,
}

function addDetail(link: Link, sources: Source[], targets: Target[]) {
    return {
        source: {
            id: link.sourceId,
            name: sources[sources.findIndex(source => source.id === link.sourceId)].name,
        },
        target: {
            id: link.targetId,
            name: targets[targets.findIndex(target => target.id === link.targetId)].name,
        },
    }
}

export function addDetails(suggestedLinks: Link[], sources: Source[], targets: Target[]) {
    const suggestedLinksWithFullInfo = suggestedLinks.map(link => addDetail(link, sources, targets));
    return suggestedLinksWithFullInfo;
}

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

export function compareSuggestedAndExistingLinks(
    suggestedLinksWithFullInfo: LinkWithFullInfo[],
    existingLinks: Link[],
    sources: Source[],
    targets: Target[]
) {
    const linksToAdd: LinkWithFullInfo[] = [];
    const linksToUpdate: LinkWithFullInfo[] = [];
    const linksToRemove: LinkWithFullInfo[] = [];

    suggestedLinksWithFullInfo.forEach(suggestedLink => {
        const existingLinkWithSameSource = existingLinks.find(existingLink => suggestedLink.source.id === existingLink.sourceId)
        if (!existingLinkWithSameSource) {
            linksToAdd.push(suggestedLink);
            return;
        }
        if (suggestedLink.target.id !== existingLinkWithSameSource.targetId) {
            linksToUpdate.push(suggestedLink);
        }
    });
    existingLinks.forEach(existingLink => {
        if (
            !linksToAdd.find(link => link.source.id === existingLink.sourceId && link.target.id === existingLink.targetId) &&
            !linksToUpdate.find(link => link.source.id === existingLink.sourceId) &&
            !suggestedLinksWithFullInfo.find(link => link.source.id === existingLink.sourceId && link.target.id === existingLink.targetId)
        ) {
            linksToRemove.push(addDetail(existingLink, sources, targets));
        }
    })

    return { linksToAdd, linksToUpdate, linksToRemove };
}