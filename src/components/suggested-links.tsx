import {
  Stack,
  Text,
} from '@create-figma-plugin/ui'
import { h } from 'preact'
import AddLinks from './add-links'
import UpdateLinks from './update-links'
import RemoveLinks from './remove-links'
import { Link } from '../types'

interface SuggestedLinksProps {
  links: {
    linksToAdd: Link[],
    linksToUpdate: Link[],
    linksToRemove: Link[],
  },
}

function SuggestedLinks(props: SuggestedLinksProps) {
  const { links } = props;
  const { linksToAdd, linksToUpdate, linksToRemove } = links;

  if (!linksToAdd.length && !linksToUpdate.length && !linksToRemove.length) {
    return (
      <Text>All looking good!</Text>
    )
  }

  return (
    <Stack space="extraLarge">
      {linksToAdd.length > 0 && <AddLinks links={linksToAdd} />}
      {linksToUpdate.length > 0 && <UpdateLinks links={linksToUpdate} />}
      {linksToRemove.length > 0 && <RemoveLinks links={linksToRemove} />}
    </Stack>
  )
}
  
  
export default SuggestedLinks
  