import { h, FunctionComponent } from 'preact';
import { Link } from '../types';
import { UPDATE } from '../constants';
import LinkPreview from './link-preview';
import Section from './section';


interface UpdateLinks {
  links: Link[],
}

const UpdateLinks: FunctionComponent<UpdateLinks> = (props: UpdateLinks) => {
  const { links } = props;
  return (
      <Section header="Update links">
          {links.map(link => (
              <LinkPreview link={link} mode={UPDATE} />
          ))}
      </Section>
  )
}

export default UpdateLinks;
