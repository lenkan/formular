import * as React from 'react'
import { form } from '../../lib'

const styles = {
  textarea: {
    width: '100%'
  }
}

export const ContactForm = form(({ form }) => {
  const name = form.field('name')
  const email = form.field('email')
  const message = form.field('message')

  const errors = {
    name: name.touched && !name.value ? 'Required' : undefined,
    email: email.touched && !email.value ? 'Required' : undefined
  }

  return (
    <form onSubmit={form.handleSubmit}>
      <fieldset>
        <legend>Details</legend>
        <div>
          <label>Name</label><br />
          <input {...name.text()} />
          {errors.name && <span><em>{errors.name}</em></span>}
        </div>
        <div>
          <label htmlFor={email.key}>Email</label><br />
          <input {...email.text()} />
          {errors.email && <span><em>{errors.email}</em></span>}
        </div>
      </fieldset>
      <label htmlFor={message.key}>Message</label><br />
      <textarea {...message.textarea()} rows={25} style={styles.textarea} />
      <button type='submit'>Send</button>
    </form>
  )
})
