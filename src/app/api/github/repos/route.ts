import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-static';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repos = await octokit.rest.repos.listForUser({
      username: "MinhOmega",
      per_page: 100,
      type: "owner",
      direction: "desc",
      sort: "pushed",
    });

    const filteredRepos = repos.data.filter(repo => !repo.fork);
    
    return NextResponse.json(filteredRepos);
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: 500 }
    );
  }
} 