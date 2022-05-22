const project_data = require("./data/project.json");
const fs = require("fs");
const _ = require("lodash");
const moment = require("moment");

const issuesList = project_data.data.user.projectNext.items.nodes;
const ganttData = {};

const kanbanMap = {
	"47fc9ee4": "active",
	98236657: "done",
	"54d55924": "crit",
	"0addfc00": false,
	f75ad846: false,
};

const fieldsMap = {
	title: "PNF_lAHOBBjWzs4ABT45zgAw_xI",
	assignees: "PNF_lAHOBBjWzs4ABT45zgAw_xM",
	status: "PNF_lAHOBBjWzs4ABT45zgAw_xQ",
	labels: "PNF_lAHOBBjWzs4ABT45zgAw_xU",
	linked_PR: "PNF_lAHOBBjWzs4ABT45zgAw_xY",
	tracks: "PNF_lAHOBBjWzs4ABT45zgAw_xc",
	reviewers: "PNF_lAHOBBjWzs4ABT45zgAw_xg",
	repository: "PNF_lAHOBBjWzs4ABT45zgAw_xk",
	milestone: "PNF_lAHOBBjWzs4ABT45zgAw_xo",
	due: "PNF_lAHOBBjWzs4ABT45zgAxd2M",
	start: "PNF_lAHOBBjWzs4ABT45zgAxd20",
	duration: "PNF_lAHOBBjWzs4ABT45zgBKVA4",
	after: "PNF_lAHOBBjWzs4ABT45zgBLG2g",
};

const getMilestones = (issues) => {
	issues.forEach((issue) => {
		const milestone = issue.content.milestone;
		const dueDate = milestone.dueOn.split("T")[0];
		ganttData[milestone.id] = {
			title: milestone.title,
			due: dueDate,
			issues: [],
		};
	});
};

const addIssues = (issues) => {
	issues.forEach((issue) => {
		const milestone = issue.content.milestone.id;
		console.log(issue);

		const fields = issue.fieldValues.nodes;

		const ganttIssue = {
			title: issue.title,
			id: issue.content.id,
			duration: false,
		};

		fields.forEach((field) => {
			if (field.projectField.id === fieldsMap.due) {
				ganttIssue.due = moment(field.value).format("YYYY-MM-DD");
			}
			if (field.projectField.id === fieldsMap.start) {
				ganttIssue.start = moment(field.value).format("YYYY-MM-DD");
			}
			if (field.projectField.id === fieldsMap.duration) {
				ganttIssue.duration = field.value;
			}
			if (field.projectField.id === fieldsMap.status) {
				ganttIssue.status = kanbanMap[field.value];
			}
		});
		ganttData[milestone].issues.push(ganttIssue);
	});
};
getMilestones(issuesList);
addIssues(issuesList);

// console.log("Gantt data:", ganttData);
fs.writeFileSync("scripts/data/ganttData.json", JSON.stringify(ganttData));

const milestone = _.template(" \nsection <%= title %> \n");
const issue = _.template(
	"<%= title %> :<%= status ? status + ', ' : '' %> <%= id %>, <%= start ? start + ', ' : '' %> <%= due ? due : '' %>\n"
);

let readMe = "";

const sortedGantt = Object.entries(ganttData)
	.sort((a, b) => new Date(a.due) - new Date(b.due))
	.reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

console.log(sortedGantt);

for (const key in sortedGantt) {
	// console.log(milestone(ganttData[key]));
	readMe += milestone(ganttData[key]);
	const issues = ganttData[key].issues;
	const sortedIssues = issues.sort(
		(a, b) => new Date(a.start) - new Date(b.start)
	);

	sortedIssues.forEach((i) => {
		// console.log(issue(i).replace(/, *$/, ""));
		readMe += issue(i).replace(/, *$/, "");
	});
}

const finalReadMe = _.template(
	"# Timeline for HCI master thesis\n```mermaid\ngantt\n    dateFormat YYYY-MM-DD\n <%= data %>```"
);

fs.writeFileSync("./README.md", finalReadMe({ data: readMe }));
