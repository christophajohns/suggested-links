import {
    Layer,
    IconLayerFrame16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';
import styles from '../styles.css';


interface TargetFrameProps {
    pageName: string,
    isRemove?: boolean,
}

const TargetFrame: FunctionComponent<TargetFrameProps> = (props: TargetFrameProps) => {
    const { pageName, isRemove = false } = props;
    return (
        <Layer
            icon={<IconLayerFrame16 />}
        >
            {pageName}
        </Layer>
    )
}

export default TargetFrame;
  