import * as React from 'react'
import Form from './Form';

export class App extends React.Component<{}, { result?: any }> {
  constructor(props) {
    super(props)
    this.state = {
      result: undefined
    }
  }
  render() {
    return (
      <React.Fragment>
        <section>
          <h1>Formulär</h1>
          <Form onSubmit={values => this.setState({ result: values })} />
        </section>
        {
          this.state.result && (
            <section>
              <h1>Resultat</h1>
              <pre>
                <code>
                  {JSON.stringify(this.state.result, null, 2)}
                </code>
              </pre>
            </section>
          )
        }
      </React.Fragment>
    )
  }
}
