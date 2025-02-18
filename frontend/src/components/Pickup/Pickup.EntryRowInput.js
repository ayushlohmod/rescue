import { CheckIcon } from '@chakra-ui/icons'
import { Flex, IconButton, Input, Select, Text } from '@chakra-ui/react'
import { usePickupContext } from 'components'
import { FOOD_CATEGORIES } from 'helpers'
import { useState } from 'react'

export function EntryRowInput() {
  const { entryRows, setEntryRows, session_storage_key, notes } =
    usePickupContext()
  const [category, setCategory] = useState('')
  const [weight, setWeight] = useState('')

  function addEntryRow() {
    const updatedEntryRows = [...entryRows, { category, weight }]
    setEntryRows(updatedEntryRows)

    sessionStorage.setItem(
      session_storage_key,
      JSON.stringify({
        sessionEntryRows: updatedEntryRows,
        sessionNotes: notes,
      })
    )

    setCategory('')
    setWeight('')
  }

  return (
    <Flex my="4">
      <Select
        size="sm"
        color="element.secondary"
        value={category || ''}
        onChange={e => setCategory(e.target.value)}
        textTransform="capitalize"
        mr="4"
      >
        <option>Select a category...</option>
        {FOOD_CATEGORIES.map(i => (
          <option key={i} value={i} style={{ textTransform: 'capitalize' }}>
            {i.replace('impact_data_', '').replace('_', ' ')}
          </option>
        ))}
      </Select>
      <Input
        size="sm"
        color="element.secondary"
        type="tel"
        min="0"
        maxLength="6"
        w="28"
        value={weight || ''}
        onChange={e => setWeight(parseInt(e.target.value) || '')}
        px="3"
        mr="1"
        textAlign="right"
      />
      <Text mr="8" pt="5px" fontSize="sm" color="element.secondary">
        lbs.
      </Text>
      <IconButton
        icon={<CheckIcon />}
        size="xs"
        borderRadius="xl"
        disabled={!category || !weight}
        onClick={addEntryRow}
      />
    </Flex>
  )
}
