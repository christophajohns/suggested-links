import { getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'
import { AddLinkHandler, MinimalLink } from './types'
import {
  getCurrentUserId,
  getCurrentElements,
  truncate,
} from './utils';

export default function main() {
  // Called when the plugin is opened

  const currentUserId = getCurrentUserId();
  const {sources, targets, existingLinks} = getCurrentElements();

  // Define handler for accepting a link
  function handleAddLink(data: MinimalLink) {
    const { sourceId, targetId } = data;
    const sourceNode: TextNode = getSceneNodeById(sourceId);
    const targetNode: FrameNode = getSceneNodeById(targetId);
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
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' added`);
  }

  // Listen to ADD_LINK events
  on<AddLinkHandler>('ADD_LINK', handleAddLink);

  // Show plugin UI
  const options = { width: 384, height: 512 };
  const data = {
    currentUserId,
    sources,
    targets,
    existingLinks,
  }
  showUI(options, data);
}