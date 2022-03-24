import {
    Layer,
    IconLayerText16,
    IconLayerFrame16,
    IconLayerEllipse16,
    IconLayerGroup16,
    IconLayerImage16,
    IconLayerInstance16,
    IconLayerLine16,
    IconLayerRectangle16,
    IconLayerVector16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


function FrameLayer(props: {name: string}) {
    return (
        <Layer icon={<IconLayerFrame16 />}>{props.name}</Layer>
    );
}

function SourceLayer(props: {onClick: Function, name: string, type: string}) {
    const { type, onClick: handleClick } = props;
    let icon = <IconLayerFrame16 />
    switch (type) {
        case "ELLIPSE":
            icon = <IconLayerEllipse16 />
            break;
        case "GROUP":
            icon = <IconLayerGroup16 />
            break;
        case "INSTANCE":
            icon = <IconLayerInstance16 />
            break;
        case "LINE":
            icon = <IconLayerLine16 />
            break;
        case "POLYGON" || "VECTOR" || "STAR":
            icon = <IconLayerVector16 />
            break;
        case "RECTANGLE":
            icon = <IconLayerRectangle16 />
            break;
        case "TEXT":
            icon = <IconLayerText16 />
            break;
        case "IMAGE":
            icon = <IconLayerImage16 />
    }
    return (
        <Layer icon={icon} onClick={() => handleClick()}>{props.name}</Layer>
    );
}

interface SourceElementProps {
    textContent: string,
    parentName: string,
    type: string,
    onClick: Function,
}

const SourceElement: FunctionComponent<SourceElementProps> = (props: SourceElementProps) => {
    const { textContent, parentName, type, onClick: handleClick } = props;
    const style = {
        display: "flex",
        flexDirection: "column",
    };
    return (
        <div style={style}>
            <FrameLayer name={parentName} />
            <SourceLayer type={type} onClick={() => handleClick()} name={textContent} />
        </div>
    );
}

export default SourceElement;
  