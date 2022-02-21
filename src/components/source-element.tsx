import {
    Layer,
    IconLayerText16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


interface SourceElementProps {
    textContent: string,
}

const SourceElement: FunctionComponent<SourceElementProps> = (props: SourceElementProps) => {
    const { textContent } = props;
    return <Layer icon={<IconLayerText16 />}>{textContent}</Layer>
}

export default SourceElement;
  