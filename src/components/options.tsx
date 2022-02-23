import {
    Inline,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { MinimalLink } from '../types';
import Accept from './accept';
import Decline from './decline';

const Options = (props: MinimalLink) => {
    return (
        <Inline>
            <Accept {...props} />
            <Decline />
        </Inline>
    )
}

export default Options;
  