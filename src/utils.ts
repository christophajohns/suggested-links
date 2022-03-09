import { BASE_URL, STATIC, INTERACTIVE } from "./constants";
import { Link, MinimalLink, Source, Target, SuggestedLinks, UserId, Model, FullLinkInfo } from "./types";

export const setNodeReactionToLink = (sourceNode: TextNode, targetNode: FrameNode) => {
    sourceNode.reactions = [{
        action: {
          type: "NODE",
          destinationId: targetNode.id,
          navigation: "NAVIGATE",
          transition: null,
          preserveScrollPosition: false,
        },
        trigger: {type: "ON_CLICK"},
    }]
}

export const updateModel = async (currentUserId: UserId, link: FullLinkInfo, isLink = true) => {
    const response = await fetch(
        `${BASE_URL}/model/${currentUserId}/update`,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ link, isLink })
        }
    );
    if (!response.ok) {
        throw new Error("Failed to update model");
    }
}

export const getCurrentUserId = () => (figma.currentUser && figma.currentUser.id);

export const getCurrentElements = () => {
    // Get all text nodes (potential source elements),
    // frame nodes (potential target pages) and
    // existing links between text and frame nodes
    let {
        potentialSourceElements,
        potentialTargetPages,
        existingLinks,
    } = getPotentialSourceElementsTargetFramesAndExistingLinks();

    // Transform into relevant data for optimizer
    const { sources, targets } = preprocess(potentialSourceElements, potentialTargetPages);

    return {sources, targets, existingLinks};
}

export const getFullLinkInfo = (link: Link, sources: Source[], targets: Target[]): FullLinkInfo => {
    const fullLinkInfo: FullLinkInfo = {
        source: sources.find(source => source.id === link.source.id)!,
        target: targets.find(target => target.id === link.target.id)!,
        context: targets.map(target => target.topics),
    };
    return fullLinkInfo
}

export const getLinks = async (sources: Source[], targets: Target[], context: string[][], existingLinks: MinimalLink[], currentUserId: UserId, model: Model = INTERACTIVE): Promise<SuggestedLinks> => {
    const url = model === STATIC ? `${BASE_URL}/links` : `${BASE_URL}/model/${currentUserId}/links`;
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sources, targets, context })
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch links");
    }
    const { links } = await response.json();
    console.log({links});
    const linksWithDetails = addDetails(links, sources, targets);
    const suggestedLinks = compareSuggestedAndExistingLinks(linksWithDetails, existingLinks, sources, targets);
    return suggestedLinks;
}

const getPotentialSourceElementsTargetFramesAndExistingLinks = () => {
    figma.skipInvisibleInstanceChildren = true;
    const textOrFrameNodes = getAllTextOrFrameNodes();

    const potentialSourceElements: TextNode[] = [];
    const potentialTargetPages: FrameNode[] = [];
    const existingLinks: MinimalLink[] = [];

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

const getAllTextOrFrameNodes = () => {
    const allTextOrFrameNodes = figma.currentPage.findAllWithCriteria({
        types: ['TEXT', 'FRAME']
    });
    const textOrTopLevelFrameNodes = allTextOrFrameNodes.filter(node => node.type === "TEXT" || node.parent!.type === "PAGE")
    return textOrTopLevelFrameNodes;
}

function preprocess(potentialSourceElements: TextNode[], potentialTargetPages: FrameNode[]) {
    // TODO: Add preprocessing here.
    const sourceElementsWithParent = potentialSourceElements.filter(node => node.parent);
    return {
        sources: sourceElementsWithParent.map(extractRelevantSourceData),
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
    const topics = getTopics(node, 5);
    return {
        id: node.id,
        name: node.name,
        topics,
    }
}

export function getTextsPerPage() {
    const { potentialTargetPages } = getPotentialSourceElementsTargetFramesAndExistingLinks();
    const texts = potentialTargetPages.map(targetPage => getTopics(targetPage))
    return texts;
}

function getTopics(frameNode: FrameNode, maxCount: number|null = null): string[] {
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
    if (maxCount) {
        const largestTextNodes = textNodes.sort(byFontSizeDescending).slice(0, maxCount)
        const contentOfLargestTextNodes = largestTextNodes.map(node => node.characters);
        return contentOfLargestTextNodes
    }
    return textNodes.map(node => node.characters);
    
}

function getFontSize(textNode: TextNode): number {
    return textNode.fontSize !== figma.mixed ? textNode.fontSize : 0;
}

function addDetail(link: MinimalLink, sources: Source[], targets: Target[]): Link {
    const source = sources.find(source => source.id === link.sourceId)!;
    return {
        source: {
            id: source.id,
            name: source.name,
            parentName: targets.find(frame => frame.id === source.parentId)!.name,
        },
        target: {
            id: link.targetId,
            name: targets[targets.findIndex(target => target.id === link.targetId)].name,
        }
    }
}

function addDetails(suggestedLinks: MinimalLink[], sources: Source[], targets: Target[]): Link[] {
    const suggestedLinksWithFullInfo = suggestedLinks.map(link => addDetail(link, sources, targets));
    return suggestedLinksWithFullInfo;
}

function compareSuggestedAndExistingLinks(
    suggestedLinksWithFullInfo: Link[],
    existingLinks: MinimalLink[],
    sources: Source[],
    targets: Target[]
): SuggestedLinks {
    const linksToAdd: Link[] = [];
    const linksToUpdate: Link[] = [];
    const linksToRemove: Link[] = [];

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