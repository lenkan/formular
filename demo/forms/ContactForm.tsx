import * as React from 'react'
import { form, FormComponentProps } from '../../lib'

export const ContactForm = form(props => {
  const name = props.form.field('name')
  const email = props.form.field('email')
  const message = props.form.field('message')
  return (
    <form onSubmit={props.form.handleSubmit}>
      <fieldset>
        <legend>Details</legend>
        <div>
          <label>Name</label>
          <input {...name.text()} />
        </div>
        <div>
          <label htmlFor={email.key}>Email</label>
          <input {...email.text()} />
        </div>
      </fieldset>
      <label htmlFor={message.key}>Message</label>
      <textarea {...message.textarea()} />
      <button type='submit'>Send</button>
    </form>
  )
})
