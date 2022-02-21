import { h, FunctionComponent } from 'preact';
import { Link, ADD } from '../types';
import LinkPreview from './link-preview';
import Section from './section';


interface AddLinksProps {
    links: Link[],
}

const AddLinks: FunctionComponent<AddLinksProps> = (props: AddLinksProps) => {
    const { links } = props;
    return (
        <Section header="Add links">
            {links.map(link => (
                <LinkPreview link={link} mode={ADD} />
            ))}
        </Section>
    )
}

export default AddLinks;
  