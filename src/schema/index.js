import "../utils/db";
import { stitchSchemas } from "@graphql-tools/stitch";

import Agent from "./agent";
import Organization from "./organization";
import Team from "./team";
import User from "./user";

export default stitchSchemas({
  schemas: [Agent, Organization, Team, User],
});
