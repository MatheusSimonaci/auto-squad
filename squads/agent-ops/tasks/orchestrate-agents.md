# Task: Orchestrate Agents

## Task Anatomy

```yaml
task_name: "Orchestrate Agent Team Execution"
status: pending
responsible_executor: ops-chief
execution_type: Agent
estimated_time: "15-30min"

input:
  - request: "User request or project description"
  - context:
      workspace_path: "workspace/businesses/{brand}/"
      domains_path: "workspace/domains/"

output:
  - orchestration_plan: "Agent assignments with SLA and dependencies"
  - monitoring_config: "How to track execution progress"

action_items:
  1: "Classify request by impact and urgency (TRIAGE MATRIX)"
  2: "Check workspace/businesses/{brand}/ for existing project context"
  3: "Identify which agents are needed and in what order"
  4: "Define assignments with inputs, outputs and SLA for each agent"
  5: "Estimate token budget for the full execution"
  6: "Start monitoring mode — track progress until completion"

acceptance_criteria:
  - "All agents have clear assignments"
  - "Dependencies mapped and sequenced"
  - "Token budget estimated and approved"
  - "SLA defined for each phase"
  - "Handoff conditions documented"

veto_conditions:
  - "Execute without triage — always classify first"
  - "Assign agents without sufficient context"
  - "Ignore token budget constraints"

output_example: |
  ORCHESTRATION PLAN

  Request: Build user authentication feature
  Impact: HIGH | Urgency: NORMAL | Token Budget: 8k

  Phase 1: @architect (2h) → Technical spec + ADR
  Phase 2: @dev (4h) → Implementation [requires Phase 1]
  Phase 3: @qa (1h) → Quality gate [requires Phase 2]
  Phase 4: @devops (0.5h) → Deploy [requires Phase 3]

  Monitoring: status check every 30min
```
