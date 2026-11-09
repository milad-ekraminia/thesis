# LLM-Generated Tests: Project Record and Research Guide

This is the canonical project and study document. It records the current workspace,
what has been completed, and a repeatable plan for validating the corpora and running
the research. Keep future corpus instructions and study decisions here so they do not
become scattered across separate planning documents.

## 1. Purpose and current research idea

The project explores whether structured guidance helps large language models generate
more useful tests for non-trivial JavaScript methods. The proposed guidance is
**Strategic Locational Sections (SLS)**: short labels in a method's documentation that
identify meaningful decision points, loops, validation steps, and output construction.

A suitable research question is:

> Does providing an SLS map improve the behavioral quality of LLM-generated tests,
> compared with providing the same source code without that map?

Treat the current methods as a **hand-authored pilot corpus**, not as a validated
benchmark. A runnable suite and high code coverage do not, on their own, prove that a
method implements its intended behavior or that a generated test is meaningful.

## 2. What has been done

### Project setup

- Selected JavaScript and ES modules, matching the researcher's strongest language.
- Configured Vitest and its V8 coverage provider in the workspace.
- Added `npm test` and `npm run test:coverage` scripts.
- Configured Vitest to discover test files ending in `-copilot-test.js`.
- Added `.gitignore` entries for installed dependencies and generated coverage output.

### First corpus

The original 20 methods are now in their own method-named folders at the workspace
root. Each folder contains the implementation, an SLS document, and a
`-copilot-test.js` test file:

`applyPatchOperations`, `assignPartitionsToNodes`, `auditTransactionLedger`,
`calculateDecayedEma`, `calculateNetPayable`, `calculateSlidingWindowMaxima`,
`decodeCompressedStream`, `deduplicateRecords`, `evaluateQueryPredicate`,
`evaluateResourceBurst`, `evaluateSemVerRequirement`, `executeWorkflowTransition`,
`matchHttpRoute`, `multiplySparseMatrices`, `parseIndentedList`,
`resolveCssCascade`, `resolveDependencyPipeline`, `schedulePriorityIntervals`,
`unpackVarintStream`, and `verifyAccessAuthorization`.

### Second corpus

The folder [copiiot-codes-1](./copiiot-codes-1) contains 20 additional
methods. Each method has a folder containing a `.js` implementation, `.md` SLS
description, and `-copilot-test.js` test file. Its [README](./copiiot-codes-1/README.md)
is superseded by this document; this guide is the canonical place for future workflow
instructions.

The additional methods are:

`aggregateSalesByRegion`, `allocateBudget`, `analyzeLogWindow`,
`buildDependencyLayers`, `calculateCapacityPlan`, `calculateInvoice`,
`compareSnapshots`, `computeHistogram`, `estimateShipping`,
`findLongestIncreasingRun`, `findShortestPath`, `flattenTree`,
`mergeSortedEventStreams`, `normalizePhoneNumber`, `paginateRecords`,
`parseCsvRows`, `planRetries`, `reconcileInventory`, `topKFrequentWords`,
and `validateForm`.

All 20 second-corpus source files were checked to contain at least 45 physical lines
and `if`, `for`, and `while` constructs. Physical line count includes comments and
blank lines; it must not be reported as executable LOC. For research selection, define
and report the actual executable-LOC measurement method separately.

### Current baseline verification

At the last recorded run, the combined workspace suite passed **167 tests in 40 test
files**. Combined measured coverage was **92.50% branches** and **98.25% lines**
(V8 provider). These are baseline results for the supplied tests, not results from an
LLM experiment. Rerun the commands below before relying on these values; coverage
changes when code or tests change.

## 3. Run and inspect the project

Run commands from the workspace root:

```sh
npm install
npm test
npm run test:coverage
```

Use the committed lockfile to keep dependency versions consistent. Do not compare
coverage results from different runner/provider versions or configurations without
reporting the difference. Coverage output is generated under `coverage/` and is
ignored by Git.

## 4. Work still to do before the paper experiment

These are recommendations, not completed experimental work.

1. **Freeze the research question and outcomes.** Decide whether the primary outcome
   is branch coverage, mutation score, behavioral correctness, or a predeclared
   combination. Name one primary outcome and treat the rest as secondary.
2. **Audit every method's contract.** For each implementation, write explicit
   preconditions, result shapes, boundary behavior, and error behavior. A reviewer
   who did not write the tests should check the contract and implementation. Fix
   ambiguous or incorrect reference behavior before collecting measured results.
3. **Create independent expected-behavior oracles.** Specify expected results from
   the written contract, not from the implementation alone. Use hand-reviewed
   examples, independent reference implementations, or property-based invariants as
   appropriate. Keep this oracle separate from LLM prompts.
4. **Review corpus composition.** Document selection criteria such as executable LOC,
   decision/branch count, loop types, algorithm/domain, input complexity, and
   deterministic behavior. Avoid selecting examples only because their line count is
   large. State clearly that the corpus is small and hand-authored.
5. **Pilot the protocol.** Try each prompt on a small, preselected subset. Find
   confusing instructions, package/setup issues, and scoring ambiguities, then freeze
   the protocol before measured runs.
6. **Run multiple independent generations.** A single output per method is not
   enough to characterize a probabilistic model. Predefine the number of runs and
   report per-method as well as overall results.
7. **Evaluate test quality, not just execution.** Review assertions for meaningful
   behavior, false positives, vacuous checks, duplicated cases, and agreement with
   the independent contract. Use mutation testing to check whether tests detect
   plausible faults.
8. **Analyze at the correct unit.** The method/run is typically the experimental
   unit; individual assertions from one generated suite are not independent samples.
   Report variability and failures, not only a pooled percentage.
9. **Publish reproducibility details.** Preserve corpus version/hash, exact prompts,
   model/provider/version, date, generation parameters, per-run raw output, test
   execution logs, package lockfile, coverage/mutation configuration, exclusions,
   scoring rubric, and analysis scripts.

## 5. Suggested controlled experiment

Keep the source code, model/version, tool access, temperature and other generation
settings, output format, time/token budget, number of attempts, and test environment
the same across groups. Change only the intended prompting treatment.

| Group | Input provided | Purpose |
|---|---|---|
| A: Code-only | Source code and a request to create runnable Vitest tests | Baseline |
| B: Branch checklist | Same source plus a request to identify branch conditions and propose representative inputs | Structured test-planning comparison |
| C: SLS-guided | Same source plus its SLS section descriptions and a request for tests addressing each section | Main treatment |
| D: SLS + feedback (optional) | Group C input plus a fixed, predeclared number of coverage-feedback rounds | Iterative-feedback treatment |

Do not request hidden chain-of-thought. Ask for the test code and a concise,
user-facing list of test cases or a brief rationale instead. If Group D has extra
feedback rounds, report the extra tool calls, time, and tokens; do not present it as
an equal-cost comparison unless the budget is equalized.

### Reproducible prompt skeleton

Use the same skeleton for each group, changing only the declared group-specific
material:

```text
Write runnable Vitest tests for the JavaScript function below.
Use the documented public behavior only. Do not modify the implementation.
Include normal cases, boundary cases, invalid inputs, and relevant branch outcomes.
Use assertions that check observable results, not merely that the function runs.
Return the test file and a concise list of the behaviors it covers.

[Insert the fixed source code and, for the assigned group only, its allowed guidance.]
```

Do not expose a contract or answer key to one group unless the same information is
provided to every group. If SLS descriptions reveal additional behavioral
specification, document that difference as part of the treatment.

## 6. Outcomes and reporting

### Recommended measures

- **Branch coverage:** Percentage of instrumented branch outcomes executed.
- **Line coverage:** Useful descriptive measure, but not a proxy for test quality.
- **Mutation score:** Percentage of non-equivalent seeded mutants killed by the tests.
  Record the mutation tool/version, mutators, exclusions, and handling of equivalent
  mutants.
- **Test-generation success:** Whether output parses, imports, and runs without
  manual edits; record syntax, import, timeout, and assertion failures separately.
- **Behavioral quality:** Reviewer score against the frozen contract, including
  assertion relevance and whether tests fail for seeded plausible defects.
- **Cost:** Generation time, tokens, feedback rounds, and repair effort.

Coverage can be high while assertions are weak. Report mutation and contract-based
quality measures alongside coverage. Replace the former vague “mocking/act failures”
metric with explicit categories such as invalid test syntax, import/setup failure,
runtime error, timeout, and incorrect assertion.

### Report each result with context

Record per corpus item and per generation run: group, method ID, model/version,
prompt version, run number, generation settings, generated-test status, coverage,
mutation result, review score, time, token use, and any allowed repair. Summarize
distributions and uncertainty; do not report only the best run.

## 7. Adding future corpus methods

Add future sets in a clearly named folder without moving or overwriting existing
methods. For example:

```text
copiiot-codes-2/
  README.md                 # Optional corpus-specific inventory only
  methodName/
    methodName.js
    methodName.md
    methodName-copilot-test.js
```

For each new method:

1. Choose a distinct, descriptive function and folder name.
2. Write the intended contract before finalizing implementation or tests.
3. Keep the implementation deterministic where practical; if time/randomness is
   required, inject a clock/seed rather than relying on ambient state.
4. Include meaningful `if` branches and loop logic when those are the selection
   criteria. If retaining a 45-line minimum, define whether that means physical LOC
   or executable LOC, and do not inflate code with comments just to pass the count.
5. Add an SLS document naming each significant validation point, loop, decision,
   boundary, and output transformation. Section labels should describe where logic
   lives, not give away tests only to the treatment group.
6. Add tests ending exactly in `-copilot-test.js`; keep tests isolated and assert
   complete observable behavior. Add independent expected cases before LLM runs.
7. Run the entire suite and coverage command. Review any regression, unexpected
   coverage movement, or test that passes for the wrong reason.
8. Update the inventory and corpus count in this guide, and record any changes to
   frozen methods as a new corpus version.
9. Do not include generated coverage output or `node_modules/` in the corpus.

## 8. Current caveats

- The supplied tests are hand-authored development tests; they are not generated
  outputs from the proposed experimental groups.
- High baseline coverage does not demonstrate that the implementations are correct
  against a domain-approved specification.
- The methods are synthetic examples rather than a representative sample of
  production projects. Generalization beyond this corpus should be stated cautiously.
- A method's SLS note may itself reveal test targets. Define carefully whether and
  how that guidance is withheld from control groups.
- The original set includes simplified domain examples. For instance, a simplified
  version-range matcher should not be described as a complete standards-compliant
  SemVer implementation without additional validation.
- Changes to implementation, contracts, SLS notes, prompts, runner settings, or
  tests after the study begins can compromise comparability. Version and freeze them.
