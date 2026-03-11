# Fortress Defense Platform - System Architecture

## Overview

Fortress is an enterprise-grade threat defense platform built on the OpenClaw Ecosystem's kill chain methodology. It implements a layered defense architecture inspired by OpenClaw's system design, providing comprehensive threat detection, analysis, and mitigation capabilities.

## Core Architecture Layers

### 1. Gateway Layer (Communication Hub)
```
┌─────────────────────────────────────┐
│  GATEWAY - Message Router           │
│  - WebSocket & REST API             │
│  - Protocol Adaptation              │
│  - Session Management               │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Route threat notifications and commands
- Manage WebSocket connections for real-time updates
- Translate between frontend and backend protocols
- Handle concurrent threat streams

**Components:**
- Gin Router (HTTP/REST)
- WebSocket Handler
- Session Manager
- Protocol Translator

**Threats:**
- Prompt Injection (API abuse)
- Credential Theft via API endpoints
- Data Exfiltration

---

### 2. Threat Detection Engine (AI Brain)
```
┌─────────────────────────────────────┐
│  THREAT DETECTION ENGINE            │
│  - Anomaly Detection                │
│  - Pattern Matching                 │
│  - Kill Chain Analysis              │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Analyze incoming threat data
- Classify threats by type and severity
- Map threats to OpenClaw kill chain stages:
  * Reconnaissance
  * Weaponization
  * Delivery
  * Exploitation
  * Installation
  * Command & Control
  * Actions on Objectives
- Correlate events across systems

**Key Features:**
- ML-based anomaly detection
- Threat intelligence integration
- Real-time event correlation
- Kill chain stage mapping

**Threats:**
- Data Poisoning attacks
- Indirect Prompt Injection
- Knowledge Manipulation
- Remote Code Execution

---

### 3. Plugin System (Tool Orchestration)
```
┌─────────────────────────────────────┐
│  PLUGIN SYSTEM                      │
│  - Tool Runtime Environment         │
│  - Skill Registry (ClawHub)         │
│  - Dynamic Tool Loading             │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Load and manage security tools
- Execute threat mitigation actions
- Integrate with external APIs:
  * Threat Intelligence feeds
  * SIEM systems
  * Firewall APIs
  * EDR platforms
- Version management and rollback

**Available Tools:**
- Network blocking (Firewall)
- Process isolation (Sandbox)
- Log collection & analysis
- Incident response automation
- Third-party security integrations

**Threats:**
- Supply-chain Attacks via malicious plugins
- Data Exfiltration through tool APIs
- Unsafe Tool Use (permission escalation)
- Credential Theft via tool configurations

---

### 4. Sandbox (Isolation Layer)
```
┌─────────────────────────────────────┐
│  SANDBOX - Execution Isolation      │
│  - Docker/Podman Containers         │
│  - Workspace Separation             │
│  - Security Policies                │
│  - Audit Logging                    │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Isolate threat analysis operations
- Prevent lateral movement
- Contain malicious payloads
- Enforce resource limits
- Log all activities for forensics

**Security Controls:**
- Network isolation (namespace)
- Filesystem isolation (volume mounts)
- CPU & memory limits
- Syscall filtering (seccomp)
- Capability dropping
- SELinux/AppArmor policies

**Threats:**
- Privilege Escalation
- Container Escape
- Resource exhaustion DoS

---

### 5. Memory Engine (Context & State)
```
┌─────────────────────────────────────┐
│  MEMORY ENGINE - Hybrid Search      │
│  - L1: Long-term Memory (MEMORY.md) │
│  - L2: Daily Logs (YYYY-MM-DD.md)   │
│  - Vector Database (Embeddings)     │
│  - BM25 Full-text Search            │
│  - SQLite Cache                     │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Store threat intelligence context
- Maintain investigation history
- Enable rapid threat correlation
- Support intelligent search

**Data Stored:**
- Threat indicators (IPs, domains, hashes)
- Investigation notes and findings
- Incident timelines
- Previous case resolutions
- Security policies and baselines

⚠️ **CRITICAL - Do NOT store:**
- Passwords or API keys
- Credit card or account numbers
- PII (Personally Identifiable Information)

**Threats:**
- Data Poisoning (malicious threat data)
- Persistent Memory Poisoning
- Knowledge Manipulation
- Information Disclosure

---

### 6. Control UI (Dashboard)
```
┌─────────────────────────────────────┐
│  CONTROL UI - Web Dashboard         │
│  - React Frontend                   │
│  - Real-time Threat Visualization   │
│  - Incident Management              │
│  - Mitigation Controls              │
│  - Analytics & Reporting            │
└─────────────────────────────────────┘
```
**Responsibilities:**
- Display threat landscape
- Enable manual incident response
- Show mitigation status
- Provide analytics and insights
- Audit trail viewing

**Threat Panels:**
- Threat Dashboard (real-time threats)
- Alert Center (notifications)
- Mitigation Panel (response actions)
- Investigation History
- Compliance Reports

**Threats:**
- None (no execution capability)

---

### 7. External Integrations (API Adapters)
```
┌─────────────────────────────────────┐
│  EXTERNAL INTEGRATIONS              │
│  - Threat Intelligence APIs         │
│  - Cloud Provider APIs (AWS/GCP)    │
│  - Firewall & Network APIs          │
│  - SIEM Connectors                  │
│  - EDR/XDR Integrations             │
└─────────────────────────────────────┘
```
**Supported Integrations:**
- Threat Intelligence: VirusTotal, AlienVault OTX, Shodan
- Cloud Platforms: AWS API, GCP API, Azure API
- Firewall: pfSense, iptables, cloud firewalls
- SIEM: Splunk API, ELK Stack
- EDR: Wazuh, Osquery integration

**Threats:**
- Credential Theft (API key exposure)
- Data Exfiltration (API abuse)
- Man-in-the-Middle attacks (API interception)

---

## Threat → Layer Mapping Matrix

```
Threat Type                  | Gateway | Detection | Plugin | Sandbox | Memory | UI | External
─────────────────────────────┼─────────┼───────────┼────────┼─────────┼────────┼────┼──────────
Prompt Injection             |    -    |     ●     |   -    |    -    |   -    | -  |    -
Indirect Prompt Injection    |    -    |     -     |   ●    |    -    |   ●    | -  |    -
Data Poisoning               |    -    |     ●     |   -    |    -    |   ●    | -  |    -
Knowledge Manipulation       |    -    |     -     |   -    |    -    |   ●    | -  |    -
Credential Theft             |    -    |     -     |   ●    |    -    |   -    | -  |    ●
Data Exfiltration            |    -    |     -     |   ●    |    -    |   -    | -  |    ●
Remote Code Execution        |    -    |     ●     |   ●    |    -    |   -    | -  |    -
Privilege Escalation         |    -    |     ●     |   -    |    ●    |   -    | -  |    -
Supply-chain Attack          |    -    |     -     |   ●    |    -    |   -    | -  |    -
Persistent Memory Poisoning  |    -    |     -     |   -    |    -    |   ●    | -  |    -
Unsafe Tool Use              |    -    |     -     |   ●    |    -    |   -    | -  |    ●
```

**● = Primary Defense Point | - = Not Applicable**

---

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    THREAT INTAKE                                 │
│    External Feeds → API → Gateway → Detection Engine             │
└──────────────────────────────────────────────────────────────────┘
                              |
                              v
┌──────────────────────────────────────────────────────────────────┐
│                  ANALYSIS & CORRELATION                           │
│   Memory (Context) → ML Models → Kill Chain Mapping              │
└──────────────────────────────────────────────────────────────────┘
                              |
                              v
┌──────────────────────────────────────────────────────────────────┐
│              THREAT INTELLIGENCE STORE                            │
│         Memory Engine (SQLite + Vector DB)                       │
└──────────────────────────────────────────────────────────────────┘
                              |
                              v
┌──────────────────────────────────────────────────────────────────┐
│              MITIGATION ORCHESTRATION                             │
│   Decision Engine → Plugin System → Sandbox → Tool Execution    │
└──────────────────────────────────────────────────────────────────┘
                              |
                              v
┌──────────────────────────────────────────────────────────────────┐
│                  RESPONSE EXECUTION                               │
│     Firewall Block → EDR Isolation → Alerting → Dashboard       │
└──────────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture

### Docker Compose Stack

```yaml
Services:
  - API Backend (Go/Gin) → Port 8080
  - Frontend (React) → Port 3000
  - PostgreSQL Database → Port 5432
  - Redis Cache → Port 6379 (future)
  - Sandbox Worker (Docker) → Isolated network
```

### Container Networking

```
┌─────────────┐         ┌─────────────┐
│   Frontend  │◄────────┤   Backend   │
│  (React)    │         │  (Go/Gin)   │
└─────────────┘         └─────────────┘
                              |
                 ┌────────────┼────────────┐
                 |            |            |
           ┌─────v──┐    ┌───v────┐  ┌──v────┐
           │ Memory │    │Sandbox │  │ Ext.  │
           │ (DB)   │    │(Docker)│  │ APIs  │
           └────────┘    └────────┘  └───────┘
```

---

## Security Posture by Layer

```
Layer              Modules  Risk   Status
──────────────────────────────────────────
Gateway            1        40%    ⚠️  CRITICAL AREA
Detection Engine   5        43%    ⚠️  CRITICAL AREA
Plugin System      5        48%    ⚠️  NEEDS HARDENING
Sandbox            6        47%    ⚠️  NEEDS HARDENING
Memory Engine      1        67%    🔴 HIGH RISK
Control UI         0       100%    ✅ SECURE
External APIs      3        44%    ⚠️  REVIEW REQUIRED
```

---

## Future Enhancements

### Phase 2
- [ ] Distributed architecture (multi-region)
- [ ] Kubernetes orchestration
- [ ] Advanced ML models for threat detection
- [ ] Real-time threat feed integration

### Phase 3
- [ ] Federated threat intelligence
- [ ] Automated response playbooks
- [ ] Custom rule engine
- [ ] Compliance reporting

---

## References

- [OpenClaw Ecosystem Dashboard](https://hollobit.github.io/clawdash/#architecture)
- [MITRE ATT&CK Framework](https://attack.mitre.org)
- [OWASP Top 10 for LLM Applications](https://owasp.org)
