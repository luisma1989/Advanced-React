import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!,
    $password: String!,
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken,
      password: $password,
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    resetToken : PropTypes.string.isRequired,
  }

  state = {
    password: '',
    confirmPassword: '',
  }

  saveToState = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value})
  }

  render() {
    const { password, confirmPassword } = this.state;
    return(
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken: this.props.resetToken,
          password,
          confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(reset, { error, loading, called }) => (
          <Form
            method='post'
            onSubmit={async e => {
            e.preventDefault();
            await reset();
            this.setState({ password: '', confirmPassword: '' });
          }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset your password</h2>
              <Error error={error}/>
              <label htmlFor='password'>
                Password
                <input
                  type='text'
                  name='password'
                  placeholder='password'
                  value={this.state.password}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <label htmlFor='confirmPassword'>
                Confirm your password
                <input
                  type='text'
                  name='confirmPassword'
                  placeholder='confirmPassword'
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                  required
                />
              </label>
              <button type='submit'>Cambia tu contraseña</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Reset;
