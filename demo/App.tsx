import * as React from 'react'
import { forms, FormType, FormSpec } from './forms'


interface AppState {
  form: FormType | '',
  showCode: boolean
}

export class App extends React.Component<{}, AppState> {
  constructor(props) {
    super(props)
    this.state = {
      form: '',
      showCode: false
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
        {
          form && (
            <section>
              <header>
                <h1>{form.type.toUpperCase()}</h1>
                <button onClick={() => this.setState({ showCode: false })}>{'Visa formulär'}</button>
                <button onClick={() => this.setState({ showCode: true })}>{'</>'}</button>
              </header>
              <div>
                {
                  this.state.showCode && (
                    <pre>
                      <code>
                        {form.code}
                      </code>
                    </pre>
                  )
                }
                {
                  !this.state.showCode && (
                    <form.component onSubmit={values => console.log(JSON.stringify(values))} />
                  )
                }
              </div>
            </section>
          )
        }
      </React.Fragment >
    )
  }
}
