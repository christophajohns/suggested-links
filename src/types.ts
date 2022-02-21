import { EventHandler } from '@create-figma-plugin/utilities'

export interface InsertConnectionHandler extends EventHandler {
  name: 'INSERT_CONNECTION'
  handler: (source: string, target: string) => void
}
