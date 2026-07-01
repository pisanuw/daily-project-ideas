# the owner — Research Map & Forward-Looking Agenda

**Prepared:** 2026-06-26
**Subject:** Full map of research areas and sub-areas across the career, with answered / partially-answered / open research questions, framed for **future research planning** and with **special emphasis on Computer Science education and digital tutors**.
**Basis:** Full CV (67 publications, 20 grants, course redesigns, supervision record) plus a deep full-text web sweep of the publications, organized into eight thematic clusters. Each cluster was retrieved and read where publicly accessible.

---

## How to read this document

Most of the *recent* and *open-access* work was read in full. A large share of the older conference papers (1994-2014) sit behind ACM/IEEE/Springer paywalls or are not digitized at all, so some claims rest on abstracts, citing papers, or reconstruction. Confidence is flagged inline:

- **[read]** — full text or substantial content read directly.
- **[abstract]** — abstract / repository metadata / citing-paper summary only.
- **[inferred]** — reconstructed from related work; not independently verified. Treat as a hypothesis about the paper, not a quotation.

A complete provenance list is in §10. Where a finding matters and could not be verified, it is marked rather than smoothed over.

---

## 1. Executive summary

### 1.1 The career in four movements

1. **Foundational AI (Northwestern, 1992-1998).** A PhD under Kenneth Forbus on *integrated reasoning for engineering problem solving* — qualitative process theory, diagrammatic/graph understanding (the **SKETCHY** system), and the idea that equations carry **functional roles** (when to apply them, what they presuppose), not just algebraic form. The test-bed was thermodynamics; the goal was a system that solves problems the way an expert does.

2. **Intelligent education tools & agents (Macquarie / early UTS, 1998-2008).** Analogy-based requirements elaboration; the **Submit!** automated program-critiquing system; *Providing timely feedback to large classes*; the **GONDOLA** game-based intelligent learning environment for requirements engineering; believable **game agents that justify their actions**; multi-agent health-data interoperability.

3. **Games research at scale (UTS Games Studio, 2008-2017).** Player experience and **affective computing** (facial-expression-based player modeling, personalised gaming); **serious games for health** (the Kinect-based StepKinnection fall-risk programme); **believable exploration** AI (Chen Si PhD); MMO/guild social identity; persuasive games and creative-collaboration studios.

4. **Teaching-focused CS education research (UW Bothell, 2017-present).** **Toolchain-first pedagogy**, course redesigns (CSS 342/343, 382, 385, 430), the **Jolly Feedback** automated feedback system, the **SIGCSE 2021** "hints without a solution" work, and the 2024 trio of papers on the evolution of CS education and the software toolchain.

### 1.2 The throughline (the single most useful framing)

One question recurs for 30 years, in different clothing:

> **How do you build a system that attaches *meaning* to formal objects — equations, code, actions, game states — and then explains its reasoning and gives timely, useful feedback?**

- In the **PhD work** the formal objects were *equations*, and the contribution was giving them functional roles plus a qualitative model that explains which apply and why.
- In **Submit!/Jolly Feedback** the objects were *student programs*, and the contribution was automated, scalable critique.
- In **game AI** the objects were *agent actions*, and the contribution was agents that can *justify* what they did (believability = explainability).
- In **affective computing** the objects were *player experiences*, made legible from facial signals.
- In **SKETCHY** the objects were *graphs*, made interpretable by a general visual-routines vocabulary.

This is not a retrofit; it is genuinely the spine of the work. It also happens to be exactly the capability that large language models made cheap in 2023-2026 — which is why so much of this older work is *newly* fundable.

### 1.3 Headline opportunity: you have already built every component of an AI tutor

The single biggest forward-looking insight in this report (developed in **§4.5**): your scattered projects, taken together, are the **complete component set of a modern intelligent tutoring system**, and the LLM era is the moment they compose:

| Tutor component | Your prior work that prefigures it |
|---|---|
| Assessment + feedback delivery substrate | Submit! (2003), Jolly Feedback (2019) |
| Hint engine (solution-free) | Suciu et al., SIGCSE 2021 |
| Domain-knowledge representation for STEM | Functional roles of equations (1997); TPS |
| Diagram / chart understanding | SKETCHY / visual routines (1994-95) |
| Reasoning-consistency / correctness checking | Qualitative process theory checks (1998) |
| Scenario / role-play process tutoring | GONDOLA (2005) |
| Socratic dialogue / explanation | Persuasive/argumentation models (2012); agents that justify actions (2001) |
| Student modeling / misconceptions | Submit! logs; "identify common misconceptions" research goal |

No single paper built the tutor. The thesis of the forward-looking agenda is that **2026 is when these assemble into one system**, and you hold an unusually complete set of the parts.

---

## 2. Map of research areas

| # | Area | Sub-areas | Era | Status |
|---|---|---|---|---|
| **I** | **CS Education & Digital Tutors** ⭐ | Automated feedback & program critiquing; solution-free hint generation; intelligent tutoring/learning environments; toolchain-first pedagogy; curriculum & grading design; games-in-education | 1997-present | **Active, primary** |
| **II** | Qualitative, Diagrammatic & Physical Reasoning | Qualitative process theory; engineering problem solving; graph/diagram understanding (visual routines); functional roles of equations | 1994-2002 | Dormant, **newly relevant** |
| **III** | Game AI & Believable Agents | Explainable/justifying agents; information-oriented design; RTS scouting & terrain; believable exploration; player archetypes | 2000-2017 | Dormant |
| **IV** | Player Experience & Affective Computing | Facial-expression player modeling; personalised gaming; crowdsourced affect data | 2012-2014 | Dormant |
| **V** | Serious Games for Health | Kinect exergames; embedded clinical fall-risk testing; immersive NUI social games; rehab (recent student work) | 2012-2016+ | Semi-active (via students) |
| **VI** | Social Play, Persuasive Games & Creative Collaboration | MMO/guild group identity; persuasive/argumentation games; outcome-driven simulations; distributed studios; location-based games; games-industry diversity | 2004-2014 | Dormant |
| **VII** | Analogy, Requirements & Multi-Agent Systems | Analogy-based requirements elaboration; HL7/agent health interoperability; pervasive computing; Kansei/creative-computing tools | 1998-2006 | Dormant, **newly relevant** |

⭐ = priority area per request.

---

# Part I — Computer Science Education & Digital Tutors ⭐

This is the through-thread that has run the longest (1997-2026) and is the active program today. It splits into three sub-areas — automated feedback, intelligent tutoring/hints, and curriculum/pedagogy — which §4.5 then re-assembles into a single digital-tutor agenda.

## I.A Automated feedback & program critiquing

**Key works:** *Providing timely feedback to large classes* (ICCE 2002) [abstract]; **Submit!** *A web-based system for automatic program critiquing* (ACE 2003) [abstract, corroborated by Keuning et al. 2019 review]; *Tools for creating interactive teaching environments* / GIFT (ICALT 2004) [abstract]; **Jolly Feedback** (CSS grant 2019; public on GitHub, [read]).

**The problem, stated early and consistently:** in large classes, manual critique is so costly that students get feedback on only 2-3 assignments a term, so they rarely learn from mistakes and instructors cannot see class-wide progress (ICCE 2002). Submit! answered this with an end-to-end web pipeline doing compilation, style, functional testing, and higher-level critique, returning feedback *before* the deadline (formative, not just summative). A preliminary study reported that students who used pre-submission feedback outperformed those who did not (corroborated via the Keuning, Jeuring & Heeren 2019 systematic review).

**Jolly Feedback** is the modern, pragmatic re-implementation: a Python tool that pulls submissions from Canvas via API, runs instructor test scripts in any language, and emails results back (cc instructor). Deployed in CSS 142. Its feedback quality is bounded by the instructor's test scripts — it reports *what* failed, not *why*. That ceiling is precisely what LLMs now lift (see I.E / §4.5).

## I.B Solution-free hint generation & intelligent tutoring

**Key works:** **Suciu, Giang, Zhao, Runandy, Dang**, *Generating Hints for Programming Problems Without a Solution* (SIGCSE 2021, Student Research Competition; Pisan advisor) [abstract]; **GONDOLA**, an intelligent, game-based learning environment for requirements engineering blending strategy/simulation/role-play with context-sensitive feedback (UTS, ~2004-05) [abstract].

**Why the SIGCSE 2021 paper matters disproportionately:** classical intelligent tutoring systems need hand-built, per-problem hint libraries — expensive and unscalable. The students, under Pisan, asked whether hints can be produced from *only the problem statement* (no reference solution), using ML classification over LeetCode problem text. It was a proof-of-concept (1-page SRC), but it framed exactly the problem that the LLM era reopened — and it framed it on the harder, more general "no solution available" footing.

## I.C Curriculum, toolchain & pedagogy

**Key works:** **Pisan (2024)** *Evolution of the Software Toolchain for Computer Science Students*, **Creative Education** 15(6):1223-1236, open access [read]; *A Toolchain-First Approach for Programming Courses* (FIE 2024) [unverified — see §10]; *The Evolution of Computer Science Education* (FCS/CSCE 2024, with Eyler, Ferguson, Liu) [exists; content not accessible]; *Everything I Learned from The Sims* (IADIS 2005) [partial]; *Helping teachers implement experience-based learning* (ICCE 2002) [abstract]; *Use of student-designed authorware* (ICCSE 2012) [abstract]. Plus the practitioner record: course redesigns of CSS 342/343 (interview-focused problem solving), CSS 382 (created Intro to AI), CSS 385 (specification/contract grading), CSS 430 (xv6, free textbook), and ~40 capstones clustered on technical-interview prep, peer instruction, and automated feedback.

**The toolchain-first thesis (the strongest recent contribution):** the *development toolchain deserves co-equal pedagogical status with the programming language.* Rather than teaching language-first and treating tools as incidental, introduce VS Code + ClangFormat + Clang-Tidy + Valgrind + Google Test + GitHub CI from day one, so the tools themselves become scaffolding that catches errors, enforces standards, and models professional practice. Evidence is a five-year, single-institution case study (2,200+ student repos; ~40-45 students/cohort; C++): qualitative gains in refactoring, earlier unit testing, lower instructor feedback burden. The paper explicitly names its limits — single institution, no control group, one language — and anticipates AI companions as "the next tool in the chain."

## I.D Education: answered / partial / open

**Answered**
- Can automated web critiquing supplement manual grading at scale, and does pre-deadline formative feedback help? — **Yes** (Submit!, 2002-03; positive preliminary outcome).
- Can a lightweight LMS-integrated tool automate the download-test-email loop for any language? — **Yes** (Jolly Feedback, 2019).
- Does day-one professional tooling improve student practice and reduce instructor load (in context)? — **Yes, within a single-institution case study** (Creative Education 2024).
- Can commercial games be used in teaching without rebuilding them? — **Yes**, via contextual framing (The Sims, 2005).
- Can scenario/role-play environments deliver context-sensitive feedback for *process* skills? — **Yes, demonstrated** (GONDOLA), though not formally evaluated.

**Partially answered**
- *Why* is automated feedback effective — content, immediacy, or extra attempts? Not disentangled.
- Can hints be generated without a reference solution? Feasibility shown (SIGCSE 2021), but no rigorous accuracy or learning-outcome evaluation.
- Does toolchain-first pedagogy improve *measured learning* (vs. practice/efficiency), and generalize beyond C++/one institution/small classes? Open by the paper's own admission.
- How has CS education evolved and what should it prioritize next? The 2024 FCS paper targets this but is not accessible for analysis.

**Open — worth pursuing now**
1. **LLM solution-free hint generation** (direct successor to SIGCSE 2021): how does LLM-generated, solution-free hint quality compare to solution-present hints on accuracy, specificity, and the "too vague vs. gives it away" failure mode?
2. **Explanatory critique beyond pass/fail** (successor to Submit!/Jolly): does a static-analysis + LLM pipeline that explains *why* code is wrong reduce resubmission cycles vs. raw test output? Testable by A/B in CSS 142.
3. **Misconception taxonomy at scale**: mine Jolly Feedback submission logs with LLM-assisted clustering to build a misconception taxonomy for intro Java/C++, then test misconception-targeted hints.
4. **Toolchain-first in the copilot era**: if an LLM produces clean, formatted, statically-clean code on demand, what mental models does early toolchain mastery still build? What must a graduate be able to do *without* AI assistance (debugging, test design, systems reasoning as the irreducible core)?
5. **Cross-context generalization**: replicate toolchain-first in Python/Java, in large sections, across institutions.
6. **Technical-interview prep as curriculum**: does interview-aligned curriculum (CSS 342/343) produce deeper CS understanding or interview-optimized surface skill? An unaddressed empirical question with equity implications.
7. **Specification/contract grading in creative-technical courses** (CSS 385): does it reduce grading inconsistency and raise autonomy, or advantage the already-skilled?
8. **Peer instruction at a teaching-focused regional university**: outcomes and conditions where cohorts are smaller, more diverse, more first-generation than the R1 evidence base.

## I.E A digital-tutor research agenda (priority forward-looking section)

This pulls threads from *across the whole career* into one coherent program. The claim: an AI tutor is not one model — it is an orchestration of components, and you have prior art in nearly all of them. Four concrete, sequenced research directions:

**DT-1 — The explanatory feedback layer (nearest-term, highest-confidence).**
Wrap Jolly Feedback's existing test-running substrate with an LLM critique layer that turns "test 3 failed" into a calibrated, pedagogically-shaped explanation that names the likely misconception and the next conceptual step *without* revealing the answer. This is a clean A/B study in CSS 142/143 with an outcome metric you already log (resubmission count, time-to-pass). Risk: low. Novel angle vs. the crowded LLM-feedback field: grounding the critique in your *own* misconception taxonomy (DT-2) rather than generic prompting.

**DT-2 — Misconception modeling from real logs.**
You have years of submission data. LLM-assisted clustering of errors by *inferred conceptual cause* (not surface error type) yields a student model. This is the "identify common misconceptions" goal made tractable, and it is the student-modeling component every tutor needs.

**DT-3 — STEM tutoring grounded in functional roles + qualitative checking (the distinctive bet).**
This is where your PhD work becomes a moat. LLMs are fluent but apply equations outside their validity conditions and combine multi-state physics inconsistently. Your 1997 *functional roles of equations* (each equation annotated with trigger conditions, assumptions, preferred solve-direction, scope) and your 1998 *qualitative process* consistency checks are exactly the symbolic scaffolding that makes an LLM STEM tutor *correct*, not just fluent. Architecture: LLM proposes equation chains; a functional-roles knowledge base + a QPT-style critic vetoes physically inconsistent steps. The open research question you already posed in 1997 returns: can functional roles be *learned* (LLM-extracted from textbooks and verified against worked examples) rather than hand-encoded? This is a fundable neuro-symbolic STEM-tutoring program with a 30-year provenance few can claim.

**DT-4 — Scenario and Socratic tutoring (GONDOLA + argumentation, reborn).**
GONDOLA delivered feedback inside role-play scenarios for requirements engineering; the bottleneck was authoring believable virtual participants. LLMs remove that bottleneck. Combine with the *persuasive/argumentation models* (2012) and *agents that justify their actions* (2001) to build a Socratic tutor that argues, asks, and explains its own reasoning. Research question: does an LLM-backed scenario tutor for software-engineering *process* skills (elicitation, design review) produce learning gains comparable to classroom instruction — and are its justifications *faithful* or merely plausible (the explainability question from your 2001 work)?

**Sequencing for planning:** DT-1 → DT-2 are low-risk, fast, publishable, and build on infrastructure you own. DT-3 is the high-distinctiveness, higher-effort bet that differentiates you from the generic "LLMs for CS education" crowd. DT-4 is the long-horizon, broad-impact piece.

---

# Part II — Qualitative, Diagrammatic & Physical Reasoning

*(PhD-era; dormant since ~2002; the most surprisingly relevant cluster in 2026.)*

**Key works (several [read] from the QRG archive):** PhD thesis *An integrated architecture for engineering problem solving* (Northwestern 1998); *Visual reasoning about physical properties via graphs* (QR 1994) and its expansion *A visual routines based model of graph understanding* (Cognitive Science Society 1995) — the **SKETCHY** system; *Controlling engineering problem solving* (QR 1996; Australian AI 1997) — the **TPS** thermodynamics solver; *Functional roles of equations* (1997); *Using qualitative reasoning to solve dynamic problems* (QR 1998).

**What was actually built.** SKETCHY interpreted line graphs domain-independently using a vocabulary of visual routines (slope, intersection, region, change-of-slope, label-binding), tested on 65 economics+thermodynamics graphs, producing textbook-quality descriptions with no domain knowledge. TPS solved 150+ thermodynamics problems by attaching *functional roles* to equations and using qualitative process theory to decide which apply, which parameters stay constant across states, and which hidden intermediate states exist — using ~12 equations where a contemporaneous system used 42.

**Answered:** graph understanding can be domain-independent; qualitative reasoning can supply the *control* knowledge for engineering problem solving; dynamic multi-state problems are genuinely harder for identifiable reasons (constancy detection, hidden-state envisionment) and need QR, not just algebra; functional classification of equations improves problem-solving efficiency.

**Partially answered:** depth of diagram↔equation coupling in the integrated architecture; psychological validity of the visual-routines model (no attention/capacity model).

**Open — newly relevant to multimodal AI and STEM tutoring:**
- **Visual routines as an evaluation framework and prompting scaffold for chart understanding.** Modern multimodal LLMs fail exactly at slope/intersection/scale/region reading. The 1995 vocabulary is a ready-made task analysis and benchmark, and a candidate chain-of-thought decomposition.
- **Functional roles as a structured prior for LLM STEM reasoning** (feeds **DT-3** above).
- **Problem-guided envisionment as neuro-symbolic control** for multi-state physics word problems where LLMs miss intermediate states.
- **QPT as a self-consistency critic** for physics-reasoning LLMs.
- **A "shared representational structure" question:** SKETCHY's 1994 result that thermodynamics and economics graphs share geometric structure interpretable by one vocabulary prefigures today's representation-convergence debates (e.g., the Platonic Representation Hypothesis, Huh et al. 2024 — a theme that also appears in the current cagent research journal). Whether a *universal* diagrammatic-reasoning module is buildable, or whether domain priors are essential, is open and timely. *(Connection flagged, not asserted as a settled agenda.)*

---

# Part III — Game AI & Believable Agents

**Key works [mostly abstract]:** *Increasing believability: agents that justify their actions* (FUZZ-IEEE 2001); *Should intelligence be more than pixel deep?* (2001); *Building characters: a form of knowledge acquisition* (AAAI 2000); *AI vs clever design for intelligent game characters* (2006); *Information-oriented design and game AI* / *Enhancing information acquisition in game agents* (Welsh & Pisan, 2005); *Artificial actors for real-world environments* (Roberts, AAAI 2002; Pisan-supervised, University Medal); the RTS line with Chen Si — *Scouting strategy* (2014), *Automated terrain analysis* (2014), *Understanding players' map exploration styles* (2016); and Si's PhD *Believable Exploration* (2017).

**Answered:** agents that *justify* actions raise perceived believability (believability = explainability, not pixels); two-tier react/reason architectures enable real-time characters; affordance-based information-oriented design improves agent behavior; non-cheating RTS agents can build map knowledge incrementally; human players exhibit four classifiable exploration archetypes (Wanderers, Seers, Pathers, Targeters), significantly predicted by gender, play time, and navigation ability; heuristic agents designed from a human baseline improve believability (gap narrowed, not closed).

**Partially answered:** when "clever design" beats real AI; cross-genre generality of information-oriented design; whether *style-matched* agents beat a single universal policy.

**Open — worth pursuing now:**
- **Faithful vs. plausible justification in LLM NPCs** — the 2001 question reborn as the XAI explanation-vs-rationalization distinction; measure whether LLM justifications raise believability *without* eroding trust when the agent errs.
- **Style-matched believable companions** via cheap imitation learning per archetype; effect on immersion/session length.
- **Do LLM game agents implement information-oriented design naturally, or over-attend to irrelevant detail?** (the inverse 2005 failure mode).
- **Non-cheating RTS at modern scale** — MCDM scouting + model-based RL without map privilege; are such agents more satisfying opponents?
- **Real-time archetype detection** (first 5 minutes) driving adaptive NPC behavior.

---

# Part IV — Player Experience & Affective Computing

**Key works (with Tan & Bakkes; several [abstract], one repository PDF located):** *Personalised gaming* (J. Creative Technologies 2013 / IE'12) — an 8-component, 4-pillar taxonomy still widely cited; *A feasibility study using facial expressions to evaluate player experience* (IE'12); *Towards automated player experience detection with computer vision* (CHI'12 workshop); *Inferring player experiences using facial expressions* (IE 2014) and *Correlation between facial expressions and the GEQ* (ICEC 2014); the **BeFaced** crowdsourcing game (FDG/CHI 2014); a touch-tablet handwriting serious game (ICEC 2013).

**Answered:** facial-expression analysis is a feasible, non-intrusive player-experience sensor; automatically-extracted expression intensities correlate significantly with GEQ dimensions (most robustly the *challenge* dimension, consistently across two contrasting games); game mechanics can recruit players to crowdsource labelled affect data (BeFaced proof-of-concept); personalised gaming has a durable conceptual taxonomy.

**Partially answered:** closing the loop (sensing was shown; runtime affect-*driven* adaptation was not built); cross-genre generality of expression models (only *challenge* generalized cleanly); whether in-the-wild crowdsourced affect data matches lab quality (18-participant pilot).

**Open — worth pursuing now:** multimodal-LLM/VLM affect sensing as a drop-in replacement for dedicated AU pipelines (replicate the Portal 2 / Draw My Thing protocol with a VLM backend); **LLM-as-adaptation-engine** to finally close the personalisation loop; **privacy-first on-device** affect inference (especially given child-facing serious games); a properly-powered re-test of whether GEQ dimensions beyond *challenge* have any reliable facial correlate; synthetic-data augmentation of BeFaced-style datasets.

---

# Part V — Serious Games for Health

**Key works (Garcia, Felix Navarro, Tan, Schoene, Smith; mix of [read] and [abstract]):** *Exergames for the elderly: towards an embedded Kinect-based clinical test of falls risk* (HIC 2012, Best Student Paper); **StepKinnection** — *a hybrid clinical test for fall-risk assessment* (CHI 2014) and *assessing the Kinect's capabilities for a time-based clinical test* (ICEC 2014); the downstream pilot trial (Games for Health J., 2016) and a prospective study (Schoene et al.) [both [read] in full]; Brondi et al., *competition vs collaboration in an immersive NUI game* (VRST 2015) [read]. Recent student theses extend toward VR rehab and EEG/EMG (Heo, Gahatraj, Raj, 2024).

**The programme in one line:** a single bespoke Kinect stepping exergame that simultaneously *trains* older adults and *embeds a validated fall-risk clinical test* (Choice Stepping Reaction Time) — therapy and surveillance in one loop.

**Answered:** a consumer depth sensor can replace a custom dance-mat for CSRT administration (favorable agreement); the home, unsupervised game is safe and adhered-to (83% completion over 12 weeks, no adverse events); a 12-week intervention significantly improved CSRT (~11%), TUG (~13%), gait speed (22-29%), balance, and sit-to-stand (pilot); collaboration maximizes social presence while competition maximizes performance in immersive NUI games.

**Partially answered:** prospective fall *prediction* — the Kinect *reaching* RT predicted 6-month falls, but the *stepping* test alone did not reach significance (n=94); incremental value of the dual-task (cognitive+motor) hybrid over plain CSRT was designed but not separately validated; longitudinal sensitivity to decline not established.

**Open — worth pursuing now:** **smartphone/webcam pose estimation** (MediaPipe/MoveNet/ARKit) as a zero-hardware-cost successor to the discontinued Kinect, validated against the dance-mat benchmark (home-lab stepping r≈0.81 is the bar); **VR headset inside-out tracking** for CSRT-equivalent assessment + rehab; **continuous passive fall-risk monitoring** with a clinician dashboard (infrastructure already partly built); **generalization to neurological populations** (Parkinson's, post-stroke), linking to the 2024 EEG/EMG student work; **social/multiplayer mechanics for long-term adherence**.

---

# Part VI — Social Play, Persuasive Games & Creative Collaboration

**Key works [mostly abstract]:** *Dissecting group identity in MMOs* (GAMEON-NA 2007) and *My guild, my people: role of guilds in MMOs* (IE2007); *Persuasive environments: argumentation models in serious games* (ICCSE 2012); *SimEnv: outcome-driven simulations* (ICCSE 2012); *Challenges for network computer games* (IADIS 2004); the distributed-studio/creative-collaboration line (Weiley & Pisan, OZCHI 2008; C&C 2009) and *situated collaborative storytelling* (Hills, Edmonds & Pisan, IE2008); location-based-games grants (2007-2010); *Aussie women game developers* (Taylor & Pisan, FDG 2014).

**Answered:** in MMO guilds the **affective** component (mutual liking, enjoyment) dominates group identity over cognitive/behavioral components; the core network-game design tensions are latency (the critical bottleneck) vs. bandwidth vs. the structural cheating problem of distributing game state; the Australian games workforce was ~8.4% women, with the primary barrier at the *interest/university-entry* stage rather than workplace hostility (a distinctive national finding); a five-principle framework for distributed creative studios (incl. "transform space into inhabited place").

**Partially answered:** whether argumentation models actually change player behavior (framework proposed; evaluation not retrievable); whether CBR + story-manager solves the branching-narrative problem (architecture proposed; not evaluated); whether distributed-studio principles yield better creative outcomes; whether location-based games build lasting community.

**Open — worth pursuing now:** does the affective-dominant guild model **generalize to Discord-era, cross-game social graphs and "cozy" communities** where the game is secondary?; **LLM-driven NPCs vs. CBR story managers** for *outcome-steered* (not just plausible) narrative — a clean comparison with a citable prior (SimEnv); rigorous evaluation of **argumentation-based persuasive games** for behavior change (climate, health, civics) now that the tooling is mature; **updating the distributed-studio principles** for hybrid + AI-augmented creative teams; a **Pokemon-Go-era synthesis** of whether location-based co-presence builds durable bonds; a **2026 replication** of the Australian women-in-games census.

---

# Part VII — Analogy, Requirements & Multi-Agent Systems

**Key works [mostly abstract/inferred]:** *Using analogy to elaborate requirement specifications* (1998) and *Extending requirement specifications using analogy* (ICSE 2000) — Structure-Mapping-Theory/SME-based reuse; the **eMAGS** HL7-ontology + mobile-agent health-interoperability work (Orgun, Pisan et al., CIT 2002; expanded in Computers in Biology & Medicine 2006); *A survey of challenges for next-generation pervasive computing* (Kang & Pisan, ISCIS 2006); the Kansei-filter creative-computing tools (Berry et al., AUIC 2006; *Programming in the world*, Digital Creativity 2006).

**Answered:** analogical (SME) structural matching can drive requirements reuse *without* domain-specific ontologies/templates (proof-of-concept, ICSE 2000); an HL7-grounded ontology + mobile agents can give heterogeneous medical systems interoperability without redesign (eMAGS); a structured taxonomy of pervasive-computing challenges ca. 2006 (context-awareness, middleware, resource limits, security, UI).

**Partially answered:** industrial-scale validity of analogical requirements elaboration; perceptual validity of Kansei motion filters (test-bed, not evaluation).

**Open — worth pursuing now:** **analogy-based requirements elaboration via LLM/RAG**, using SME-style *structural* matching as a principled alternative to pure LLM generation (cf. 2025 multi-agent requirements frameworks) — and finally answering Pisan's open evaluation question with modern NLP metrics + user studies; **an eMAGS successor on FHIR R5 + a modern multi-agent framework + an LLM semantic layer** for cross-EHR reconciliation; **an updated pervasive-computing survey** centered on LLM-grounded context inference; **a proper evaluation of Kansei/affective motion filters** with today's affect-sensing tools.

---

## 4. Cross-cutting future directions

Five places where multiple threads converge into something bigger than any one cluster.

**4.1 The composed AI tutor (see §1.3 and I.E).** The flagship. Education + functional-roles/QPT reasoning + diagram understanding + justifying agents + scenario simulation = a STEM/CS tutor whose *correctness* and *explanations* are grounded, not just fluent. This is the highest-leverage convergence and the strongest fit to the stated priority.

**4.2 Explainability as a career-long invariant.** "Agents that justify their actions" (2001), persuasive/argumentation models (2012), and the qualitative reasoning that *explains which equation applies* (1996-98) are the same commitment. The 2026 version is the faithfulness question: do LLM explanations describe the actual computation or post-hoc rationalize? You have an unusually long runway to frame and own this in education and game-agent contexts.

**4.3 Diagram/chart/physical reasoning for multimodal AI.** SKETCHY's visual routines + QPT consistency checking address documented, current failure modes of multimodal LLMs on charts and multi-state physics. This is a publishable neuro-symbolic line that revives dormant IP, and it feeds the STEM tutor (4.1).

**4.4 Affect- and behavior-adaptive systems, privacy-first.** Player-experience sensing (IV) + serious-games-for-health (V) + Kansei (VII) all want a real-time human-state signal driving adaptation. The 2026 enabling move is on-device multimodal sensing + an LLM adaptation engine; the 2026 constraint is privacy (especially child- and patient-facing). Closing the loop you left open in 2014 is now tractable.

**4.5 Health + games + reasoning.** The Kinect fall-risk programme is hardware-orphaned but methodologically intact; phone/VR pose estimation revives it cheaply, and an LLM "clinician dashboard" narrator + a QPT-style consistency check on movement metrics connects it to the reasoning cluster.

---

## 5. Priority research agenda — ranked shortlist (for planning)

Ordered by *(impact × fit-to-priority) ÷ effort/risk*, intended as a planning menu rather than a commitment.

| Rank | Project | Cluster(s) | Why now | Risk |
|---|---|---|---|---|
| 1 | **DT-1: LLM explanatory-feedback layer over Jolly Feedback**, A/B in CSS 142/143 | I | Owns the infrastructure; fast, publishable; directly on-priority | Low |
| 2 | **DT-2: Misconception taxonomy from submission logs** (LLM clustering) | I | Unique data asset; feeds DT-1/DT-3; SIGCSE/ICER-shaped | Low |
| 3 | **DT-3: Functional-roles + QPT-grounded STEM tutor** (LLM proposes, symbolic critic vetoes) | I + II | The distinctive bet; 30-year provenance few can match | Med |
| 4 | **Visual-routines benchmark + scaffold for multimodal chart understanding** | II | Revives dormant IP; hot eval problem; feeds DT-3 | Med |
| 5 | **Solution-free LLM hint generation** (successor to SIGCSE 2021) | I | Reopens a question you framed first; strong student-research vehicle | Low-Med |
| 6 | **Phone/VR pose-estimation successor to StepKinnection** | V | Hardware-orphaned method, cheap revival; clear clinical bar | Med |
| 7 | **Faithful-vs-plausible justification in LLM NPCs / tutors** | III + I | Career-long invariant; XAI relevance | Med |
| 8 | **Toolchain-first in the copilot era / "what must a grad do without AI"** | I | Field-defining framing; you have the platform and the data | Med |
| 9 | **Analogy/SME + LLM requirements assistant**, evaluated | VII | Answers your own 2000 open question with modern tooling | Med |
| 10 | **Discord-era replication of the affective-guild model** | VI | Clean replication with a citable 2007 prior | Low-Med |

**Reading of the menu:** ranks 1-3 are a single coherent education arc you could start immediately on owned infrastructure; rank 4 is the dormant-IP revival that most differentiates you; ranks 6-10 are strong adjacent bets if collaborators or students align.

---

## 6. Notable patterns and honest caveats

- **You consistently build systems and frameworks, then under-evaluate them.** Submit!, GONDOLA, SimEnv, persuasive environments, distributed studios, Kansei filters, toolchain-first — many are proposals/architectures with light or unpublished evaluation. In planning terms, the cheapest high-value moves are often *rigorous evaluations of things you already built or proposed* (DT-1, ranks 9-10), not new systems.
- **A lot of your older IP is newly fundable** because LLMs made the expensive part cheap (hint libraries, scenario authoring, affect sensing, equation/diagram knowledge). The PhD cluster (II) is the clearest example.
- **Source confidence is uneven.** The 2024 toolchain paper, the 1995 SKETCHY paper, the 2016 health pilot, and the VRST 2015 paper were read in full. Several pivotal claims (Submit! outcomes, *functional roles of equations*, the FIE 2024 and FCS 2024 papers, the 1997 "AI for everyone" workshop paper) are abstract-level, inferred, or unverified — flagged in §10. Treat numeric and outcome claims on [abstract]/[inferred] items as provisional pending the primary text.

---

## 7. Open questions inventory (consolidated quick-reference)

**Education / digital tutors (priority):** solution-free LLM hints vs. solution-present; explanatory critique vs. pass/fail (resubmission outcome); misconception taxonomy from logs; toolchain-first under copilots and across contexts; what a graduate must do without AI; interview-prep transfer; spec-grading equity; peer instruction at regional universities; faithful tutor explanations; functional-roles/QPT-grounded STEM tutoring; LLM scenario/Socratic tutors (GONDOLA reborn).

**Reasoning / multimodal AI:** visual routines as benchmark + CoT scaffold; functional roles as structured prior; problem-guided envisionment for multi-state physics; QPT as LLM self-consistency critic; universal vs. domain-specific diagrammatic reasoning (representation-convergence link).

**Game AI:** faithful vs. plausible LLM-agent justification; style-matched companions; information-oriented design in LLM agents; non-cheating RTS at scale; real-time archetype adaptation.

**Affect / experience:** VLM affect sensing; LLM adaptation engine (close the loop); on-device privacy-first sensing; powered re-test of GEQ-dimension facial correlates; synthetic affect data.

**Health:** phone/VR pose estimation vs. dance-mat; continuous passive monitoring + dashboard; neurological populations; social mechanics for adherence.

**Social / collaboration:** affective-guild model in Discord era; LLM vs. CBR outcome-steered narrative; argumentation games for behavior change; hybrid + AI-augmented studio principles; Pokemon-Go-era location-game synthesis; women-in-games replication.

**Requirements / agents:** SME + LLM requirements assistant (evaluated); FHIR-based eMAGS successor; updated pervasive-computing survey (LLM context inference); Kansei/affect filter evaluation.

---

## 8. Suggested framing for a research statement or grant

If you want a one-paragraph identity that fits 30 years and points forward:

> *I build systems that attach meaning to formal artifacts — equations, programs, agent actions, diagrams — and that explain their reasoning and give learners and users timely, grounded feedback. Across qualitative reasoning, game AI, and computer-science education I have repeatedly built the pieces of an explainable, feedback-giving tutor. My current work composes them: pairing large language models with the symbolic scaffolding (functional roles of equations, qualitative consistency checks, misconception models, diagram-understanding routines) that makes machine tutoring not merely fluent but correct and explainable.*

---

## 9. Appendix — sources retrieved vs. not accessible (by cluster)

**Read in full (representative):** Pisan (2024) *Evolution of the Software Toolchain* (Creative Education, OA); Jolly Feedback README (GitHub); SKETCHY 1995 (CogSci, QRG archive); TPS/QR 1996 (QRG HTML); Pisan & Bachmann 1998 (AAAI WS); StepKinnection pilot trial (Games for Health J. 2016) and Schoene et al. prospective study (PMC); Brondi et al. VRST 2015 (UTS repository); T4G project pages; multiple UTS Games Studio project pages.

**Abstract / metadata / citing-paper level:** Submit! (ACE 2003; corroborated by Keuning et al. 2019); *Providing timely feedback* (ICCE 2002); GIFT/ICALT 2004; Suciu et al. SIGCSE 2021; GONDOLA; the affective-computing IE'12/IE'14/ICEC'14 papers; the MMO/persuasive/distributed-studio papers; ICSE 2000 analogy paper; eMAGS; Kang & Pisan 2006; Berry et al. 2006.

**Unverified / not accessible / content not retrievable:**
- *A Toolchain-First Approach for Programming Courses* (FIE 2024) — companion paper not independently confirmed in IEEE Xplore/program; treat as unverified.
- *The Evolution of Computer Science Education* (FCS/CSCE 2024, Springer LNCS) — volume confirmed; specific paper content behind auth, not analyzed.
- *AI for everyone: reaching all undergraduate students* (1997) — not found in any index; title/venue from CV only.
- *Functional roles of equations* (1997) and *Controlling engineering problem solving* (Australian AI 1997) — citations confirmed; full text not retrieved; content inferred from sibling papers.
- PhD thesis (1998) — DTIC record exists (ADA465520) but the scanned PDF was not text-extractable; structure reconstructed from component papers.
- *Using analogy to elaborate requirement specifications* (1998) and the HL7 affiliates paper (2002) — not digitized/indexed.

*Numeric and outcome claims attached to abstract/inferred items should be confirmed against the primary text before use in a grant or statement.*

---

*End of report.*
