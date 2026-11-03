---
name: generate-docs
description: 'Generate comprehensive project documentation in Markdown, covering structure, architecture, database design, flows, and component/endpoint details.'
---

# Generate Project Documentation

You are a senior technical writer and software architect. Analyze this codebase thoroughly and produce a complete, developer-facing documentation set in Markdown. Do not guess or fabricate details — every claim must be traceable to something actually found in the code, config files, or existing docs/comments. If something cannot be determined from the codebase, explicitly mark it as `_Not determinable from source — please confirm._` rather than inventing it.

## Output

Produce a single file named `PROJECT_DOCUMENTATION.md` (or split into `/docs/*.md` files with a `docs/README.md` index if the project is large) with the following sections, in this order:

### 1. Overview
- Project name, one-paragraph purpose/summary
- Tech stack (languages, frameworks, runtime versions — read from package manifests / build files, not assumptions)
- High-level list of major modules/services

### 2. Project Structure
- A directory tree (2–3 levels deep, skip `node_modules`, `.git`, build artifacts, etc.)
- A short description of what each top-level folder is responsible for
- Naming/organization conventions observed in the codebase

### 3. Architecture
- Architectural style (e.g., layered, microservices, MVC, event-driven) — inferred from actual folder/module boundaries and dependency direction, not assumed
- A component/architecture diagram in Mermaid (`graph TD` or `C4`-style) showing major modules/services and their dependencies
- Key design patterns actually used (e.g., repository, factory, middleware, DI) with the file(s) where they appear

### 4. Database Design
- List all data stores found (SQL, NoSQL, cache, etc.)
- Entity/table list with fields, types, and constraints, pulled from schema files, migrations, or ORM models
- An Entity-Relationship Diagram in Mermaid (`erDiagram`) showing relationships and cardinality
- Indexing/keys strategy if evident from migration/schema files

### 5. Flow Diagrams
For each major user-facing or system workflow found (e.g., auth, checkout, data ingestion):
- A short description of the flow
- A Mermaid `sequenceDiagram` or `flowchart` showing the step-by-step interaction between components/services

### 6. Components / Modules
For each significant component or class:
- Name, responsibility, location (file path)
- Public methods/functions with signatures
- Dependencies (what it imports/calls, what calls it)

### 7. API / Endpoint Reference
For every route/endpoint discovered (REST, GraphQL, RPC, etc.):
- Method + path
- Purpose
- Request parameters/body schema
- Response schema
- Auth requirements
- Example request/response (only if a real example exists in code/tests/docs — otherwise mark as illustrative and label it clearly as such)

### 8. Configuration & Environment
- Environment variables / config keys found, with purpose (never expose actual secret values — reference the variable name only)
- Build/run/deploy commands, extracted from scripts, Makefiles, or CI config

### 9. Setup & Local Development
- Prerequisites
- Install and run steps, derived from actual scripts/README content
- How to run tests

### 10. Glossary & Open Questions
- Domain-specific terms found in code/comments
- A list of ambiguities or gaps you encountered while generating this doc, so a human can fill them in

## Rules
- Use proper Markdown: headers, tables, fenced code blocks, and Mermaid diagrams (```mermaid blocks).
- Keep prose concise; prefer tables and bullet points over long paragraphs.
- Cross-reference file paths using inline code formatting (`path/to/file.ext`).
- Do not include any commentary about your own process — output only the documentation.
- If the codebase is large, prioritize breadth (cover every module/endpoint at a summary level) over exhaustive depth in any one section, and note where deeper documentation could follow as a next pass.