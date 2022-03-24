import { EventHandler } from '@create-figma-plugin/utilities'

export interface AddLinkHandler extends EventHandler {
  name: 'ADD_LINK'
  handler: (link: FullLinkInfo) => void
}

export interface UpdateLinkHandler extends EventHandler {
  name: 'UPDATE_LINK'
  handler: (link: FullLinkInfo) => void
}

export interface RemoveLinkHandler extends EventHandler {
  name: 'REMOVE_LINK'
  handler: (link: FullLinkInfo) => void
}

export interface FocusNodeHandler extends EventHandler {
  name: 'FOCUS_NODE'
  handler: (nodeId: string) => void
}

export interface GetApplicationState extends EventHandler {
  name: 'GET_APPLICATION_STATE'
  handler: (applicationState: ApplicationState) => void
}

export type LinkableNode = EllipseNode | FrameNode | GroupNode | InstanceNode | LineNode | PolygonNode | RectangleNode | StarNode | TextNode | VectorNode

export interface ApplicationState {
  pages: Page[]
  existingLinks: MinimalLink[],
  currentUserId: UserId,
}

export type Model = "STATIC" | "INTERACTIVE";

export type UserId = string | null;

export interface MinimalLink {
  sourceId: string,
  targetId: string,
}

export interface Link {
  source: {
    id: string,
    name: string,
    type: string,
    parentName: string,
  },
  target: {
    id: string,
    name: string,
  },
}

export interface FullLinkInfo {
  source: UIElement,
  target: Page,
}

export interface SuggestedLinks {
  linksToAdd: Link[],
  linksToUpdate: Link[],
  linksToRemove: Link[],
}

export interface UIElement {
  // TODO: Add potential source element specification
  id: string,
  name: string,
  type: string,
  characters?: string,
  children?: UIElement[],
  bounds: {
    x: number,
    y: number,
    height: number,
    width: number,
  },
}

export interface Page {
  // TODO: Add potential target page specification
  id: string,
  name: string,
  width: number,
  height: number,
  children?: UIElement[],
}