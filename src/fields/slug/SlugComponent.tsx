'use client'
import type { TextFieldClientProps } from 'payload'

import {
  FieldLabel,
  TextInput,
  useField,
  useFormFields,
} from '@payloadcms/ui'

import React, { useCallback, useEffect } from 'react'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
} & TextFieldClientProps

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath,
}) => {
  const { label } = field
  const { value, setValue } = useField<string>({ path: 'slug' })
  const { value: checkboxValue, setValue: setCheckboxValue } = useField<boolean>({
    path: checkboxFieldPath,
  })

  const targetFieldValue = useFormFields(([fields]) => {
    return (fields[fieldToUse]?.value as string) || ''
  })

  useEffect(() => {
    if (checkboxValue) {
      const formattedSlug = targetFieldValue
        ?.replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase()

      if (value !== formattedSlug) setValue(formattedSlug)
    }
  }, [targetFieldValue, checkboxValue, setValue, value])

  const handleLock = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setCheckboxValue(!checkboxValue)
    },
    [checkboxValue, setCheckboxValue],
  )

  return (
    <div className="field-type slug-field-component">
      <div className="label-wrapper">
        <FieldLabel label={label} />
        <button
          className="lock-button"
          onClick={handleLock}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0 5px',
          }}
          type="button"
        >
          {checkboxValue ? '🔒' : '🔓'}
        </button>
      </div>
      <TextInput
        onChange={setValue}
        path="slug"
        readOnly={checkboxValue}
        value={value}
      />
    </div>
  )
}
