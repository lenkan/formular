import * as React from 'react'
import { form } from '../../lib/form'

const Checkbox = ({ label, input }) => {
  return (
    <div>
      <input {...input} />
      <label htmlFor={input.id}>{label}</label>
    </div>
  )
}

const Radio = ({ label, input }) => {
  return (
    <div>
      <input {...input} />
      <label htmlFor={input.id}>{label}</label>
    </div>
  )
}

const TextInput = ({ label, input }) => {
  return (
    <React.Fragment>
      <label htmlFor={input.id}>{label}</label>
      <input {...input} />
    </React.Fragment>
  )
}

/**
 * The library makes no assumptions on how you want to validate
 * your input. This shows one of many approaches where we validate
 * an "error" object and returns undefined if no error properties are set
 */
function validate(obj) {
  if (typeof obj === 'object') {
    const result = Object.keys(obj)
      .reduce((res, key) => {
        const value = validate(obj[key])
        return value !== undefined ? {
          ...res,
          [key]: value
        } : res
      }, {})
    return Object.keys(result).length > 0 ? result : undefined
  }
  return obj
}

export const RegisterForm = form(props => {
  const { form: { handleSubmit, field } } = props
  const gender = field('gender')
  const firstName = field('first-name')
  const lastName = field('last-name')
  const interests = field('interests')

  const errors = {
    interests: interests.value === undefined || interests.value.length < 3
      ? 'Select at least three interests'
      : undefined
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend>Namn</legend>
        <TextInput label='First name' input={firstName.text()} />
        <TextInput label='Last name' input={lastName.text()} />
      </fieldset>
      <fieldset>
        <legend>Gender</legend>
        <Radio label='Male' input={gender.radio({ value: 'male' })} />
        <Radio label='Female' input={gender.radio({ value: 'female' })} />
        <Radio label='Other' input={gender.radio({ value: 'other' })} />
      </fieldset>
      <fieldset>
        <legend>Interests</legend>
        <Checkbox label='Sports' input={interests.checkbox({ value: 'sports' })} />
        <Checkbox label='Movies' input={interests.checkbox({ value: 'movies' })} />
        <Checkbox label='Travel' input={interests.checkbox({ value: 'travel' })} />
        <Checkbox label='Books' input={interests.checkbox({ value: 'books' })} />
        <Checkbox label='Music' input={interests.checkbox({ value: 'music' })} />
        {
          errors.interests && (
            <span><em>Select at least three interests</em></span>
          )
        }
      </fieldset>
      <fieldset>
        <legend>Newsletter</legend>
        <input {...field('news').checkbox()} />
        <label htmlFor='news'>Subscribe to the newsletter</label>
      </fieldset>
      <button type='submit' disabled={!!validate(errors)}>Register</button>
    </form>
  )
})
