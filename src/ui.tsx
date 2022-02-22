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

interface Source {
  id: string,
  name: string,
}

interface Target {
  id: string,
  name: string,
}

interface Link {
  sourceId: string,
  targetId: string,
}

interface Node {
  id: string,
  name: string,
}

interface PluginProps {
  sources: Source[],
  targets: Target[],
  existingLinks: Link[],
}

function Plugin(props: PluginProps) {
  const { sources, targets, existingLinks } = props;
  const { links: suggestedLinks, status } = useLinks(sources, targets, existingLinks);
  if (status === "fetching" || !suggestedLinks) return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "1rem",
      width: "100vw",
      height: "80vh"
    }}>
      <LoadingIndicator />
      <Text>Generating suggested links…</Text>
    </div>
  );
  return (
    <Container>
      <VerticalSpace space="small" />
      <SuggestedLinks links={suggestedLinks} />
      <VerticalSpace space="extraLarge" />
      <Text muted>Suggested Links v0.0.1</Text>
      <VerticalSpace space="small" />
    </Container>
  );
}

export default render(Plugin)
