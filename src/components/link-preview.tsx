import {
    Text,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { Link, ADD } from '../types';
import SourceElement from './source-element';
import TargetFrame from './target-frame';
import Options from './options';


interface LinkPreviewProps {
    link: Link,
    mode: "ADD" | "UPDATE" | "REMOVE",
}

const LinkPreview = (props: LinkPreviewProps) => {
    const { link, mode } = props;
    const { source, target } = link;
    const style = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    };
    return (
        <div style={style}>
            <SourceElement textContent={source.name}/>
            <Text muted>{mode === ADD ? "→" : "—"}</Text>
            <TargetFrame frameName={target.name} isRemove={mode !== ADD} />
            <Options sourceId={source.id} targetId={target.id} />
        </div>
    )
}

export default LinkPreview;
  