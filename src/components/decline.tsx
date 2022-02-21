import {
    IconButton,
    IconCross32,
} from '@create-figma-plugin/ui';
import { h } from 'preact';


const Decline = () => {
    return (
        <IconButton value={false}>
            <IconCross32 />
        </IconButton>
    )
}

export default Decline;