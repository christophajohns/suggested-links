import {
  Container,
  render,
  VerticalSpace,
  Text,
  LoadingIndicator,
  IconButton,
  Dropdown,
  DropdownOption,
  IconSwap16,
  Button,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities';
import { createContext, h } from 'preact'
import { useContext, useState } from 'preact/hooks';
import SuggestedLinks from './components/suggested-links'
import { APPLICATION_STATE, GET_APPLICATION_STATE, INTERACTIVE } from './constants';
import { useLinks } from './hooks';
import { ApplicationState, Model } from './types';
import { sendTrainingData } from './utils';

export const ApplicationStateContext = createContext<ApplicationState | null>(null)

function Plugin(props: ApplicationState) {
  const [model, setModel] = useState<Model>("STATIC");
  const [applicationState, setApplicationState] = useState<ApplicationState>(props);
  const { links, status } = useLinks(applicationState, model);
  function refresh() {
    emit(GET_APPLICATION_STATE);
  }
  function handleApplicationState(newApplicationState: ApplicationState) {
    setApplicationState(newApplicationState);
  }
  on(APPLICATION_STATE, handleApplicationState);

  if (status === "fetching") return (
    <LoadingPage />
  );
  if (status === "error" || !links) return (
    <Text>Sorry, there was an error.</Text>
  )
  return (
    <ApplicationStateContext.Provider value={applicationState}>
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

function TrainButton() {
  const [status, setStatus] = useState("idle");
  const { currentUserId, existingLinks, sources, targets } = useContext(ApplicationStateContext)!;
  function handleClick() {
    const sendLinks = async () => {
      setStatus("fetching");
      try {
          await sendTrainingData(currentUserId, existingLinks, sources, targets);
          setStatus("success");
      } catch (error) {
          setStatus("error");
          throw error;
      }
    }
    sendLinks();
  }
  return (
    <Button onClick={handleClick} loading={status === "fetching"}>Train</Button>
  );
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
        {props.model === INTERACTIVE && <TrainButton />}
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
