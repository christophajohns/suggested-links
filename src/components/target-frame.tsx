import {
    Layer,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


interface TargetFrameProps {
    frameName: string,
    isRemove?: boolean,
}

const TargetFrame: FunctionComponent<TargetFrameProps> = (props: TargetFrameProps) => {
    const { frameName, isRemove = false } = props;
    return (
        <Layer
            icon={<IconLayerFrame16 />}
        >
            {frameName}
        </Layer>
    )
}

export default TargetFrame;
  