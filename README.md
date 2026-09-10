# gnam — Food Operating System v6.2

Static web app for GitHub Pages. No backend or build step is required.

## Important recipe-quality change

The planner no longer fabricates recipes by combining arbitrary pantry ingredients into names such as “saltato in padella: X + Y”. Those generated combinations have been disabled. The calendar uses only the curated recipe bank, and a recipe must pass a QA gate before it can enter the planner:

- minimum 2 ingredients, positive quantities and known ingredient metadata
- 4 or more kitchen-specific preparation steps
- curated editorial status
- no generated/fallback recipe naming
- full ingredient coverage from the current pantry before scheduling

This means that, with a very restrictive pantry, Gnam may deliberately leave some of the 14 slots empty instead of inventing a dish.

## Recipe sources and method

The curated bank contains established dishes and standard home-cooking preparations. Representative procedures were checked against published recipes from established cooking sources, including GialloZafferano and BBC Good Food. Selected recipes expose a direct source link inside the recipe modal. Examples checked during this revision include pasta e zucchine, pasta e lenticchie, pollo al limone, pollo al curry, salmone con patate al forno, shakshuka, polpette di lenticchie and risotto ai funghi.

Examples of reference pages:
- https://ricette.giallozafferano.it/Pasta-e-zucchine.html
- https://ricette.giallozafferano.it/Pasta-e-lenticchie.html
- https://ricette.giallozafferano.it/Pollo-al-limone.html
- https://ricette.giallozafferano.it/Pollo-al-curry.html
- https://blog.giallozafferano.it/lacucinadiloredana/ricetta-salmone-con-patate-al-forno/
- https://www.bbcgoodfood.com/recipes/shakshuka
- https://ricette.giallozafferano.it/Polpette-di-lenticchie.html
- https://blog.giallozafferano.it/asilannablu/risotto-con-champignon-e-parmigiano/

Instructions in Gnam are written specifically for the quantities shown in the app. They are not copied verbatim from the sources.

## Nutritional logic

The shopping-quality score is a planning heuristic, not a clinical nutrient analysis. It considers food-group variety, fibre potential, protein-family diversity, fresh/long-life resilience and food sources associated with selected micronutrients.
