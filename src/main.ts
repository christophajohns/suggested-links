import { getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'
import { ADD_LINK, UPDATE_LINK, REMOVE_LINK, FOCUS_NODE} from './constants';
import { AddLinkHandler, UpdateLinkHandler, RemoveLinkHandler, FocusNodeHandler } from './types'
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
  const context = targets.map(target => target.topics);

  // Define handler for accepting a link
  function handleAddLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' added`);
  }

  // Define handler for updating a link
  function handleUpdateLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' changed to '${truncatedTargetName}'`);
  }

  // Define handler for removing a link
  function handleRemoveLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: TextNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    sourceNode.reactions = []
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' removed`);
  }

  // Define handler focus on node
  function handleFocusNode(nodeId: string) {
    const node = getSceneNodeById(nodeId);
    figma.viewport.scrollAndZoomIntoView([node]);
    figma.viewport.zoom = 0.5;
    figma.currentPage.selection = [node];
  }

  // Listen to ADD_LINK events
  on<AddLinkHandler>(ADD_LINK, handleAddLink);

  // Listen to UPDATE_LINK events
  on<UpdateLinkHandler>(UPDATE_LINK, handleUpdateLink);

  // Listen to REMOVE_LINK events
  on<RemoveLinkHandler>(REMOVE_LINK, handleRemoveLink);

  // Listen to FOCUS_NODE events
  on<FocusNodeHandler>(FOCUS_NODE, handleFocusNode);

  // Show plugin UI
  const options = { width: 384, height: 512 };
  const data = {
    currentUserId,
    sources,
    targets,
    context,
    existingLinks,
  }
  showUI(options, data);
}