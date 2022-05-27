const core = require("@actions/core");
const github = require("@actions/github");

const payload = github.context.payload;

const workflow = github.context.workflow;
const actor = github.context.actor;
const { sha } = github.context;
const { owner, repo } = github.context.repo;
const status = core.getInput("status");
console.log(sha, owner, repo, status, actor);
let user = "";
let project = "";
let status2 = "";
if (payload.hasOwnProperty("inputs")) {
  user = payload.inputs.userName;
  project = payload.inputs.projectNr;
  status2 = payload.inputs.status;
}

try {
  console.log("user:", userName);
  console.log("actor", actor);
  console.log("workflow", workflow);
} catch (error) {
  console.log(error);
  core.setFailed(
    `[Error] There was an error when sending the slack notification`
  );
}
