import {
    Inline,
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
    return (
        <Inline space="medium">
            <SourceElement pageName="Start" textContent={source} />
            <Text muted>{mode === ADD ? "→" : "—"}</Text>
            <TargetFrame pageName={target} isRemove={mode !== ADD} />
            <Options />
        </Inline>
    )
}

export default LinkPreview;
  