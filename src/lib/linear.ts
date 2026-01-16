type LinearGraphQLError = {
  message: string;
};

type LinearGraphQLResponse<T> = {
  data?: T;
  errors?: LinearGraphQLError[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

async function linearGraphQL<TData>(
  query: string,
  variables?: Record<string, unknown>
): Promise<TData> {
  const apiKey = requireEnv("LINEAR_API_KEY");

  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: apiKey,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Linear API request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ""}`);
  }

  const json = (await res.json()) as LinearGraphQLResponse<TData>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Linear API returned no data");
  }
  return json.data;
}

async function getTeamIdByKey(teamKey: string): Promise<string> {
  const data = await linearGraphQL<{
    teams: { nodes: Array<{ id: string; key: string }> };
  }>(
    `
      query Teams($teamKey: String!) {
        teams(filter: { key: { eq: $teamKey } }) {
          nodes { id key }
        }
      }
    `,
    { teamKey }
  );

  const team = data.teams.nodes[0];
  if (!team) {
    throw new Error(`Linear team not found for key: ${teamKey}`);
  }
  return team.id;
}

async function getStateIdByName(
  teamId: string,
  stateName: string
): Promise<string | null> {
  const data = await linearGraphQL<{
    team: { states: { nodes: Array<{ id: string; name: string }> } } | null;
  }>(
    `
      query TeamStates($teamId: String!) {
        team(id: $teamId) {
          states {
            nodes { id name }
          }
        }
      }
    `,
    { teamId }
  );

  const nodes = data.team?.states.nodes ?? [];
  const state = nodes.find(
    (s) => s.name.toLowerCase() === stateName.toLowerCase()
  );
  return state?.id ?? null;
}

async function getLabelIdByName(
  teamId: string,
  labelName: string
): Promise<string | null> {
  const data = await linearGraphQL<{
    issueLabels: { nodes: Array<{ id: string; name: string }> };
  }>(
    `
      query Labels($teamId: ID!, $labelName: String!) {
        issueLabels(
          filter: {
            team: { id: { eq: $teamId } }
            name: { eq: $labelName }
          }
        ) {
          nodes { id name }
        }
      }
    `,
    { teamId, labelName }
  );

  const label = data.issueLabels.nodes[0];
  return label?.id ?? null;
}

export type CreateLinearIssueInput = {
  teamKey: string;
  title: string;
  description: string;
  labelName?: string; // e.g. "feedback"
  priority?: number; // Linear: 0..4 typically; repo default wants 3
  stateName?: string; // e.g. "Triage"
};

export async function createLinearIssue(input: CreateLinearIssueInput): Promise<{
  id: string;
  url: string;
}> {
  const teamId = await getTeamIdByKey(input.teamKey);
  const [labelId, stateId] = await Promise.all([
    input.labelName ? getLabelIdByName(teamId, input.labelName) : Promise.resolve(null),
    input.stateName ? getStateIdByName(teamId, input.stateName) : Promise.resolve(null),
  ]);

  const data = await linearGraphQL<{
    issueCreate: { success: boolean; issue: { id: string; url: string } | null };
  }>(
    `
      mutation CreateIssue($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue { id url }
        }
      }
    `,
    {
      input: {
        teamId,
        title: input.title,
        description: input.description,
        priority: input.priority ?? 3,
        labelIds: labelId ? [labelId] : undefined,
        stateId: stateId ?? undefined,
      },
    }
  );

  if (!data.issueCreate.success || !data.issueCreate.issue) {
    throw new Error("Linear issue creation failed");
  }

  return data.issueCreate.issue;
}

