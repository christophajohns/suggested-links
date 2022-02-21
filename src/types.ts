import { EventHandler } from '@create-figma-plugin/utilities'

export interface InsertConnectionHandler extends EventHandler {
  name: 'INSERT_CONNECTION'
  handler: (source: string, target: string) => void
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