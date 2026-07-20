---
bump: minor
---
Extend the read surface for Front Desk board reads: `ProjectItemOutput` gains `contentId` + `itemId` (node ids), `createdAt`, and `isPrivate`, and tightens `state` to `OPEN`/`CLOSED`/`MERGED`; new org verbs `repos`, `orgOpenWork`, and `orgMergedPrs`.
