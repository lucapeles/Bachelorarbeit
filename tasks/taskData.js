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
      template: "function add(a, b) {\n  // Dein Code hier\n}"
    },
    {
      id: 3,
      type: "text",
      description: "Erkläre in eigenen Worten, was ein Array ist.",
      correctAnswer: null
    }
  ];
  
  module.exports = taskPool; // Für den Server verfügbar machen
  