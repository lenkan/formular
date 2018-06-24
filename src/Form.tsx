import * as React from 'react'
import { form, FormComponentProps } from "./lib/form";

type Person = {
  firstName: string,
  lastName: string,
  gender: 'male' | 'female',
  address: {
    street: string,
    zipcode: number
  }
}


const Form = (props: FormComponentProps<Person>) => {
  const { fields } = props
  
  return (
    <form>
      <fieldset>
        <legend>Namn</legend>
        <label htmlFor='first-name'>Förnamn</label>
        <input id='first-name' {...fields.firstName.input} />
        <label htmlFor='last-name'>Efternamn</label>
        <input id='last-name' {...fields.lastName.input} />
        <select {...fields.gender.input}>
          <option value='male'>Male</option>
          <option value='female'>Female</option>
        </select>
      </fieldset>
      <fieldset>
        <legend>Address</legend>
        <label>Street</label>
        <input  {...fields.address.street.input} />
      </fieldset>
    </form>
  )
}

export default form<{ firstName: string }>(Form)