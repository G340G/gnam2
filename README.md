# gnam — Food Operating System v6.8

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


## Daily balance model
The planner evaluates lunch + dinner together rather than scoring meals independently. The planning band uses EFSA reference ranges of 45–60% of energy from carbohydrate and 20–35% from fat, while treating protein, fibre, vegetables and protein-family diversity as additional planning criteria. This is a heuristic for food planning, not medical advice and does not represent a complete full-day nutritional assessment when breakfast/snacks are omitted. References: WHO Healthy Diet (2026), EFSA Dietary Reference Values, CREA Italian food guidelines.

## v6.5 — recipe integrity & daily balance
- Online recipes are accepted only with complete source URL, original instructions and complete ingredient mapping; unmapped ingredients invalidate the recipe instead of being silently removed.
- Online recipe quantities carry an explicit default serving count so calories/macros are not calculated over the full batch as if it were one serving.
- Online verified recipes are actually merged into the planner pool; the planner is no longer limited to the local curated bank.
- The weekly planner prioritizes nutritionally balanced lunch+dinner pairs, with protein-family separation and ingredient-overlap penalties.
- Every day receives a combined macro + micronutrient coverage check.
- When a day cannot be made OK with the current pantry, Gnam shows concrete repair options with food + quantity + reason.
- The system never repairs a bad source recipe by deleting ingredients.


## v6.6 · Online recipe integrity
Online recipes are accepted only when every substantive source ingredient is mapped with an interpretable quantity, all source steps are usable, and no ingredient is silently dropped. Ambiguous package measures are rejected instead of converted to fake grams. The online cache key was bumped to v2 to invalidate previously malformed cached recipes.


## v6.7 — offline recipe planner
The runtime planner no longer calls TheMealDB directly from GitHub Pages. This avoids browser CORS failures and rate-limit errors such as HTTP 429. Online inspiration is opened as normal web navigation instead. The meal planner itself uses the validated local recipe bank only.

## v6.8 · Culinary unit normalization
Recipe quantities can now be compared with pantry quantities across common culinary measures without inventing arbitrary 1 g values. Examples include garlic cloves, medium/whole vegetables entered as pieces, bread slices, fish fillets, herb sprigs, bunches, cups, tablespoons and teaspoons. Common oil/dairy/liquid densities are supported where needed. Ambiguous package measures such as “1 can” or unspecified “to taste” quantities remain invalid and are excluded rather than guessed.
