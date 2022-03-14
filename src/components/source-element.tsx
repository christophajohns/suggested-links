import {
    Layer,
    IconLayerText16,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';

const layerStyle = {
    display: "flex",
    gap: "8px",
    width: "100%",
    padding: "4px",
};

const textStyle = {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
}

const iconStyle = {
    height: "16px",
    width: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

function FrameLayer(props: {name: string}) {
    return (
        <div style={layerStyle}><div style={iconStyle}><IconLayerFrame16 /></div><div style={textStyle}>{props.name}</div></div>
    );
}

function TextLayer(props: {onClick: Function, name: string}) {
    const { onClick: handleClick } = props;
    return (
        <div style={layerStyle} onClick={() => handleClick()}><div style={iconStyle}><IconLayerText16 /></div><div style={textStyle}>{props.name}</div></div>
    );
}

interface SourceElementProps {
    textContent: string,
    parentName: string,
    onClick: Function,
}

const SourceElement: FunctionComponent<SourceElementProps> = (props: SourceElementProps) => {
    const { textContent, parentName, onClick: handleClick } = props;
    const style = {
        display: "flex",
        flexDirection: "column",
    };
    return (
        <div style={style}>
            <FrameLayer name={parentName} />
            <TextLayer onClick={() => handleClick()} name={textContent} />
        </div>
    );
}

export default SourceElement;
  