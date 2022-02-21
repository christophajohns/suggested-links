import {
    Inline,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import Accept from './accept';
import Decline from './decline';


const Options = () => {
    return (
        <Inline>
            <Accept />
            <Decline />
        </Inline>
    )
}

export default Options;
  