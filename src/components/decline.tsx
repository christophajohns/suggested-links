import {
    IconButton,
    IconCross32,
} from '@create-figma-plugin/ui';
import { h } from 'preact';

interface DeclineProps {
    onClick: Function,
}

const Decline = (props: DeclineProps) => {
    const { onClick: handleClick } = props;
    return (
        <IconButton value={false} onClick={() => handleClick()}>
            <IconCross32 />
        </IconButton>
    )
}

export default Decline;