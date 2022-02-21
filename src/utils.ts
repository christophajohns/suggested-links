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
        potentialSourceElements,
        potentialTargetPages,
    }
}

interface Source {
    // TODO: Add potential source element specification
    id: string,
}

interface Target {
    // TODO: Add potential target page specification
    id: string,
}

interface PreprocessedSourcesAndTargets {
    potentialSourceElements: Source[],
    potentialTargetPages: Target[],
}

interface Link {
    sourceId: string,
    targetId: string,
}

export function getSuggestedLinks(preprocessedSourcesAndTargets: PreprocessedSourcesAndTargets) {
    // TODO: Add network request to optimizer here.
    return [{
        sourceId: preprocessedSourcesAndTargets.potentialSourceElements[0].id,
        targetId: preprocessedSourcesAndTargets.potentialTargetPages[0].id,
    }]
}

function addDetail(link: Link, textNodes: TextNode[], frameNodes: FrameNode[]) {
    return {
        source: {
            id: link.sourceId,
            name: textNodes[textNodes.findIndex(node => node.id === link.sourceId)].name,
        },
        target: {
            id: link.targetId,
            name: frameNodes[frameNodes.findIndex(node => node.id === link.targetId)].name,
        },
    }
}

export function addDetails(suggestedLinks: Link[], textNodes: TextNode[], frameNodes: FrameNode[]) {
    const suggestedLinksWithFullInfo = suggestedLinks.map(link => addDetail(link, textNodes, frameNodes));
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
    textNodes: TextNode[],
    frameNodes: FrameNode[]
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
        if (!linksToAdd.find(link => link.source.id === existingLink.sourceId && link.target.id === existingLink.targetId) && !linksToUpdate.find(link => link.source.id === existingLink.sourceId && link.target.id === existingLink.targetId)) {
            linksToRemove.push(addDetail(existingLink, textNodes, frameNodes));
        }
    })

    return { linksToAdd, linksToUpdate, linksToRemove };
}