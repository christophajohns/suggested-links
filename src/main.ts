import { loadFontsAsync, once, showUI } from '@create-figma-plugin/utilities'

import { InsertConnectionHandler } from './types'

export default function () {
  once<InsertConnectionHandler>('INSERT_CONNECTION', async function (source: string, target: string) {
    const text = figma.createText()
    await loadFontsAsync([text])
    text.characters = `From: ${source}\nTo: ${target}`
    figma.closePlugin()
  })
  showUI({ width: 320, height: 240 })
}
