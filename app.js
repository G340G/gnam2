// Inizializzazione Stato Applicazione
let pantry = ["petto di pollo", "pomodori", "olio extravergine d'oliva", "yogurt greco"];

document.addEventListener("DOMContentLoaded", () => {
    initUI();
    renderPantry();
    generateAndRenderRecipes();
});

function initUI() {
    const input = document.getElementById("ingredient-input");
    const suggestions = document.getElementById("suggestions");
    const btnGenerate = document.getElementById("btn-generate");

    // Autocompletamento avanzato
    input.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            suggestions.style.display = "none";
            return;
        }

        const matches = INGREDIENT_DATABASE.filter(item => 
            item.name.toLowerCase().includes(query)
        );

        if (matches.length > 0) {
            suggestions.innerHTML = matches.map(m => `
                <div class="suggestion-item" onclick="addIngredient('${m.name}')">
                    <span>${m.name}</span>
                    <small style="color: var(--text-secondary); font-size: 0.75rem;">${m.category}</small>
                </div>
            `).join("");
            suggestions.style.display = "block";
        } else {
            suggestions.style.display = "none";
        }
    });

    // Aggiunta con Invio
    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && input.value.trim()) {
            let val = input.value.trim().toLowerCase();
            if (INGREDIENT_ALIASES[val]) val = INGREDIENT_ALIASES[val];
            addIngredient(val);
            input.value = "";
            suggestions.style.display = "none";
        }
    });

    btnGenerate.addEventListener("click", () => {
        generateAndRenderRecipes();
    });
}

function addIngredient(name) {
    if (!pantry.includes(name)) {
        pantry.push(name);
        renderPantry();
    }
    document.getElementById("ingredient-input").value = "";
    document.getElementById("suggestions").style.display = "none";
}

function removeIngredient(name) {
    pantry = pantry.filter(i => i !== name);
    renderPantry();
}

function renderPantry() {
    const container = document.getElementById("pantry-tags");
    container.innerHTML = pantry.map(item => `
        <span class="tag">
            ${item}
            <span class="remove" onclick="removeIngredient('${item}')">&times;</span>
        </span>
    `).join("");
}

// Algoritmo Intelligente per la generazione e combinazione ricette
function generateAndRenderRecipes() {
    const grid = document.getElementById("recipes-grid");
    const counter = document.getElementById("recipe-count");

    let results = [];

    // 1. Controlla Ricette Base
    BASE_RECIPES.forEach(recipe => {
        const matches = recipe.ingredients.filter(ing => pantry.includes(ing));
        const score = matches.length / recipe.ingredients.length;
        if (matches.length > 0) {
            results.push({
                ...recipe,
                matchScore: score,
                matchedCount: matches.length,
                isDynamic: false
            });
        }
    });

    // 2. Generatore Dinamico Intelligente (Evita "Cuoci lo yogurt")
    const dynamicRecipe = buildSmartDynamicRecipe(pantry);
    if (dynamicRecipe) {
        results.push(dynamicRecipe);
    }

    // Ordina per rilevanza
    results.sort((a, b) => b.matchScore - a.matchScore);

    counter.innerText = `${results.length} ricette disponibili`;

    if (results.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h3>Nessuna combinazione trovata</h3>
                <p>Prova ad aggiungere altri ingredienti base come olio, riso o verdure.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = results.map(r => `
        <div class="recipe-card">
            <div class="recipe-body">
                <span class="match-badge ${r.matchScore >= 0.5 ? 'match-high' : 'match-med'}">
                    ${Math.round(r.matchScore * 100)}% Match (${r.matchedCount || r.ingredients.length} ingredienti)
                </span>
                <div class="recipe-title">${r.title}</div>
                <div class="recipe-meta">
                    <span>⏱️ ${r.time}</span>
                    <span>🥗 ${r.isDynamic ? 'Aggiustata per te' : 'Classica'}</span>
                </div>
                <div class="ingredients-list">
                    <strong>Ingredienti:</strong> ${r.ingredients.join(", ")}
                </div>
                <div class="steps-list">
                    <strong>Preparazione:</strong>
                    <ol>
                        ${r.steps.map(s => `<li>${s}</li>`).join("")}
                    </ol>
                </div>
            </div>
        </div>
    `).join("");
}

function buildSmartDynamicRecipe(userPantry) {
    if (userPantry.length < 2) return null;

    // Classifica gli ingredienti disponibili nella dispensa
    const available = userPantry.map(name => {
        const dbItem = INGREDIENT_DATABASE.find(db => db.name === name);
        return dbItem || { name, category: "altro", prep: "raw" };
    });

    const protein = available.find(a => a.category === "proteine");
    const veggie = available.find(a => a.category === "verdure");
    const carbo = available.find(a => a.category === "carbo");

    if (!protein && !veggie) return null;

    let titleParts = [];
    let steps = [];
    let usedIngredients = [];

    // Generazione Istruzioni basata sul tipo di preparazione reale
    if (protein) {
        usedIngredients.push(protein.name);
        titleParts.push(protein.name.charAt(0).toUpperCase() + protein.name.slice(1));

        if (protein.prep === "cook") {
            steps.push(`Cuoci ${protein.name} in padella con un filo d'olio fino a doratura.`);
        } else if (protein.prep === "ready") {
            steps.push(`Sgocciola o prepara ${protein.name} e tienilo da parte.`);
        } else if (protein.prep === "raw") {
            steps.push(`Prendi ${protein.name} fresco da aggiungere a crudo a fine preparazione.`);
        }
    }

    if (veggie) {
        usedIngredients.push(veggie.name);
        titleParts.push(veggie.name);

        if (veggie.prep === "cook") {
            steps.push(`Pulisci e salta le ${veggie.name} in padella per 8-10 minuti.`);
        } else {
            steps.push(`Lava e taglia finemente le ${veggie.name}.`);
        }
    }

    if (carbo) {
        usedIngredients.push(carbo.name);
        if (carbo.prep === "cook") {
            steps.push(`Prepara la base di ${carbo.name} facendola bollire in acqua salata.`);
        } else {
            steps.push(`Scalda o disponi la base di ${carbo.name}.`);
        }
    }

    steps.push("Unisci tutti gli ingredienti in un piatto da portata, condisci con un filo d'olio a crudo e servi fresco.");

    return {
        id: "dyn-1",
        title: `Piatto Espresso con ${titleParts.join(" e ")}`,
        ingredients: usedIngredients,
        time: "15 min",
        steps: steps,
        matchScore: 1.0,
        matchedCount: usedIngredients.length,
        isDynamic: true
    };
}
