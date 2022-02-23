import {
  Container,
  render,
  VerticalSpace,
  Text,
  LoadingIndicator,
} from '@create-figma-plugin/ui'
import { h } from 'preact'
import SuggestedLinks from './components/suggested-links'
import { useLinks } from './hooks';
import { MinimalLink, Source, Target, UserId } from './types';

interface PluginProps {
  sources: Source[],
  targets: Target[],
  existingLinks: MinimalLink[],
  currentUserId: UserId,
}

function Plugin(props: PluginProps) {
  const { sources, targets, existingLinks, currentUserId } = props;
  const {links, status} = useLinks(sources, targets, existingLinks, currentUserId);
  
  if (status === "fetching") return (
    <LoadingPage />
  );
  if (status === "error" || !links) return (
    <Text>Sorry, there was an error.</Text>
  )
  return (
    <Container>
      <VerticalSpace space="small" />
      <SuggestedLinks links={links} />
      <VerticalSpace space="extraLarge" />
      <Text muted>Suggested Links v0.0.1</Text>
      <VerticalSpace space="small" />
    </Container>
  );
}

function LoadingPage() {
  const style = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: "1rem",
    width: "100vw",
    height: "80vh"
  }
  return (
    <div style={style}>
      <LoadingIndicator />
      <Text>Generating suggested links…</Text>
    </div>
  )
}

export default render(Plugin)
