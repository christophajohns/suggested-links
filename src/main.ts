import { getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'
import { ADD_LINK } from './constants';
import { AddLinkHandler, Link } from './types'
import {
  getCurrentUserId,
  getCurrentElements,
  truncate,
  updateModel,
  getFullLinkInfo,
} from './utils';

export default function main() {
  // Called when the plugin is opened

  const currentUserId = getCurrentUserId();
  const {sources, targets, existingLinks} = getCurrentElements();

  // Define handler for accepting a link
  function handleAddLink(link: Link) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    sourceNode.reactions = [{
        action: {
          type: "NODE",
          destinationId: link.target.id,
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
  on<AddLinkHandler>(ADD_LINK, handleAddLink);

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