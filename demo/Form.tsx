import * as React from 'react'
import { form, FormComponentProps } from '../lib/form'

const Form = (props: FormComponentProps) => {
  const { handleSubmit, field, input, array } = props

  return (
    <form onSubmit={handleSubmit}>
      <section>
        <h6>
          Hallo, {field('first-name').value}
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
          array('interests').enumerate(({ key, value }) => {
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
              const next = field('next-interest')
              array('interests').push(next.value)
              next.change('')
            }}>
            {'+'}
          </button>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status</legend>
        <div>
          <input {...input.checkbox('status', 'bar')} />
          <label htmlFor='status.bar' >Bar</label>
        </div>
        <div>
          <input {...input.checkbox('status', 'foo')} />
          <label htmlFor='status.foo' >Foo</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status</legend>
        <label htmlFor='statusradio.bar' >Bar</label>
        <input {...input.radio('statusradio', 'bar')} />
        <label htmlFor='statusradio.foo' >Foo</label>
        <input {...input.radio('statusradio', 'foo')} />
      </fieldset>
      <fieldset>
        <legend>Nyhetsbrev</legend>
        <input {...input.checkbox('news')} />
        <label htmlFor='news'>Jag vill ha nyhetsbrev</label>
      </fieldset>
      <button type='submit'>Spara</button>
    </form>
  )
}

export default form(Form)

