import React, { useState, useEffect } from 'react'
import './Input.scss'

export function Input({
  element_id,
  type,
  label,
  value,
  onChange,
  suggestions = [],
  onSuggestionClick,
  style,
  animation = true,
}) {
  const [isUsed, setIsUsed] = useState(false)
  const isDate = () => type === 'datetime-local'

  useEffect(() => {
    setIsUsed(!!value)
  }, [value])

  return (
    <>
      <div className={`Input ${animation ? 'animation' : ''}`} style={style}>
        <label className={isUsed || isDate() ? 'focused' : ''}>{label}</label>
        {type === 'textarea' ? (
          <textarea
            id={element_id}
            autoComplete="new-password" //prevent autoComplete
            name="no" //prevent autoComplete
            rows={10}
            onChange={onChange}
            value={value}
            onFocus={() => setIsUsed(true)}
            onBlur={e => {
              setIsUsed(e.target.value.length ? true : false)
            }}
          />
        ) : type === 'select' ? (
          <select
            id={element_id}
            value={value}
            onChange={onSuggestionClick}
            onClick={() => setIsUsed(true)}
          >
            <option value={null}></option>
            {suggestions.map(s => (
              <option key={s.id || s} id={s.id || s} value={s.id || s}>
                {s.address1
                  ? `${s.name} (${s.address1}, ${s.city}, ${s.state}, ${s.zip_code})`
                  : s}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={element_id}
            autoComplete="off" //prevent autoComplete
            name="no" //prevent autoComplete
            type={type}
            // type="search"
            onChange={onChange}
            value={value}
            onFocus={!isDate() ? () => setIsUsed(true) : null}
            onBlur={
              !isDate()
                ? e => {
                    setIsUsed(e.target.value.length ? true : false)
                  }
                : null
            }
          />
        )}
      </div>
      {type === 'text' && suggestions.length ? (
        <ul className="InputSuggestions">
          {suggestions.map(s => (
            <li key={s.id} id={s.id} onClick={e => onSuggestionClick(e, s)}>
              {s.name}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}
