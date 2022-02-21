import {
  Button,
  Container,
  render,
  VerticalSpace,
  Text
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback } from 'preact/hooks'
import { InsertConnectionHandler } from './types'


function Plugin() {
  const source = "SOURCE_NODE_ID"
  const target = "TARGET_NODE_ID"
  const handleInsertConnectionButtonClick = useCallback(
    function () {
      emit<InsertConnectionHandler>('INSERT_CONNECTION', source, target)
    },
    [source, target]
  )
  return (
    <Container>
      <VerticalSpace space="small" />
      <Text>Click the button below to generate a list of suggested links based on the current page.</Text>
      <VerticalSpace space="large" />
      <Button fullWidth onClick={handleInsertConnectionButtonClick}>
        Generate suggested links
      </Button>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
