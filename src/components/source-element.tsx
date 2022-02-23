import {
    Layer,
    IconLayerText16,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


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
            <Layer icon={<IconLayerFrame16 />}>{parentName}</Layer>
            <Layer icon={<IconLayerText16 />} onClick={() => handleClick()}>{textContent}</Layer>
        </div>
    );
}

export default SourceElement;
  