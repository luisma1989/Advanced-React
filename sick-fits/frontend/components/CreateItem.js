import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $price: Int!
    $description: String!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      price: $price
      description: $description
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    price: 0,
    description: '',
    image: '',
    largeImage: '',
  };

  onHandleChange = event => {
    const { name, type, value } = event.target;
    const val = type === 'number' ? parseFloat(value) : value;

    this.setState({ [name]: value })
  }

  uploadFile = async event => {
    console.log('uploading file...');
    const files = event.target.files;
    const body = new FormData();
    body.append('file', files[0]);
    body.append('upload_preset', 'sickfits');

    const res = await fetch(
      '	https://api.cloudinary.com/v1_1/dfin7umxa/image/upload',
      {
        method: 'POST',
        body
      }
    );
    const file = await res.json();
    console.log(file);
    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    })
  }

  render() {
    const {
      title,
      price,
      description,
      image,
    } = this.state;

    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error}) => (
          <Form onSubmit={async e => {
            // Stop the form submitting
            e.preventDefault();
            // call the mutation
            const res = await createItem();
            // change them to the route
            Router.push({
              pathname: '/item',
              query: { id: res.data.createItem.id },
            })
          }}>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor='file'>
                Image
                <input
                  type='file'
                  id='file'
                  name='file'
                  placeholder='Upload a image'
                  onChange={this.uploadFile}
                  required
                />
                {image && <img src={image} width='200' alt='image' />}
              </label>
              <label htmlFor='title'>
                Title
                <input
                  type='text'
                  id='title'
                  name='title'
                  placeholder='title'
                  value={title}
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
                  value={price}
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
                  value={description}
                  onChange={this.onHandleChange}
                  required
                />
              </label>
              <button type='submit'>Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem;
