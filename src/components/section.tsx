import {
    Props,
    Stack,
    Text,
    VerticalSpace,
} from '@create-figma-plugin/ui';
import { h, FunctionComponent, ComponentChildren } from 'preact';


interface SectionProps {
    header: string,
    children: ComponentChildren,
}

const Section: FunctionComponent<Props<HTMLDivElement,SectionProps>> = (props: Props<HTMLDivElement,SectionProps>) => {
    const { header, children } = props;
    return (
        <div {...props}>
            <Text bold>{header}</Text>
            <VerticalSpace space="extraSmall" />
            <Stack space="extraSmall">
                {children}
            </Stack>
        </div>
    )
}

export default Section;
  