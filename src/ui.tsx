import {
  Container,
  render,
  VerticalSpace,
  Text,
  LoadingIndicator,
  IconButton,
  IconWorld16,
  Dropdown,
  DropdownOption,
  IconSwap16,
} from '@create-figma-plugin/ui'
import { createContext, h } from 'preact'
import { useState } from 'preact/hooks';
import SuggestedLinks from './components/suggested-links'
import { useLinks } from './hooks';
import { ApplicationState, MinimalLink, Model, Source, Target, UserId } from './types';

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
  const [model, setModel] = useState<Model>("STATIC");
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);
  const {links, status} = useLinks(sources, targets, context, existingLinks, currentUserId, model, refreshToggle);
  function refresh() {
    setRefreshToggle(!refreshToggle);
  }

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
        <RefreshButton onRefresh={refresh} />
        <VerticalSpace space="small" />
        <SuggestedLinks links={links} />
        <VerticalSpace space="extraLarge" />
        <Footer onModelChange={setModel} model={model} />
        <VerticalSpace space="small" />
      </Container>
    </ApplicationStateContext.Provider>
  );
}

function RefreshButton(props: {onRefresh: Function}) {
  const style = {
    float: 'right',
    height: '0px', // this is a hack to fix the float right
  };
  return (
    <div style={style}>
      <IconButton value={false} onClick={() => props.onRefresh()}><IconSwap16/></IconButton>
    </div>
  );
}

function ClassifierDropdown(props: {onModelChange: (model: Model) => void, model: Model}) {
  const STATIC = 's';
  const INTERACTIVE = 'i';
  const options: DropdownOption[] = [
    { value: STATIC },
    { value: INTERACTIVE },
  ]
  function handleChange(event: any) {
    const newValue = event.currentTarget.value
    const newModel: Model = newValue === STATIC ? "STATIC" : "INTERACTIVE";
    props.onModelChange(newModel);
  }
  return (
    <Dropdown
      noBorder
      onChange={handleChange}
      options={options}
      value={props.model === "STATIC" ? STATIC : INTERACTIVE}
    />
  )
}

function Footer(props: {onModelChange: (model: Model) => void, model: Model}) {
  const spaceBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const inline = {
    display: "flex",
    flexDirection: "row",
  }
  return (
    <div style={spaceBetween}>
      <Text muted>Suggested Links v0.0.1</Text>
      <div style={inline}>
        <ClassifierDropdown onModelChange={props.onModelChange} model={props.model} />
        <IconButton value={false}><IconWorld16 /></IconButton>
      </div>
    </div>
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
