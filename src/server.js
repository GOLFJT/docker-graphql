var express = require('express');
var bodyParser = require('body-parser');
var { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
var { makeExecutableSchema } = require('graphql-tools');
import axios from 'axios';

var typeDefs = [`
type Query {
  user(id: String): User
  users: [User]!
}
type User {
  id: String!
  name: String
  age: Int
}
type Mutation{
  addUser(name:String,age:Int): User
}

schema {
  query: Query
  mutation: Mutation
}`];

var resolvers = {
  Query: {
    user(root,args) {
      console.log(args.id)
      return axios.get(`http://localhost:3000/users/${args.id}`).then(function (response) { return  response.data })
    },
    users() {
      return axios.get('http://localhost:3000/users').then(response => response.data )
      // return [
      //   { id: "1", name: "golf",age: "24" },
      //   { id: "2", name: "golf2",age: "24" }
      // ]
    }
  },
  Mutation: {
     addUser(root,args){
       console.log(args.name)
       return axios.post(`http://localhost:3000/users`,args).then(res =>res.data)
     }  
  }
};

var schema = makeExecutableSchema({typeDefs, resolvers});
var app = express();
app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
