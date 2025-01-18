const taskPool = [
  {
    id: 1,
    type: "multipleChoice",
    description: "Was ist die Hauptstadt von Deutschland?",
    options: ["Berlin", "München", "Hamburg", "Köln"],
    correctAnswer: "Berlin"
  },
  {
    id: 2,
    type: "coding",
    description: "Schreibe eine Funktion, die zwei Zahlen addiert.",
    template: "function add(a, b) {\n  // Dein Code hier\n}",
    correctAnswer: "TODO"
  },
  {
    id: 3,
    type: "text",
    description: "Erkläre in eigenen Worten, was ein Array ist.",
    correctAnswer: "TODO" //muss Liste sein, welche Eingaben akzeptiere ich? Unterschiedliche Punkte?
  }
];

module.exports = taskPool; // Für den Server verfügbar machen
