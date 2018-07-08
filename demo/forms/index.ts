import { ContactForm } from './ContactForm'
import { Form } from './Form'

export type FormType = 'contactForm' | 'form'
export type FormSpec = { component: any, code: string, type: FormType }

export const contactForm : FormSpec = {
  component: ContactForm,
  type: 'contactForm',
  code: `
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

export const forms = [contactForm, form]