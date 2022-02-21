import { emit, on, showUI } from '@create-figma-plugin/utilities'

import { InsertConnectionHandler } from './types'
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

  // Show plugin UI
  const options = { width: 448, height: 512 };
  const data = {
    suggestedLinks: { linksToAdd, linksToUpdate, linksToRemove },
  };
  showUI(options, data);
}