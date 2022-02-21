import {
  Stack,
} from '@create-figma-plugin/ui'
import { h } from 'preact'
import AddLinks from './add-links'
import UpdateLinks from './update-links'
import RemoveLinks from './remove-links'
import { Link } from '../types'

const linksJSON = `
[
  {
      "source": "SOME_SOURCE_ID",
      "target": "SOME_TARGET_ID"
  }
]
`;
const links: Link[] = JSON.parse(linksJSON);

function SuggestedLinks() {
  return (
    <Stack space="extraLarge">
      <AddLinks links={links} />
      <UpdateLinks links={links} />
      <RemoveLinks links={links} />
    </Stack>
  )
}
  
  
export default SuggestedLinks
  