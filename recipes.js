// Database tassonomico esteso con regole culinarie di cottura
const INGREDIENT_DATABASE = [
    // Proteine da cuocere
    { name: "petto di pollo", category: "proteine", prep: "cook" },
    { name: "fesa di tacchino", category: "proteine", prep: "cook" },
    { name: "macinato di manzo", category: "proteine", prep: "cook" },
    { name: "filetto di salmone", category: "proteine", prep: "cook" },
    { name: "uova", category: "proteine", prep: "cook" },
    
    // Proteine fresche/crude/pronte
    { name: "yogurt greco", category: "proteine", prep: "raw" },
    { name: "feta", category: "proteine", prep: "raw" },
    { name: "ricotta", category: "proteine", prep: "raw" },
    { name: "mozzarella", category: "proteine", prep: "raw" },
    { name: "tonno in scatola", category: "proteine", prep: "ready" },
    { name: "ceci in scatola", category: "proteine", prep: "ready" },
    { name: "fagioli", category: "proteine", prep: "ready" },

    // Carboidrati
    { name: "riso basmati", category: "carbo", prep: "cook" },
    { name: "pasta", category: "carbo", prep: "cook" },
    { name: "pane integrale", category: "carbo", prep: "ready" },
    { name: "patate", category: "carbo", prep: "cook" },
    { name: "quinoa", category: "carbo", prep: "cook" },
    { name: "piadina", category: "carbo", prep: "ready" },

    // Verdure
    { name: "zucchine", category: "verdure", prep: "cook" },
    { name: "pomodori", category: "verdure", prep: "raw" },
    { name: "spinaci", category: "verdure", prep: "cook" },
    { name: "insalata", category: "verdure", prep: "raw" },
    { name: "carote", category: "verdure", prep: "raw" },
    { name: "broccoli", category: "verdure", prep: "cook" },
    { name: "cetrioli", category: "verdure", prep: "raw" },

    // Grassi & Condimenti
    { name: "olio extravergine d'oliva", category: "condimenti", prep: "raw" },
    { name: "avocado", category: "condimenti", prep: "raw" },
    { name: "frutta secca", category: "condimenti", prep: "raw" }
];

const INGREDIENT_ALIASES = {
    "pollo": "petto di pollo",
    "tacchino": "fesa di tacchino",
    "riso": "riso basmati",
    "ceci": "ceci in scatola",
    "tonno": "tonno in scatola",
    "yogurt": "yogurt greco",
    "olio": "olio extravergine d'oliva"
};

// Ricette strutturate di base
const BASE_RECIPES = [
    {
        id: "r1",
        title: "Insalata Greca Intelligente",
        ingredients: ["feta", "pomodori", "cetrioli", "olio extravergine d'oliva"],
        time: "10 min",
        steps: [
            "Taglia i pomodori e i cetrioli a cubetti.",
            "Sminuzza la feta e uniscila alle verdure.",
            "Condisci abbondantemente con olio extravergine d'oliva e origano fresco."
        ]
    },
    {
        id: "r2",
        title: "Bowl Proteica con Pollo e Riso",
        ingredients: ["petto di pollo", "riso basmati", "zucchine", "olio extravergine d'oliva"],
        time: "20 min",
        steps: [
            "Lessa il riso basmati in acqua salata.",
            "Taglia le zucchine a rondelle e rosolale in padella con un filo d'olio.",
            "Griglia il petto di pollo tagliato a straccetti e unisci tutti gli ingredienti in una bowl."
        ]
    },
    {
        id: "r3",
        title: "Wrap Veloce Feta e Avocado",
        ingredients: ["piadina", "feta", "avocado", "pomodori"],
        time: "8 min",
        steps: [
            "Scalda leggermente la piadina su una padella antiaderente.",
            "Schiaccia l'avocado e spalmalo sulla superficie.",
            "Aggiungi la feta sbriciolata e i pomodori a fette, poi arrotola."
        ]
    }
];
