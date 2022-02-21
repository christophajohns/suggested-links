import { emit, getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'

import { AddLinkHandler } from './types'
import {
  getPotentialSourceElementsTargetFramesAndExistingLinks,
  preprocess,
  getSuggestedLinks,
  addDetails,
  compareSuggestedAndExistingLinks,
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
  const preprocessedSourcesAndTargets = preprocess(potentialSourceElements, potentialTargetPages);

  // Send preprocessed data to optimizer and receive suggested links
  const suggestedLinks = getSuggestedLinks(preprocessedSourcesAndTargets);

  // Include additional information to suggested links
  const suggestedLinksWithFullInfo = addDetails(suggestedLinks, potentialSourceElements, potentialTargetPages);

  // Determine which links are to add, to update and to remove
  const { linksToAdd, linksToUpdate, linksToRemove } = compareSuggestedAndExistingLinks(suggestedLinksWithFullInfo, existingLinks, potentialSourceElements, potentialTargetPages)

  interface Link {
    sourceId: string,
    targetId: string,
  }

  function handleAddLink(data: Link) {
    const { sourceId, targetId } = data;
    const sourceNode: TextNode = getSceneNodeById(sourceId);
    sourceNode.reactions = sourceNode.reactions.concat({
        action: {
          type: "NODE",
          destinationId: targetId,
          navigation: "NAVIGATE",
          transition: null,
          preserveScrollPosition: false,
        },
        trigger: {type: "ON_CLICK"},
    })
    figma.notify("Link was added");
  }

  on<AddLinkHandler>('ADD_LINK', handleAddLink);

  // Show plugin UI
  const options = { width: 384, height: 512 };
  const data = {
    suggestedLinks: { linksToAdd, linksToUpdate, linksToRemove },
  };
  showUI(options, data);
}