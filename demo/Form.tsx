import * as React from 'react'
import { form, FormComponentProps } from '../lib/form'

const Form = (props: FormComponentProps) => {
  const { handleSubmit, field, array } = props
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
        <label htmlFor='first-name'>Efternamn</label>
        <input {...field('first-name').input({ type: 'text' })} />
        <label htmlFor='last-name'>Efternamn</label>
        <input {...field('last-name').input({ type: 'text' })} />
        <select {...field('gender').input({ type: 'select' })} >
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Address</legend>
        <label htmlFor='address.street'>Street</label>
        <input  {...field('address.street').input({ type: 'text' })} />
        <label>ZipCode</label>
        <input  {...field('address.zipcode').input({ type: 'text' })} />
      </fieldset>
      <fieldset>
        <legend>Interests</legend>
        <label htmlFor='next-interest'>Lägg till</label>
        {
          interests.enumerate(({ key, value, index }) => {
            return (
              <div key={key}>
                <input {...field(key).input({ type: 'text' })} />
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
          <input {...nextInterest.input({ type: 'text' })} />
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
        <legend>Status</legend>
        <div>
          <input {...field('status').input({ type: 'checkbox', value: 'bar', exclusive: true })} />
          <label htmlFor='status.bar' >Bar</label>
        </div>
        <div>
          <input {...field('status').input({ type: 'checkbox', value: 'foo', exclusive: true })} />
          <label htmlFor='status.foo' >Foo</label>
        </div>
      </fieldset>
      <fieldset>
        <legend>Status</legend>
        <label htmlFor='statusradio.bar' >Bar</label>
        <input {...field('statusradio').input({ type: 'radio', value: 'bar', exclusive: true })} />
        <label htmlFor='statusradio.foo' >Foo</label>
        <input {...field('statusradio').input({ type: 'radio', value: 'foo', exclusive: true })} />
      </fieldset>
      <fieldset>
        <legend>Nyhetsbrev</legend>
        <input {...field('news').input({ type: 'checkbox' })} />
        <label htmlFor='news'>Jag vill ha nyhetsbrev</label>
      </fieldset>
      <button type='submit'>Spara</button>
    </form>
  )
}

export default form(Form)

