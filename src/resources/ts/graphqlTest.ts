import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';

const client = new ApolloClient({
    uri: 'https://snowtooth.moonhighway.com/'
});

client.query({
    query: gql`query{
        allLifts {
            id
        }
    }`
}).then(data => console.log(data.data.allLifts))
.catch(error => console.error(error));