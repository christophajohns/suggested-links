import { emit, getSceneNodeById, on, showUI } from '@create-figma-plugin/utilities'
import { ADD_LINK, UPDATE_LINK, REMOVE_LINK, FOCUS_NODE, APPLICATION_STATE, GET_APPLICATION_STATE} from './constants';
import { AddLinkHandler, UpdateLinkHandler, RemoveLinkHandler, FocusNodeHandler, GetApplicationState, ApplicationState, LinkableNode } from './types'
import {
  getCurrentUserId,
  truncate,
  setNodeReactionToLink,
  getTopLevelFramesData,
  isLinkable,
  getExistingLinks,
} from './utils';

export default function main() {
  // Called when the plugin is opened

  const currentUserId = getCurrentUserId();
  const existingLinks = getExistingLinks();
  const pages = getTopLevelFramesData();

  // Define handler for accepting a link
  function handleAddLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: SceneNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' to '${truncatedTargetName}' added`);
  }

  // Define handler for updating a link
  function handleUpdateLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: SceneNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    setNodeReactionToLink(sourceNode, targetNode);
    const truncatedSourceName = truncate(sourceNode.name)
    const truncatedTargetName = truncate(targetNode.name)
    figma.notify(`Link from '${truncatedSourceName}' changed to '${truncatedTargetName}'`);
  }

  // Define handler for removing a link
  function handleRemoveLink(link: {source: {id: string}, target: {id: string}}) {
    const sourceNode: SceneNode = getSceneNodeById(link.source.id);
    const targetNode: FrameNode = getSceneNodeById(link.target.id);
    if (isLinkable(sourceNode)) {
      (sourceNode as LinkableNode).reactions = []
    }
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

  // Define handler focus on node
  function handleGetApplicationState() {
    const existingLinks = getExistingLinks();
    const pages = getTopLevelFramesData();
    const currentApplicationState: ApplicationState = {
      currentUserId,
      pages,
      existingLinks,
    };
    emit(APPLICATION_STATE, currentApplicationState);
  }

  // Listen to ADD_LINK events
  on<AddLinkHandler>(ADD_LINK, handleAddLink);

  // Listen to UPDATE_LINK events
  on<UpdateLinkHandler>(UPDATE_LINK, handleUpdateLink);

  // Listen to REMOVE_LINK events
  on<RemoveLinkHandler>(REMOVE_LINK, handleRemoveLink);

  // Listen to FOCUS_NODE events
  on<FocusNodeHandler>(FOCUS_NODE, handleFocusNode);

  // Listen to GET_APPLICATION_STATE events
  on<GetApplicationState>(GET_APPLICATION_STATE, handleGetApplicationState);

  // Show plugin UI
  const options = { width: 384, height: 512 };
  const data = {
    currentUserId,
    pages,
    existingLinks,
  }
  showUI(options, data);
}