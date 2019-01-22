import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGUP_MUTATION = gql`
   mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  }

  saveToState = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value})
  }

  render() {
    return(
      <Mutation
        mutation={SIGUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, {error, loading}) => (
          <Form
            method='post'
            onSubmit={async e => {
            e.preventDefault();
            await signup();
            this.setState({ name: '', email: '', password: '' });
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign up for account</h2>
              <Error error={error}/>
              <label htmlFor='email'>
                email
                <input
                  type='text'
                  name='email'
                  placeholder='email'
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='name'>
                name
                <input
                  type='text'
                  name='name'
                  placeholder='name'
                  value={this.state.name}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor='password'>
                password
                <input
                  type='password'
                  name='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <button type='submit'>Sign up</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signup;
