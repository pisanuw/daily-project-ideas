# Briefing

- Purpose: Automated daily project idea curation via Claude Code Remote Trigger
- Current scope: Daily 5am routine searches Reddit/HN/GitHub for 3 project ideas, commits to pisanuw/daily-project-ideas
- Key decisions: Remote Trigger on Sonnet 4.6, pushes to main, ideas stored in ideas/YYYY-MM-DD.md with index in IDEAS.md
- Non-goals: No local cron, no email notifications, no manual curation step
