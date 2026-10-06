# ML Atlas repository instructions

## Product and format

- This repository visualizes core machine learning and deep learning theories and equations with interactive learning pages.
- Brand all learning pages as `ML Atlas`. The repository name is `ml-atlas`.
- Create each topic at `<topic>/index.html`; keep its HTML, CSS, and JavaScript in that single file.
- Use light mode only. Prefer self-contained pages that also work when opened directly with `file://`.
- Show equations, dimensions, numerical examples, and their visual relationships in each theory section.
- Connect drag, sliders, and selections to actual calculations. Explain illustrative assumptions and distinguish them from trained-model behavior.
- Do not add the labels `CHAPTER 01`, `학습용 결정적 예제`, or `외부 라이브러리 없이 동작` to the page chrome. Keep useful explanations of numerical examples within the relevant learning content.

## README must stay current

- Every new learning topic MUST update `README.md` in the same change.
- Update the learning table between `TOPICS:START` and `TOPICS:END`, add the topic's detailed section, and update the repository tree.
- For changes to an existing topic's theory coverage or interactions, update its README description and section table.
- Only list implemented topics and interactions. Use working relative file links and correct heading anchors.
- Preserve the concise Korean introduction, readable tables, and consistent formatting.
- Check that all topic directories are represented in the README before completing a change.

## Validation and license

- Verify JavaScript syntax and interactions appropriate to the change. Check numerical invariants when changing mathematics.
- Use primary references for theory and include relevant reference links in the page and README.
- Preserve the Apache License 2.0 in `LICENSE`.
