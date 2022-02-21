import {
    Inline,
    Stack,
    Text,
    VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent, ComponentChildren } from 'preact';


interface SectionProps {
    header: string,
    children: ComponentChildren,
}

const Section: FunctionComponent<SectionProps> = (props: SectionProps) => {
    const { header, children } = props;
    return (
        <div>
            <Inline space="small">
                <Text bold>{header}</Text>
                <Text><a href="#">Accept all</a></Text>
            </Inline>
            <VerticalSpace space="extraSmall" />
            <Stack space="extraSmall">
                {children}
            </Stack>
        </div>
    )
}

export default Section;
  