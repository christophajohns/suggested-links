import {
    Layer,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


interface TargetFrameProps {
    frameName: string,
    isRemove?: boolean,
    onClick: Function,
}

const TargetFrame: FunctionComponent<TargetFrameProps> = (props: TargetFrameProps) => {
    const { frameName, isRemove = false, onClick: handleClick } = props;
    return (
        <Layer
            icon={<IconLayerFrame16 />}
            onClick={() => handleClick()}
        >
            {frameName}
        </Layer>
    )
}

export default TargetFrame;
  