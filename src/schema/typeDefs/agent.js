import { gql } from "apollo-server-express";

const Agent = gql`
  type Agent {
    _id: ObjectID!
    organization: ObjectID!
    role: AgentRoleEnum!
    avatar: String
    name: FullName!
    email: String!
    active: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  enum AgentRoleEnum {
    owner
    admin
    agent
    viewer
  }
  type FullName {
    first: String!
    last: String!
  }
  # Inputs
  input AgentInput {
    organization: ObjectID!
    role: String
    avatar: String
    name: FullNameInput!
    email: String!
    password: String
  }
  input FullNameInput {
    first: String!
    last: String!
  }
`;

export default Agent;
