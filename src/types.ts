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

export interface ApplicationState {
  sources: Source[],
  targets: Target[],
  existingLinks: MinimalLink[],
  currentUserId: UserId,
  context: string[][],
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
    parentName: string,
  },
  target: {
    id: string,
    name: string,
  },
}

export interface FullLinkInfo {
  source: Source,
  target: Target,
  context: string[][],
}

export interface SuggestedLinks {
  linksToAdd: Link[],
  linksToUpdate: Link[],
  linksToRemove: Link[],
}

export interface Source {
  // TODO: Add potential source element specification
  id: string,
  name: string,
  characters: string,
  color: {
      r: number,
      g: number,
      b: number,
  },
  parentId: string,
}

export interface Target {
  // TODO: Add potential target page specification
  id: string,
  name: string,
  topics: string[],
}