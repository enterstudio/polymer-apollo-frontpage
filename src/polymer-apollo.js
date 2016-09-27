import ApolloClient, { createNetworkInterface, addTypename } from 'apollo-client';
import { PolymerApollo } from 'polymer-apollo'; 
import gql from 'graphql-tag';
// Create the apollo client
const apolloClient = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:8080/graphql',
    transportBatching: true,
  }),
  queryTransformer: addTypename,
  dataIdFromObject: r => r.id,
});

// create an instance of PolymerApollo 
  // created instance is a polymer behavior

const PolymerApolloBehavior = new PolymerApollo({apolloClient});

// GraphQL query
const postsQuery = gql`
  query allPosts {
    posts {
      id
      title
      votes
      author {
        id
        firstName
        lastName
      }
    }
  }
`;

const upvoteMutation = gql`
  mutation upvotePost($postId: Int!) {
    upvotePost(postId: $postId) {
      id
      votes
    }
  }
`;


Polymer({

  is: 'polymer-apollo',
// add the created behavior in behaviors
  behaviors:[PolymerApolloBehavior],
  properties: {
    prop1:{
      type:Object,
      value:{
      message:"App",
name:"polymer-apollo"
      }
    },
    posts: {
      type:Array,
      value:[]
    },
    ping:String,

    loading: {
      type:Number,
      value:0
    },
    postId: {
      type: Number,
      required: true,
    },
    sortedPosts:{
      type:Array,
      value:[]
    }


  },
  observers:["sortPosts(posts)"],
  apollo: {
    // Local state 'posts' data
    posts: {
      query: postsQuery,
      loadingKey: 'loading',
    },
    ping: {
      query: gql`query PingMessage($message: String!) {
      ping(message: $message)
      }`,
      variables: {
// properties in variables should have values with paths to element properties
        // example
        // limit: "route.limit"
        message:"prop1.message"
      },
      // Additional options here
      forceFetch: true,
    },
  },
  // Computed properties
  sortPosts(v) {
    if(v)
      this.set("sortedPosts",v.sort((x, y) => y.votes - x.votes));
  },
  upvote(e) {
    // Mutation
    const postId = e.model.item.id;
    this.$apollo.mutate({
      mutation: upvoteMutation,
      variables: {
        postId: postId,
      },
    });
  },
});