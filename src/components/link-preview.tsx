import {
    Text,
    Banner,
    IconOptionCheck16,
    IconCross32,
} from '@create-figma-plugin/ui';
import { h } from 'preact';
import { Link } from '../types';
import { ADD, ADD_LINK, UPDATE_LINK, REMOVE_LINK, UPDATE, FOCUS_NODE } from '../constants';
import SourceElement from './source-element';
import TargetFrame from './target-frame';
import Options from './options';
import { getFullLinkInfo, truncate, updateModel } from '../utils';
import { useContext, useState } from 'preact/hooks';
import { emit } from '@create-figma-plugin/utilities';
import { ApplicationStateContext } from '../ui';

interface LinkPreviewProps {
    link: Link,
    mode: "ADD" | "UPDATE" | "REMOVE",
}

const ACCEPTED = "accepted";
const DECLINED = "declined";

const LinkPreview = (props: LinkPreviewProps) => {
    const { link, mode } = props;
    const { source, target } = link;
    const applicationState = useContext(ApplicationStateContext);
    const { pages, currentUserId, backendURL } = applicationState!;
    const [feedback, setFeedback] = useState<string | null>(null);
    const handleAccept = () => {
        setFeedback(ACCEPTED);
        const fullLinkInfo = getFullLinkInfo(link, pages);
        if (mode === ADD || mode === UPDATE) {
            if (mode === ADD) {
                emit(ADD_LINK, fullLinkInfo);
            } else if (mode === UPDATE) {
                emit(UPDATE_LINK, fullLinkInfo);
            }
            updateModel(currentUserId, fullLinkInfo, true, backendURL);
        } else {
            emit(REMOVE_LINK, fullLinkInfo);
            updateModel(currentUserId, fullLinkInfo, false, backendURL);
        }
    }
    const handleDecline = () => {
        setFeedback(DECLINED);
        const fullLinkInfo = getFullLinkInfo(link, pages);
        if (mode === ADD || mode === UPDATE) {
            updateModel(currentUserId, fullLinkInfo, false, backendURL);
        } else {
            updateModel(currentUserId, fullLinkInfo, true, backendURL);
        }
    }
    const handleSourceClick = () => {
        emit(FOCUS_NODE, source.id);
    }
    const handleTargetClick = () => {
        emit(FOCUS_NODE, target.id);
    }
    
    if (feedback === ACCEPTED) {
        return <Banner style={{backgroundColor: "var(--color-green)"}} icon={<IconOptionCheck16 />}>Great! Dutifully noted.</Banner>
    }

    if (feedback === DECLINED) {
        return <Banner style={{backgroundColor: "var(--color-red)"}} icon={<IconCross32 />}>Got it. Thank you for your input!</Banner>
    }

    const style = {
        display: "grid",
        gridTemplateColumns: "33% 1fr 33% 60px",
        gap: "12px",
        alignItems: "center",
    };

    return (
        <div style={style}>
            <SourceElement type={source.type} textContent={truncate(source.name)} parentName={truncate(source.parent.name)} onClick={handleSourceClick}/>
            <Text muted>{mode === ADD ? "→" : "—"}</Text>
            <TargetFrame frameName={truncate(target.name)} isRemove={mode !== ADD} onClick={handleTargetClick} />
            <Options onAccept={handleAccept} onDecline={handleDecline}/>
        </div>
    )
}

export default LinkPreview;
  