import {
    IconButton,
    IconOptionCheck16,
} from '@create-figma-plugin/ui';
import { h } from 'preact';

interface AcceptProps {
    onClick: Function,
}

const Accept = (props: AcceptProps) => {
    const { onClick: handleClick } = props;
    return (
        <IconButton value={false} onClick={() => handleClick()}>
            <IconOptionCheck16 />
        </IconButton>
    )
}

export default Accept;