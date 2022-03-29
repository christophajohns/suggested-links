import { BASE_URL, STATIC, INTERACTIVE } from "./constants";
import { Link, MinimalLink, SuggestedLinks, UserId, Model, FullLinkInfo, LinkableNode, Page, UIElement } from "./types";

export const isLinkable = (node: SceneNode): boolean => {
    const linkableTypes = [
        "ELLIPSE",
        "FRAME",
        "GROUP",
        "INSTANCE",
        "LINE",
        "POLYGON",
        "RECTANGLE",
        "STAR",
        "TEXT",
        "VECTOR",
    ];
    if (!linkableTypes.includes(node.type)) {
        return false;
    }
    return true;
}

export const getExistingLinks = () => {
    figma.skipInvisibleInstanceChildren = true;
    const allLinkableNodes = figma.currentPage.findAllWithCriteria({
        types: [
            "ELLIPSE",
            "FRAME",
            "GROUP",
            "INSTANCE",
            "LINE",
            "POLYGON",
            "RECTANGLE",
            "STAR",
            "TEXT",
            "VECTOR",
        ],
    });
    const nodesWithReactions = allLinkableNodes.filter(node => node.reactions && node.reactions.length > 0)
    const existingLinks: MinimalLink[] = []

    nodesWithReactions.forEach(node => {
        node.reactions.forEach(reaction => {
            if (reaction.action?.type === "NODE" && reaction.action?.destinationId) {
                existingLinks.push({
                    sourceId: node.id,
                    targetId: reaction.action.destinationId,
                })
            } 
        });
    });

    return existingLinks;
}

export const setNodeReactionToLink = (sourceNode: SceneNode, targetNode: FrameNode) => {
    if (!isLinkable(sourceNode)) {
        throw new Error("Cannot set reaction for node");
    }
    (sourceNode as LinkableNode).reactions = [{
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

const processChildren = (node: SceneNode): UIElement[] => {
    const children: UIElement[] = []
    for (const childNode of (node as FrameNode).children) {
        if ((childNode as FrameNode).absoluteRenderBounds) {
            const uiElement: UIElement = {
                id: childNode.id,
                name: childNode.name,
                type: childNode.type,
                bounds: (childNode as FrameNode).absoluteRenderBounds!,
            };
            if ("characters" in childNode) {
                uiElement.characters = (childNode as TextNode).characters;
            }
            if ("children" in childNode) {
                uiElement.children = processChildren(childNode);
            }
            children.push(uiElement);
        }
    }
    return children;
}

const process = (frames: FrameNode[]): Page[] => {
    const pages: Page[] = frames.map(frame => {
        const page: Page = {
            id: frame.id,
            name: frame.name,
            height: frame.height,
            width: frame.width,
        }
        if ("children" in frame) {
            page.children = processChildren(frame);
        }
        return page;
    })
    return pages;
}

export const getTopLevelFramesData = (): Page[] => {
    figma.skipInvisibleInstanceChildren = true;
    const frameNodes = figma.currentPage.findAllWithCriteria({
        types: ['FRAME']
    });
    const topLevelFrameNodes = frameNodes.filter(node => node.parent!.type === "PAGE")
    const processedFrameNodes = process(topLevelFrameNodes);
    return processedFrameNodes;
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

export const sendTrainingData = async (currentUserId: UserId, links: MinimalLink[], pages: Page[]) => {
    const fullLinks = addDetails(links, pages);
    for (const link of fullLinks) {
        const fullLinkInfo = getFullLinkInfo(link, pages);
        await updateModel(currentUserId, fullLinkInfo);
    }
}

export const getCurrentUserId = () => (figma.currentUser && figma.currentUser.id);

const getChildUIElements = (node: Page | UIElement): UIElement[] => {
    if (!("children" in node)) {
        return [];
    }
    let uiElements: UIElement[] = [...node.children!];
    for (const childNode of node.children!) {
        const uiElementsUnderNode = getChildUIElements(childNode);
        uiElements = [...uiElements, ...uiElementsUnderNode];
    }
    return uiElements;
}

const getAllUIElements = (pages: Page[]): UIElement[] => {
    let uiElements: UIElement[] = []
    for (const page of pages) {
        const uiElementsOnPage = getChildUIElements(page);
        uiElements = [...uiElements, ...uiElementsOnPage];
    }
    return uiElements;
}

const findElementWithId = (id: string, pages: Page[]): UIElement => {
    const allUIElements = getAllUIElements(pages);
    return allUIElements.find(uiElement => uiElement.id === id)!
}

export const getFullLinkInfo = (link: Link, pages: Page[]): FullLinkInfo => {
    
    const fullLinkInfo: FullLinkInfo = {
        source: {
            page: getParentPageById(link.source.id, pages),
            element: findElementWithId(link.source.id, pages),
        },
        target: pages.find(page => page.id === link.target.id)!,
    };
    return fullLinkInfo
}

export const getLinks = async (pages: Page[], existingLinks: MinimalLink[], currentUserId: UserId, model: Model = INTERACTIVE): Promise<SuggestedLinks> => {
    const url = model === STATIC ? `${BASE_URL}/links` : `${BASE_URL}/model/${currentUserId}/links`;
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pages })
        }
    );
    if (!response.ok) {
        throw new Error("Failed to fetch links");
    }
    const { links } = await response.json();
    console.log({links});
    const linksWithDetails = addDetails(links, pages);
    const suggestedLinks = compareSuggestedAndExistingLinks(linksWithDetails, existingLinks, pages);
    console.log({suggestedLinks})
    return suggestedLinks;
}

function getParentPageById(id: string, pages: Page[]): Page {
    for (const page of pages) {
        const uiElementsOnPage = getChildUIElements(page);
        if (uiElementsOnPage.find(uiElement => uiElement.id === id)) {
            return page;
        }
    }
    throw new Error("Parent page could not be found");
}

function addDetail(link: MinimalLink, pages: Page[]): Link {
    const source = findElementWithId(link.sourceId, pages);
    const parentPage = getParentPageById(source.id, pages);
    return {
        source: {
            id: source.id,
            name: source.name,
            parent: {
                id: parentPage.id,
                name: parentPage.name
            },
            type: source.type,
        },
        target: {
            id: link.targetId,
            name: pages.find(page => page.id === link.targetId)!.name,
        },
    }
}

function addDetails(suggestedLinks: MinimalLink[], pages: Page[]): Link[] {
    const suggestedLinksWithFullInfo = suggestedLinks.map(link => addDetail(link, pages));
    return suggestedLinksWithFullInfo;
}

function compareSuggestedAndExistingLinks(
    suggestedLinksWithFullInfo: Link[],
    existingLinks: MinimalLink[],
    pages: Page[],
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
            linksToRemove.push(addDetail(existingLink, pages));
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