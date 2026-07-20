/**
 * @module
 * @bounded-systems/scout-wire — the pinned agreement between scoutd (door-scout)
 * and its in-box client (door-kit), authored once as VerbSpec verbs. Both sides
 * depend on THIS, not each other. Regenerate manifest.json with `deno task gen`.
 */

import { z } from "zod";
import { defineVerb, type VerbSpec } from "verbspec";

const RepoInput = z.object({ url: z.string(), ref: z.string().optional() });
const RepoOutput = z.object({
  owner: z.string(),
  repo: z.string(),
  ref: z.string(),
  defaultBranch: z.string(),
  description: z.string().nullable(),
  tarballUrl: z.string(),
});
const repo: VerbSpec<typeof RepoInput, typeof RepoOutput> = defineVerb({
  id: "repo",
  summary: "Resolve a repo's metadata via scoutd (external read).",
  actor: "scout",
  input: RepoInput,
  output: RepoOutput,
  run: () => ({
    owner: "",
    repo: "",
    ref: "",
    defaultBranch: "",
    description: null,
    tarballUrl: "",
  }),
});

const PrInput = z.object({
  repo: z.string(),
  number: z.number(),
  diff: z.boolean().default(false),
  comments: z.boolean().default(false),
});
const PrOutput = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.string(),
  diff: z.string().optional(),
});
const pr: VerbSpec<typeof PrInput, typeof PrOutput> = defineVerb({
  id: "pr",
  summary: "Fetch a pull request (optionally diff/comments) via scoutd.",
  actor: "scout",
  input: PrInput,
  output: PrOutput,
  run: () => ({ number: 0, title: "", body: null, state: "" }),
});

const IssueInput = z.object({
  repo: z.string(),
  number: z.number(),
  comments: z.boolean().default(false),
});
const IssueOutput = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string().nullable(),
  state: z.string(),
  labels: z.array(z.string()),
});
const issue: VerbSpec<typeof IssueInput, typeof IssueOutput> = defineVerb(
  {
    id: "issue",
    summary: "Fetch an issue (optionally comments) via scoutd.",
    actor: "scout",
    input: IssueInput,
    output: IssueOutput,
    run: () => ({ number: 0, title: "", body: null, state: "", labels: [] }),
  },
);

const FetchInput = z.object({
  url: z.string(),
  binary: z.boolean().default(false),
  maxSize: z.number().optional(),
});
const FetchOutput = z.object({
  url: z.string(),
  status: z.number(),
  contentType: z.string().nullable(),
  size: z.number(),
  body: z.string(),
});
const fetchUrl: VerbSpec<typeof FetchInput, typeof FetchOutput> = defineVerb({
  id: "fetch",
  summary: "Fetch an allowlisted URL's content via scoutd.",
  actor: "scout",
  input: FetchInput,
  output: FetchOutput,
  run: () => ({ url: "", status: 0, contentType: null, size: 0, body: "" }),
});

const DownloadInput = z.object({
  url: z.string(),
  maxSize: z.number().optional(),
});
const DownloadOutput = z.object({
  url: z.string(),
  size: z.number(),
  contentType: z.string().nullable(),
  sha256: z.string(),
  data: z.string(),
});
const download: VerbSpec<typeof DownloadInput, typeof DownloadOutput> =
  defineVerb({
    id: "download",
    summary: "Download an allowlisted URL to base64 + sha256 via scoutd.",
    actor: "scout",
    input: DownloadInput,
    output: DownloadOutput,
    run: () => ({ url: "", size: 0, contentType: null, sha256: "", data: "" }),
  });

const ProjectInput = z.object({
  org: z.string(),
  number: z.number(),
  first: z.number().optional(),
  after: z.string().optional(),
});
const ProjectItemOutput = z.object({
  number: z.number(),
  title: z.string(),
  url: z.string(),
  repo: z.string(),
  contentType: z.enum(["Issue", "PullRequest"]),
  // Strict lifecycle state (was a free string) so a consumer can compare board
  // Status against the item's real GitHub state.
  state: z.enum(["OPEN", "CLOSED", "MERGED"]),
  /** Underlying Issue/PR node id — lets a caller derive board membership. */
  contentId: z.string(),
  /** ProjectV2Item node id — the handle a write path would target. */
  itemId: z.string(),
  /** ISO 8601 creation timestamp — feeds age-based prioritization. */
  createdAt: z.string(),
  /** Visibility of the item's repo — public/private board contract. */
  isPrivate: z.boolean(),
  fields: z.record(z.string(), z.union([z.string(), z.number()])),
});
const ProjectOutput = z.object({
  title: z.string(),
  items: z.array(ProjectItemOutput),
  pageInfo: z.object({
    hasNextPage: z.boolean(),
    endCursor: z.string().nullable(),
  }),
});
const project: VerbSpec<typeof ProjectInput, typeof ProjectOutput> = defineVerb(
  {
    id: "project",
    summary:
      "Fetch a GitHub Projects v2 board's items via scoutd (read-only; GraphQL).",
    actor: "scout",
    input: ProjectInput,
    output: ProjectOutput,
    run: () => ({
      title: "",
      items: [],
      pageInfo: { hasNextPage: false, endCursor: null },
    }),
  },
);

const StatusInput = z.object({});
const StatusOutput = z.object({
  version: z.string(),
  uptime: z.number(),
  hasToken: z.boolean(),
  allowlist: z.array(z.string()),
});
const status: VerbSpec<typeof StatusInput, typeof StatusOutput> = defineVerb({
  id: "status",
  summary: "scoutd health/status.",
  actor: "scout",
  input: StatusInput,
  output: StatusOutput,
  run: () => ({ version: "", uptime: 0, hasToken: false, allowlist: [] }),
});

// Shared: one repo the daemon could not fully read, and why (partial reads never
// abort the whole enumeration).
const SkippedRepo = z.object({ repo: z.string(), reason: z.string() });

const ReposInput = z.object({
  org: z.string(),
  includePrivate: z.boolean().default(false),
});
const ReposOutput = z.object({
  repos: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isPrivate: z.boolean(),
    }),
  ),
});
const repos: VerbSpec<typeof ReposInput, typeof ReposOutput> = defineVerb({
  id: "repos",
  summary: "List an org's repositories via scoutd (external read).",
  actor: "scout",
  input: ReposInput,
  output: ReposOutput,
  run: () => ({ repos: [] }),
});

const OrgOpenWorkInput = z.object({ org: z.string() });
const OrgOpenWorkOutput = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      kind: z.enum(["Issue", "PullRequest"]),
      repo: z.string(),
      number: z.number(),
      title: z.string(),
      labels: z.array(z.string()),
      hasSubIssues: z.boolean(),
    }),
  ),
  skipped: z.array(SkippedRepo),
});
const orgOpenWork: VerbSpec<typeof OrgOpenWorkInput, typeof OrgOpenWorkOutput> =
  defineVerb({
    id: "orgOpenWork",
    summary:
      "Every open issue/PR across an org's repos via scoutd (partial: unreadable repos are skipped).",
    actor: "scout",
    input: OrgOpenWorkInput,
    output: OrgOpenWorkOutput,
    run: () => ({ items: [], skipped: [] }),
  });

const OrgMergedPrsInput = z.object({ org: z.string() });
const OrgMergedPrsOutput = z.object({
  items: z.array(
    z.object({
      repo: z.string(),
      number: z.number(),
      title: z.string(),
      authorLogin: z.string().nullable(),
      labels: z.array(z.string()),
      closingIssueCount: z.number(),
    }),
  ),
  skipped: z.array(SkippedRepo),
});
const orgMergedPrs: VerbSpec<
  typeof OrgMergedPrsInput,
  typeof OrgMergedPrsOutput
> = defineVerb({
  id: "orgMergedPrs",
  summary:
    "Every merged PR across an org's repos via scoutd (traceability; partial on unreadable repos).",
  actor: "scout",
  input: OrgMergedPrsInput,
  output: OrgMergedPrsOutput,
  run: () => ({ items: [], skipped: [] }),
});

/** The `scout-wire` method surface (keys are the canonical wire method strings). */
export const SCOUT_WIRE: Record<string, VerbSpec> = {
  "status": status,
  "repo": repo,
  "repos": repos,
  "pr": pr,
  "issue": issue,
  "project": project,
  "orgOpenWork": orgOpenWork,
  "orgMergedPrs": orgMergedPrs,
  "fetch": fetchUrl,
  "download": download,
};
