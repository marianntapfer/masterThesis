const https = require("https");
const fs = require("fs");
require("dotenv").config();
const github_token = process.env.github_token;
const projectNumber = 1;
const user = "marianntapfer";
const filePath = "scripts/data/project.json";

let options = {
	method: "POST",
	hostname: "api.github.com",
	path: "/graphql",
	headers: {
		Authorization: `Bearer ${github_token}`,
		"Content-Type": "application/json",
		Cookie: "_octo=GH1.1.1334685627.1652968470; logged_in=no",
		"User-Agent": "PostmanRuntime/7.29.0",
	},
};

const req = https.request(options, (res) => {
	let chunks = [];

	res.on("data", (chunk) => {
		chunks.push(chunk);
	});

	res.on("end", (chunk) => {
		let body = Buffer.concat(chunks);
		// console.log(body.toString());
		fs.writeFileSync("scripts/data/project.json", body.toString());
		console.log("wrote project data indata/project.json");
	});

	res.on("error", (error) => {
		console.error(error);
	});
});

let postData = JSON.stringify({
	query: `query($user: String!, $number: Int!) {
    user(login: $user){
    projectNext(number: $number) {
        id
        closed
        closedAt
        fields(first:25) {
            nodes {
                id
                name
            }
        }
        items(first:30) {
            nodes {
                title
                fieldValues(first: 25) {
                    nodes {
                        value
                        projectField {
                            name
                            id
                        }
                    }
                }

                content {
                    ... on Issue {
                    closed
                    closedAt
                    id
                    milestone {
                        title
                        id
                        dueOn
                        state
                    }

                }
              }
            }
          }
    }
    }
}`,
	variables: { number: projectNumber, user: user },
});

req.write(postData);

req.end();
