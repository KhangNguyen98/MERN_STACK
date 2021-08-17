const { buildSchema } = require("graphql");

exports.graphqlSchema = new buildSchema(`
 type Image{
  _id: ID!
  imageUrl: String!
  creator: User!
  createdAt: String!
  updatedAt: String!,
  downloadCounts: Int!
 }

 type User{
  _id: ID!
  email: String!
  password: String!
  name: String!
  images: [Image!]!
 }

 input UserInput{
  email: String!
  password: String!
  name: String!
 }

 input ImageInput{
  imageUrl: String!
 }

 type AuthData {
  token: String!
  userID: String!
 }



 type RootQuery{
   signin(email: String!, password: String!): AuthData!
   getImages: [Image!]
   getOwnImages(userID: ID!): [Image!]
 }

 type RootMutation{
   signup(userInput: UserInput): User!
   postImage(imageInput: ImageInput): Image!
   deleteImage(imageID: ID!): Boolean
 }

 schema{
  query: RootQuery
  mutation: RootMutation
 }

`);