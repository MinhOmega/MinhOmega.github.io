import { Octokit } from "octokit";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Revalidate every hour

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
    
    return NextResponse.json(filteredRepos, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error("Failed to fetch GitHub repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch GitHub repositories" },
      { status: 500 }
    );
  }
} 