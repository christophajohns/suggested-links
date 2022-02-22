import { emit, getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'

import { AddLinkHandler } from './types'
import {
  getPotentialSourceElementsTargetFramesAndExistingLinks,
  preprocess,
} from './utils';

export default function main() {
  // Called when the plugin is opened

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

  interface Link {
    sourceId: string,
    targetId: string,
  }

  function handleAddLink(data: Link) {
    const { sourceId, targetId } = data;
    const sourceNode: TextNode = getSceneNodeById(sourceId);
    sourceNode.reactions = [{
        action: {
          type: "NODE",
          destinationId: targetId,
          navigation: "NAVIGATE",
          transition: null,
          preserveScrollPosition: false,
        },
        trigger: {type: "ON_CLICK"},
    }]
    figma.notify("Link added");
  }

  on<AddLinkHandler>('ADD_LINK', handleAddLink);

  // Show plugin UI
  const options = { width: 384, height: 512 };
  const data = {
    sources,
    targets,
    existingLinks,
  };
  showUI(options, data);
}