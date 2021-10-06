import React, { useEffect, useState } from 'react'
import { Input } from 'components'
import { updateFieldSuggestions, formFields } from './utils'
import { useFirestore } from 'hooks'
import { Spacer, Text } from '@sharingexcess/designsystem'

export function EditPickup({ handleSubmit, title }) {
  const organizations = useFirestore('organizations')
  const locations = useFirestore('locations')
  const [formData, setFormData] = useState({
    // Any field used as an input value must be an empty string
    // others can and should be initialized as null
    org_name: '',
    org_id: null,
    location_id: '',
  })
  const [suggestions, setSuggestions] = useState({
    // these will populate the dropdown suggestions for each input
    org_name: [],
    org_id: [],
    location_id: [],
  })

  useEffect(() => {
    if (formData.org_id && formData.location_id) {
      handleSubmit(formData)
    }
  }, [formData, handleSubmit])

  function handleChange(e, field) {
    if (field.suggestionQuery) {
      updateFieldSuggestions(
        e.target.value,
        field.id === 'org_name' ? organizations : locations,
        field,
        suggestions,
        setSuggestions
      )
    }
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  function handleSelect(e, selected, field) {
    if (field.type !== 'select') {
      setSuggestions({ ...suggestions, [field.id]: null })
    }
    const updated_fields = field.handleSelect(selected)
    updated_fields && setFormData({ ...formData, ...updated_fields })
  }

  function renderFieldInput(field) {
    if (!field.preReq || formData[field.preReq]) {
      if (field.loadSuggestionsOnInit && !formData[field.id]) {
        const updatedSuggestions = updateFieldSuggestions(
          formData[field.preReq],
          field.id === 'org_name' ? organizations : locations,
          field,
          suggestions,
          setSuggestions
        )
        if (updatedSuggestions && updatedSuggestions.length === 1) {
          handleSelect(null, updatedSuggestions[0], field)
        }
      }

      function handleDropdownSelect(e) {
        handleSelect(
          e,
          suggestions[field.id].find(s => s.id === e.target.value),
          field
        )
      }

      return (
        <Input
          key={field.id}
          element_id={field.id}
          type={field.type}
          label={field.label}
          value={formData[field.id]}
          onChange={e => handleChange(e, field)}
          suggestions={suggestions[field.id]}
          onSuggestionClick={
            field.type === 'select'
              ? handleDropdownSelect
              : (e, s) => handleSelect(e, s, field)
          }
        />
      )
    }
  }

  return (
    <div id="EditPickup">
      {title !== '' && (
        <>
          <Spacer height={16} />
          <Text type="section-header" color="white" shadow>
            {title || 'Add a Pickup'}
          </Text>
          <Spacer height={8} />
          <Text type="paragraph" color="white" shadow>
            Choose a partner organization and location to rescue food.
          </Text>
        </>
      )}
      {formFields.map(f => renderFieldInput(f))}
    </div>
  )
}
