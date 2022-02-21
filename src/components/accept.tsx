import {
    IconButton,
    IconOptionCheck16,
} from '@create-figma-plugin/ui';
import { h } from 'preact';


const Accept = () => {
    return (
        <IconButton value={false}>
            <IconOptionCheck16 />
        </IconButton>
    )
}

export default Accept;