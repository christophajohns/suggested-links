import { EventHandler } from '@create-figma-plugin/utilities'

export interface AddLinkHandler extends EventHandler {
  name: 'ADD_LINK'
  handler: (data: {sourceId: string, targetId: string}) => void
}

export interface Link {
  source: {
    id: string,
    name: string,
  },
  target: {
    id: string,
    name: string,
  },
}

export const ADD = "ADD";
export const UPDATE = "UPDATE";
export const REMOVE = "REMOVE";