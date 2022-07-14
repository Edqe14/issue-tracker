import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GH_PERSONAL_TOKEN
});

export default octokit;
