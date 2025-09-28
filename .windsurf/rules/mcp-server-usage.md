---
trigger: always_on
---

# 🚀 MCP Server Usage Guidelines — Jenga Biz Africa

This document defines **how and when to use the available MCP servers** for this project.  
The goal is to **save AI credits**, **avoid redundant calls**, and **make workflows consistent**.

---

## 🔧 Code Quality & Security

### **@21st-dev/magic MCP**
- **Use cases:**
  - Quick code formatting, conversions, or refactors.
  - Generating boilerplate or transforming data structures.
- **Rules:**
  - Use for **single-file transformations**, not whole-project refactors.

---

## 📚 Knowledge & Context
### **Exa MCP**
- **Use cases:**
  - Research external documentation, academic references, or libraries.
- **Rules:**
  - Query only if local docs/Ref MCP do not have the answer.
  - Summarize results and store them in **Ref MCP** for future reuse.

### **Ref MCP**
- **Use cases:**
  - Cache important snippets, configs, or documentation.
- **Rules:**
  - Always check Ref before calling Exa again.
  - Use Ref as the primary lookup for recurring tasks.

### **Context7 MCP**
- **Use cases:**
  - Experimental integrations with structured data sources.
- **Rules:**
  - Use only when fresh or nonstandard data is needed (e.g., special APIs, edge cases).
  - Not a replacement for Exa or Ref.

---

## 🗂️ Files & Data
### **Filesystem MCP**
- **Use cases:**
  - Read/write files inside:
    - `C:/Users/pasca/Documents/jenga-biz/jenga-biz`
    - `C:/xampp/htdocs`
- **Rules:**
  - Do not attempt to access paths outside these roots.
  - Use for migrations, configs, and logs.

### **Supabase MCP**
- **Use cases:**
  - Manage database schema and migrations, authentication, edge functions, queries and any other supabase related acttivities.
- **Rules:**
  - Use this instead of writing raw SQL when possible.
  - Verify schema changes in Git before applying.

---


### **Sentry MCP**
- **Use cases:**
  - Debug runtime errors, performance issues, or failed builds.
- **Rules:**
  - Always check Sentry logs before retrying a failing deploy.
  - Use for tracing and diagnosing real user errors.



### **Sequential Thinking MCP**
- **Use cases:**
  - Plan complex multi-step tasks, backlog refinement.
- **Rules:**
  - Use only for reasoning about workflows, not code execution.

---

## 🧠 Efficiency Rules
1. Always check **Ref MCP** first before calling Exa or Context7.  
2. Use **Semgrep MCP** before pushing large changes.   
3. Prefer **Sentry MCP** logs over re-running tests unnecessarily.  
4. Store useful results in **Ref MCP** to avoid repeating costly calls.  
