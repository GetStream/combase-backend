import { gql } from "apollo-server-express";

import Organization from "./organization";
import User from "./user";

const ROOT = gql`
  scalar ObjectID
  scalar DateTime
  scalar JSON

  type Query {
    # Organization

    """
    Get all organizations available to the authenticated user.
    """
    organizations: [Organization!]

    """
    Get the current organization for the authenticated user, or pass an ObjectID to access any
    organizations available to the user by _id.
    """
    organization(_id: ObjectID): Organization

    # Member

    """
    Get the data for the currently authenticated user, this method will also return their auth token.
    """
    me: Member!

    """
    Retrieves a single member by their ID or email - does not work fuzzily.
    """
    memberFind(_id: ObjectID, email: String): Member!

    """
    Retrieves a list of members (currently all members for the authed users org.)
    """
    users: [User!]

    # User

    """
    Retrieves a single user by their ID or email - does not work fuzzily.
    """
    userFind(_id: ObjectID, email: String): User!

    """
    Retrieves a list of users (Ccrrently all users for the authed users org.)
    """
    users: [User!]
  }

  type Mutation {
    # Auth

    """
    Login to Combase with Email & Password
    """
    login(email: String!, password: String!): Member!

    # Organization

    """
    Create a new Combase Organization
    """
    organizationCreate(data: OrganizationInput!): Organization!
  }
`;

export default [Organization, User, ROOT];
