import * as React from 'react'
import { form, FormComponentProps } from '../lib/form'

const Form = (props: FormComponentProps) => {
  const { handleSubmit, input, value, enumerate, push, meta, change } = props

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h6>
          Hallo, {value('first-name')}
        </h6>
      </section>
      <fieldset>
        <legend>Namn</legend>
        <label htmlFor='first-name'>Efternamn</label>
        <input {...input.text('first-name')} />
        <label htmlFor='last-name'>Efternamn</label>
        <input {...input.text('last-name')} />
        <select {...input.select('gender')} >
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Address</legend>
        <label htmlFor='address.street'>Street</label>
        <input  {...input.text('address.street')} />
        <label>ZipCode</label>
        <input  {...input.text('address.zipcode')} />
      </fieldset>
      <fieldset>
        <legend>Interests</legend>
        <label htmlFor='next-interest'>Lägg till</label>
        {
          enumerate('interests', ({ key, value }) => {
            return (
              <div key={key}>
                <input key={key} {...input.text(key)} />
              </div>
            )
          })
        }
        <div>
          <input {...input.text('next-interest')} />
          <button type="button"
            onClick={() => {
              push('interests', value('next-interest'))
              change('next-interest', '')
            }}>
            {'+'}
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status</legend>
        <div>
          <input type='checkbox' {...input.selection('status', 'bar')} />
          <label htmlFor='status.bar' >Bar</label>
        </div>
        <div>
          <input type='checkbox' {...input.selection('status', 'foo')} />
          <label htmlFor='status.foo' >Foo</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status</legend>
        <label htmlFor='statusradio.bar' >Bar</label>
        <input type='radio' {...input.selection('statusradio', 'bar')} />
        <label htmlFor='statusradio.foo' >Foo</label>
        <input type='radio' {...input.selection('statusradio', 'foo')} />
      </fieldset>
      <fieldset>
        <legend>Nyhetsbrev</legend>
        <input type='checkbox' {...input.toggle('news')} />
        <label htmlFor='news'>Jag vill ha nyhetsbrev</label>
      </fieldset>
      <button type='submit'>Spara</button>
    </form>
  )
}

export default form(Form)

