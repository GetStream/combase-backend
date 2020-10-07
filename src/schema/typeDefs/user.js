import { gql } from "apollo-server-express";

const User = gql`
  type User {
    _id: ObjectID!
    organizationId: ObjectID!
    name: String!
    email: String!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export default User;
