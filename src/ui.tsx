import {
  Container,
  render,
  VerticalSpace,
  Text,
  LoadingIndicator,
} from '@create-figma-plugin/ui'
import { createContext, h } from 'preact'
import SuggestedLinks from './components/suggested-links'
import { useLinks } from './hooks';
import { ApplicationState, MinimalLink, Source, Target, UserId } from './types';

export const ApplicationStateContext = createContext<ApplicationState | null>(null)

interface PluginProps {
  sources: Source[],
  targets: Target[],
  context: string[][],
  existingLinks: MinimalLink[],
  currentUserId: UserId,
}

function Plugin(props: PluginProps) {
  const { sources, targets, context, existingLinks, currentUserId } = props;
  const {links, status} = useLinks(sources, targets, context, existingLinks, currentUserId);
  
  if (status === "fetching") return (
    <LoadingPage />
  );
  if (status === "error" || !links) return (
    <Text>Sorry, there was an error.</Text>
  )
  return (
    <ApplicationStateContext.Provider value={props}>
      <Container>
        <VerticalSpace space="small" />
        <SuggestedLinks links={links} />
        <VerticalSpace space="extraLarge" />
        <Text muted>Suggested Links v0.0.1</Text>
        <VerticalSpace space="small" />
      </Container>
    </ApplicationStateContext.Provider>
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
