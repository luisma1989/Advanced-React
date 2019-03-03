import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from '../styles/Form';
import formatMoney from '../../lib/formatMoney';
import Error from '../ErrorMessage';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!,
    $title: String
    $price: Int
    $description: String
  ) {
    updateItem(
      id: $id,
      title: $title
      price: $price
      description: $description
    ) {
      id
      title
      price
      description
    }
  }
`;

class UpdateItem extends Component {
  state = {};

  onHandleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: value })
  }

  updateItem = async (event, updateItemMutation) => {
    event.preventDefault();
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state,
      }
    });
  }

  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{ id: this.props.id }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No item found</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error}) => (
                <Form onSubmit={event => this.updateItem(event, updateItem)}>
                  <Error error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor='title'>
                      Title
                      <input
                        type='text'
                        id='title'
                        name='title'
                        placeholder='title'
                        defaultValue={data.item.title}
                        onChange={this.onHandleChange}
                        required
                      />
                    </label>
                    <label htmlFor='price'>
                      Price
                      <input
                        type='text'
                        id='price'
                        name='price'
                        placeholder='price'
                        defaultValue={data.item.price}
                        onChange={this.onHandleChange}
                        required
                      />
                    </label>
                    <label htmlFor='description'>
                      Description
                      <textarea
                        type='text'
                        id='description'
                        name='description'
                        placeholder='Enter a description'
                        defaultValue={data.item.description}
                        onChange={this.onHandleChange}
                        required
                      />
                    </label>
                    <button type='submit'>Sav{loading ? 'ing' : 'e'} changes</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem;
export {UPDATE_ITEM_MUTATION}
