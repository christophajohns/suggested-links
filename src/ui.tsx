import {
  Container,
  render,
  VerticalSpace,
  Text,
} from '@create-figma-plugin/ui'
import { h } from 'preact'
import SuggestedLinks from './components/suggested-links'


function Plugin() {
  return (
    <Container>
      <VerticalSpace space="small" />
      <SuggestedLinks />
      <VerticalSpace space="extraLarge" />
      <Text muted>Suggested Links v0.0.1</Text>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
