import { getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'
import { ADD_LINK, UPDATE_LINK, REMOVE_LINK } from './constants';
import { AddLinkHandler, UpdateLinkHandler, RemoveLinkHandler, Link } from './types'
import {
  getCurrentUserId,
  getCurrentElements,
  truncate,
  setNodeReactionToLink,
} from './utils';

export default function main() {
  // Called when the plugin is opened

  const currentUserId = getCurrentUserId();
  const {sources, targets, existingLinks} = getCurrentElements();

  // Define handler for accepting a link
  function handleAddLink(link: Link) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' added`);
  }

  // Define handler for updating a link
  function handleUpdateLink(link: Link) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' changed to '${truncatedTargetName}'`);
  }

  // Define handler for removing a link
  function handleRemoveLink(link: Link) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    sourceNode.reactions = []
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' removed`);
  }

  // Listen to ADD_LINK events
  on<AddLinkHandler>(ADD_LINK, handleAddLink);

  // Listen to UPDATE_LINK events
  on<UpdateLinkHandler>(UPDATE_LINK, handleUpdateLink);

  // Listen to REMOVE_LINK events
  on<RemoveLinkHandler>(REMOVE_LINK, handleRemoveLink);

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