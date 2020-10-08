import { stitchSchemas } from "@graphql-tools/stitch";

import Organization from "./organization";
import Group from "./group";
import Agent from "./agent";
import User from "./user";
import Chat from "./chat";
import Note from "./note";
import Tag from "./tag";
import Faq from "./faq";

export default stitchSchemas({
  schemas: [Organization, Group, Agent, User, Chat, Note, Tag, Faq],
});
