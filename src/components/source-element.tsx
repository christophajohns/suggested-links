import {
    Layer,
    IconLayerText16,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent } from 'preact';


interface SourceElementProps {
    textContent: string,
    pageName: string,
}

const SourceElement: FunctionComponent<SourceElementProps> = (props: SourceElementProps) => {
    const { textContent, pageName } = props;
    return (
        <Layer
            icon={<IconLayerText16 />}
            pageName={pageName}
        >
            {textContent}
        </Layer>
    )
}

export default SourceElement;
  