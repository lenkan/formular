import { ContactForm } from './ContactForm'
import { Form } from './Form'
import { RegisterForm } from './RegisterForm'

export type FormType = 'contactForm' | 'form' | 'registerForm'
export type FormSpec = { component: any, code: string, type: FormType }

export const contactForm : FormSpec = {
  component: ContactForm,
  type: 'contactForm',
  code: `
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

`
}


export const form : FormSpec = {
  component: Form,
  type: 'form',
  code: `
import * as React from 'react'
import { form } from '../../lib/form'

const Checkbox = ({ label, input }) => {
  return (
    <React.Fragment>
      <input {...input} />
      <label htmlFor={input.id}>{label}</label>
    </React.Fragment>
  )
}

const Radio = ({ label, input }) => {
  return (
    <React.Fragment>
      <input {...input} />
      <label htmlFor={input.id}>{label}</label>
    </React.Fragment>
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

const SelectInput = ({ label, input, children }) => {
  return (
    <React.Fragment>
      <label htmlFor={input.id}>{label}</label>
      <select {...input}>
        {children}
      </select>
    </React.Fragment>
  )
}

export const Form = form(props => {
  const { form: { handleSubmit, field, array } } = props
  const interests = array('interests')
  const nextInterest = field('next-interest')

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h6>
          Hallo, {field('first-name').value}
        </h6>
      </section>
      <fieldset>
        <legend>Namn</legend>
        <TextInput label='First name' input={field('first-name').text()} />
        <TextInput label='Last name' input={field('last-name').text()} />
        <SelectInput label='Gender' input={field('gender').select()} >
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </SelectInput>
      </fieldset>
      <fieldset>
        <legend>Address</legend>
        <TextInput label='Street' input={field('address.street').text()} />
        <TextInput label='ZipCode' input={field('address.zipcode').text()} />
      </fieldset>
      <fieldset>
        <legend>Interests</legend>
        <label htmlFor='next-interest'>Lägg till</label>
        {
          interests.map((field, index) => {
            return (
              <div key={field.key}>
                <input {...field.text()} />
                <button type='button'
                  onClick={() => {
                    interests.remove(index)
                  }}>
                  {'-'}
                </button>
              </div>
            )
          })
        }
        <div>
          <input {...nextInterest.text()} />
          <button type="button"
            onClick={() => {
              interests.push(nextInterest.value)
              nextInterest.change('')
            }}>
            {'+'}
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Checkboxes</legend>
        <div>
          <Checkbox label='Bar' input={field('checkbox').checkbox({ value: 'bar' })} />
        </div>
        <div>
          <Checkbox label='Foo' input={field('checkbox').checkbox({ value: 'foo' })} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Radio toggle</legend>
        <div>
          <Radio label='Bar' input={field('radio').radio({ value: 'bar' })} />
        </div>
        <div>
          <Radio label='Foo' input={field('radio').radio({ value: 'foo' })} />
        </div>
      </fieldset>
      <fieldset>
        <legend>Nyhetsbrev</legend>
        <input {...field('news').checkbox({})} />
        <label htmlFor='news'>Jag vill ha nyhetsbrev</label>
      </fieldset>
      {
        field('news').value && (
          <fieldset>
            <legend>Vadå?</legend>
          </fieldset>
        )
      }
      <button type='submit'>Spara</button>
    </form>
  )
})

`
}


export const registerForm : FormSpec = {
  component: RegisterForm,
  type: 'registerForm',
  code: `
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

`
}

export const forms = [contactForm, form, registerForm]