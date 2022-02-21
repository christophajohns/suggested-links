import {
  Container,
  render,
  VerticalSpace,
  Text,
} from '@create-figma-plugin/ui'
import { h } from 'preact'
import SuggestedLinks from './components/suggested-links'

interface Link {
  source: {
    id: string,
    name: string,
  },
  target: {
    id: string,
    name: string,
  },
}

interface PluginProps {
  suggestedLinks: {
    linksToAdd: Link[],
    linksToUpdate: Link[],
    linksToRemove: Link[],
  },
}

function Plugin(props: PluginProps) {
  const { suggestedLinks } = props;
  return (
    <Container>
      <VerticalSpace space="small" />
      <SuggestedLinks links={suggestedLinks} />
      <VerticalSpace space="extraLarge" />
      <Text muted>Suggested Links v0.0.1</Text>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
