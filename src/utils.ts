import { Source, Target } from "./hooks";

export const getAllTextOrFrameNodes = () => {
    const allTextOrFrameNodes = figma.currentPage.findAllWithCriteria({
        types: ['TEXT', 'FRAME']
    });
    const textOrTopLevelFrameNodes = allTextOrFrameNodes.filter(node => node.type === "TEXT" || node.parent!.type === "PAGE")
    return textOrTopLevelFrameNodes;
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
        sources: potentialSourceElements.map(node => {
            if (node.parent) {
                return extractRelevantSourceData(node)
            }
        }),
        targets: potentialTargetPages.map(extractRelevantTargetData),
    }
}

function extractRelevantSourceData(node: TextNode): Source {
    return {
        id: node.id,
        name: node.name,
        characters: node.characters,
        color: node.fills !== figma.mixed && node.fills[0].type === "SOLID" ? node.fills[0].color : {r:0.0,g:0.0,b:0.0},
        parentId: getParentFrameId(node),
    }
}

function getParentFrameId(node: BaseNode): string {
    const parentIsNotTopLevel = node.parent!.type !== "PAGE";
    if (parentIsNotTopLevel) {
        return getParentFrameId(node.parent!)
    }
    return node.id
}

function extractRelevantTargetData(node: FrameNode): Target {
    const topics = getTopics(node);
    return {
        id: node.id,
        name: node.name,
        topics,
    }
}

function getTopics(frameNode: FrameNode, maxCount = 5): string[] {
    const textNodes = frameNode.findAllWithCriteria({ types: ["TEXT"]});
    const byFontSizeDescending = (textNodeA: TextNode, textNodeB: TextNode) => {
        const fontSizeA = getFontSize(textNodeA)
        const fontSizeB = getFontSize(textNodeB)
        if (fontSizeA > fontSizeB) {
            return -1;
        }
        if (fontSizeA < fontSizeB) {
            return 1;
        }
        return 0;
    }
    const largestTextNodes = textNodes.sort(byFontSizeDescending).slice(0, maxCount)
    const contentOfLargestTextNodes = largestTextNodes.map(node => node.characters);
    return contentOfLargestTextNodes
}

function getFontSize(textNode: TextNode): number {
    return textNode.fontSize !== figma.mixed ? textNode.fontSize : 0;
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

export function truncate(text: string, maxLength = 20) {
    if (text.length <= maxLength) {
        return text
    }
    // Return str truncated with '…' concatenated to the end of str.
    return text.slice(0, maxLength) + '…'
}