import {
    IconButton,
    IconOptionCheck16,
} from '@create-figma-plugin/ui';
import { emit } from '@create-figma-plugin/utilities';
import { h } from 'preact';

interface AcceptProps {
    sourceId: string,
    targetId: string,
}

const Accept = (props: AcceptProps) => {
    const { sourceId, targetId } = props;
    const handleClick = () => {
        const data = { sourceId, targetId };
        emit("ADD_LINK", data);
    }

    return (
        <IconButton value={false} onClick={handleClick}>
            <IconOptionCheck16 />
        </IconButton>
    )
}

export default Accept;