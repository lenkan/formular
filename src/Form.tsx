import * as React from 'react'
import { form, FormComponentProps } from "./lib/form";

const Form = (props: FormComponentProps) => {
  const { input } = props
  return (
    <form>
      <fieldset>
        <legend>Namn</legend>
        <label htmlFor='first-name'>Förnamn</label>
        <input id='first-name' {...input('firstName')} />
        <label htmlFor='last-name'>Efternamn</label>
        <input id='last-name' {...input('lastName')} />
        <select {...input('gender')}>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </fieldset>
    </form>
  )
}

export default form<{ firstName: string }>(Form)