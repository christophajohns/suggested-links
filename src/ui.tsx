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
  IconEllipsis32,
  Textbox,
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities';
import { ComponentChildren, createContext, h } from 'preact'
import { useContext, useState } from 'preact/hooks';
import Section from './components/section';
import SuggestedLinks from './components/suggested-links'
import { APPLICATION_STATE, GET_APPLICATION_STATE, INTERACTIVE } from './constants';
import { useLinks } from './hooks';
import { ApplicationState, Model, SuggestedLinks as SuggestedLinksType } from './types';
import { sendTrainingData } from './utils';

export const ApplicationStateContext = createContext<ApplicationState | null>(null)

function Plugin(props: ApplicationState) {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  return (
    <Container>
      <VerticalSpace space="small" />
      <MainContent
        initialApplicationState={props}
        showSettings={showSettings}
      />
      <VerticalSpace space="extraLarge" />
      <Footer showSettings={showSettings} onShowSettings={() => setShowSettings(!showSettings)}/>
      <VerticalSpace space="small" />
    </Container>
  );
}

function SettingsButton(props: {onClick: Function, selected: boolean}) {
  return (
    <IconButton onChange={() => props.onClick()} value={props.selected}>
      <IconEllipsis32 />
    </IconButton>
  )
}

function MainContent(props: {initialApplicationState: ApplicationState, showSettings: boolean}) {
  const [model, setModel] = useState<Model>("STATIC");
  const [applicationState, setApplicationState] = useState<ApplicationState>(props.initialApplicationState);
  const { links, status } = useLinks(applicationState, model);
  function refresh() {
    emit(GET_APPLICATION_STATE, applicationState.backendURL);
  }
  function handleApplicationState(newApplicationState: ApplicationState) {
    setApplicationState(newApplicationState);
  }
  on(APPLICATION_STATE, handleApplicationState);
  
  const style = {display: "None"};
  return (
    <ApplicationStateContext.Provider value={applicationState}>
      <div>
        <div style={props.showSettings ? style : {}}>
          <Links status={status} links={links} onRefresh={refresh}/>
        </div>
        <div style={props.showSettings ? {} : style}>
          <VerticalSpace space="small" />
          <Settings model={model} onModelChange={setModel} setBackendURL={(backendURL: string) => setApplicationState({...applicationState, backendURL})}/>
        </div>
      </div>
    </ApplicationStateContext.Provider>
  );
}

function Links(props: {status: string, links: SuggestedLinksType | null, onRefresh: Function}) {
  if (props.status === "fetching") return (
    <LoadingPage />
  );
  if (props.status === "error" || !props.links) return (
    <Text>Sorry, there was an error.</Text>
  )
  return (
    <div>
      <RefreshButton onRefresh={props.onRefresh} />
      <VerticalSpace space="small" />
      <SuggestedLinks links={props.links} />
    </div>
  )
}

function Settings(props: {onModelChange: (model: Model) => void, model: Model, setBackendURL: Function}) {
  const inline = {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
  };
  const [backendURL, setBackendURL] = useState<string>("");
  const [savedBackendURL, setSavedBackendURL] = useState<string>(backendURL);
  function handleClick() {
    props.setBackendURL(backendURL)
    setSavedBackendURL(backendURL);
  }
  return (
    <Section header="Settings">
      {/* <SingleSetting name="S/I">
        <div style={inline}>
          <ClassifierDropdown onModelChange={props.onModelChange} model={props.model} />
          {props.model === INTERACTIVE && <TrainButton />}
        </div>
      </SingleSetting> */}
      <SingleSetting name="Custom backend URL">
        <div style={inline}>
          <Textbox onInput={event => setBackendURL(event.currentTarget.value)} placeholder="www.example.com" value={backendURL} />
          <Button secondary onClick={handleClick} disabled={backendURL === "" || backendURL === savedBackendURL}>{backendURL === savedBackendURL ? "Saved" : "Save"}</Button>
        </div>
      </SingleSetting>
    </Section>
  );
}

function SingleSetting(props: {name: string, children: ComponentChildren}) {
  const spaceBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  return (
    <div style={spaceBetween}>
      <Text>{props.name}</Text>
      {props.children}
    </div>
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
  const { currentUserId, existingLinks, pages, backendURL } = useContext(ApplicationStateContext)!;
  function handleClick() {
    const sendLinks = async () => {
      setStatus("fetching");
      try {
          await sendTrainingData(currentUserId, existingLinks, pages, backendURL);
          setStatus("success");
      } catch (error) {
          setStatus("error");
          throw error;
      }
    }
    sendLinks();
  }
  return (
    <Button onClick={handleClick} loading={status === "fetching"}>T</Button>
  );
}

function Footer(props: {onShowSettings: Function, showSettings: boolean}) {
  const spaceBetween = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  const inline = {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
  }
  return (
    <div style={spaceBetween}>
      <Text muted>Suggested Links v0.0.2</Text>
      <SettingsButton onClick={() => props.onShowSettings()} selected={props.showSettings} />
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
      <Text muted>This might take a couple minutes.</Text>
    </div>
  )
}

export default render(Plugin)
