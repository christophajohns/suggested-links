import {
    Inline,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import Accept from './accept';
import Decline from './decline';

interface OptionsProps {
    onAccept: Function,
    onDecline: Function,
}

const Options = (props: OptionsProps) => {
    const { onAccept: handleAccept, onDecline: handleDecline } = props;
    return (
        <Inline>
            <Accept onClick={handleAccept} />
            <Decline onClick={handleDecline} />
        </Inline>
    )
}

export default Options;
  