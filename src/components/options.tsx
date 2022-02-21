import {
    Inline,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import Accept from './accept';
import Decline from './decline';

interface OptionsProps {
    sourceId: string,
    targetId: string,
}

const Options = (props: OptionsProps) => {
    return (
        <Inline>
            <Accept {...props} />
            <Decline />
        </Inline>
    )
}

export default Options;
  