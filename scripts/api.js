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
  query: `query User($login: String!, $number: Int!, $itemsFirst: Int, $fieldValuesFirst: Int, $fieldsFirst: Int) {
    user(login: $login) {
      projectNext(number: $number) {
        id
        items(first: $itemsFirst) {
          totalCount
          nodes {
            title
            content {
              ... on Issue {
                id
                number
                url
                milestone {
                  id
                  title
                  dueOn
                }
              }
            }
            fieldValues(first: $fieldValuesFirst) {
              totalCount
              nodes {
                value
                id
                projectField {
                  name
                  id
                  dataType
                }
                databaseId
                projectItem {
                  title
                }
              }
            }
          }
          edges {
            node {
              content {
                ... on Issue {
                  id
                  number
                  title
                  url
                }
              }
            }
          }
        }
        fields(first: $fieldsFirst) {
          totalCount
          nodes {
            id
            name
            settings
            dataType
          }
        }
      }
    }
  }`,
  variables: {
    login: "marianntapfer",
    number: 1,
    itemsFirst: 30,
    fieldValuesFirst: 10,
    fieldsFirst: 15,
  },
});

req.write(postData);

req.end();
