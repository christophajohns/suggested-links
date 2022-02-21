import { EventHandler } from '@create-figma-plugin/utilities'

export interface InsertConnectionHandler extends EventHandler {
  name: 'INSERT_CONNECTION'
  handler: (from: string, to: string) => void
}
