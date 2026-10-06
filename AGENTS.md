# ML Atlas repository instructions

## Product and format

- This repository visualizes core machine learning and deep learning theories and equations with interactive learning pages.
- Use `ml-atlas` for the learning page brand, browser title, and repository name. The README display title may use `ML Atlas`.
- Implement the website in TypeScript and React. Keep learning content in `src/data/curriculum.ts` and interactive lessons in React components under `src/components/`.
- Category display order is LLM, DL, ML, RL, 수학, 파이토치, 모델설계학습, CS. Within each category, order lessons from foundations to applications and link relevant prerequisites.
- Use light mode only and responsive layouts for mobile. The production build should also work when opened directly with `file://`.
- Preserve `transformer/index.html` as a compatibility redirect; the actual Transformer lesson must use React components, not an iframe or injected legacy HTML.
- Show equations, dimensions, numerical examples, and their visual relationships in each theory section.
- Connect drag, sliders, and selections to actual calculations. Explain illustrative assumptions and distinguish them from trained-model behavior.
- Do not add the labels `CHAPTER 01`, `학습용 결정적 예제`, or `외부 라이브러리 없이 동작` to the page chrome. Keep useful explanations of numerical examples within the relevant learning content.

## README must stay current

- Every new learning topic MUST update `README.md` in the same change.
- Update the learning table between `TOPICS:START` and `TOPICS:END`, add the topic's detailed section, and update the repository tree.
- For changes to an existing topic's theory coverage or interactions, update its README description and section table.
- Only list implemented topics and interactions. Use working relative file links and correct heading anchors.
- Preserve the concise Korean introduction, readable tables, and consistent formatting.
- Check that all registered categories and topic notes are represented in the README before completing a change. Distinguish concept notes, related experiments, and fully interactive lessons accurately.

## Validation and license

- Verify JavaScript syntax and interactions appropriate to the change. Check numerical invariants when changing mathematics.
- Use primary references for theory and include relevant reference links in the page and README.
- Preserve the Apache License 2.0 in `LICENSE`.
- Original learning text and visual content use CC BY 4.0 in `LICENSE-CONTENT`; software and code examples retain Apache 2.0. Keep `LICENSING.md`, `NOTICE`, the site footer, and generated README consistent with this scope.
