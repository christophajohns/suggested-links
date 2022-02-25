import {
    Layer,
    IconLayerText16,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


function FrameLayer(props: {name: string}) {
    return (
        <Layer icon={<IconLayerFrame16 />}>{props.name}</Layer>
    );
}

function TextLayer(props: {onClick: Function, name: string}) {
    const { onClick: handleClick } = props;
    return (
        <Layer icon={<IconLayerText16 />} onClick={() => handleClick()}>{props.name}</Layer>
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
  