import { h, FunctionComponent } from 'preact';
import { Link, REMOVE } from '../types';
import LinkPreview from './link-preview';
import Section from './section';


interface RemoveLinksProps {
  links: Link[],
}

const RemoveLinks: FunctionComponent<RemoveLinksProps> = (props: RemoveLinksProps) => {
  const { links } = props;
  return (
      <Section header="Remove links">
          {links.map(link => (
              <LinkPreview link={link} mode={REMOVE} />
          ))}
      </Section>
  )
}

export default RemoveLinks;
