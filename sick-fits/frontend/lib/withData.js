// it's going to give us a high-order component that will expose
// our Apollo Client. Apollo Client is the data base that is in
// the client and it will expose that client via a prop.
import withApollo from 'next-with-apollo';
// it's an official package that has all of the standard things
// that you would want to use with an Apollo installation in the
// client included.
import ApolloClient from 'apollo-boost';
import { endpoint } from '../config';

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

export default withApollo(createClient);
