import * as React from 'react'
import { forms, FormType, FormSpec } from './forms'


interface AppState {
  form: FormType | ''
}

export class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      form: ''
    }
  }

  render() {
    const form = forms.find(f => f.type === this.state.form)
    return (
      <React.Fragment>
        <nav>
          {
            forms.map(form => {
              return (
                <button key={form.type} onClick={() => this.setState({ form: form.type })}>
                  {form.type.toUpperCase()}
                </button>
              )
            })
          }
        </nav>
        <section>
          {
            form && form.code && (
              <pre>
                <code>
                  {form.code}
                </code>
              </pre>
            )
          }
          {
            form && form.component && <form.component onSubmit={values => console.log(JSON.stringify(values))} />
          }
        </section>
      </React.Fragment>
    )
  }
}
