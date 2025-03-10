const taskPool = [
  {
    id: 1,
    type: "multipleChoice",
    description: "Was ist die Hauptstadt von Deutschland?",
    options: ["Berlin", "München", "Hamburg", "Köln"],
    correctAnswer: "Berlin"
  },
  {
    id: 3,
    type: "text",
    description: "Nenne eine Datenstruktur in der mehrere Werte gespeichert werden können\nDie Antwort muss aus EINEM Wort bestehen",
    correctAnswer: ["array", "liste", "list", "tupel", "set", "menge", "queue", "tree", "graph"] //muss Liste sein, welche Eingaben akzeptiere ich? Unterschiedliche Punkte?
  },
  {
    id: 4,
    type: "output",
    description: "Welche Ausgabe erzeugt dieser Code:",
    template: `def generateOutput():\n    return "aaa"\n\noutput = generateOutput()\nprint(output)`,
    correctAnswer: "aaa"
  },
  {
    id: 5,
    type: "multipleChoice",
    description: "Was ist die Hauptstadt von Baden-Württemberg?",
    options: ["Berlin", "München", "Stuttgart", "Köln"],
    correctAnswer: "Stuttgart"
  },
  {
    id: 6,
    type: "multipleChoice",
    description: "Was ist die Hauptstadt von Frankreich?",
    options: ["Berlin", "Paris", "Stuttgart", "Köln"],
    correctAnswer: "Paris"
  },

  // Neue Multiple-Choice-Aufgaben für Informatik Oberstufe am technischen Gymnasium in BW
  {
    id: 7,
    type: "multipleChoice",
    description: "Welche der folgenden Datenstrukturen ist LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Array", "Liste"],
    correctAnswer: "Stack"
  },
  {
    id: 8,
    type: "multipleChoice",
    description: "Welche Aussage beschreibt am besten die lineare Suche?",
    options: [
      "Jedes Element wird nacheinander mit dem Suchbegriff verglichen",
      "Das Array wird in der Mitte geteilt, um die Suche zu beschleunigen",
      "Die Suche beginnt beim letzten Element und geht rückwärts",
      "Es werden Hash-Tabellen eingesetzt, um die Elemente schneller zu finden"
    ],
    correctAnswer: "Jedes Element wird nacheinander mit dem Suchbegriff verglichen"
  },
  {
    id: 9,
    type: "multipleChoice",
    description: "Was ist das Hauptziel der Kapselung (Encapsulation) in der objektorientierten Programmierung?",
    options: [
      "Wiederverwendung von Code durch Vererbung",
      "Verbergen der Implementierungsdetails und Schutz der Daten",
      "Mehrfache Vererbung ermöglichen",
      "Verbesserung der Ausführungszeit"
    ],
    correctAnswer: "Verbergen der Implementierungsdetails und Schutz der Daten"
  },
  {
    id: 10,
    type: "multipleChoice",
    description: "Welche der folgenden Aussagen über Primzahlen in der Kryptografie ist korrekt?",
    options: [
      "Primzahlen sind beliebige Zahlen, die nur durch 1 und sich selbst teilbar sind.",
      "Primzahlen werden häufig zur Erzeugung von Schlüsselpaaren in asymmetrischen Verschlüsselungsverfahren genutzt.",
      "Primzahlen sind im Kontext der Kryptografie nicht relevant.",
      "Primzahlen werden nur im Zusammenhang mit Hash-Funktionen verwendet."
    ],
    correctAnswer: "Primzahlen werden häufig zur Erzeugung von Schlüsselpaaren in asymmetrischen Verschlüsselungsverfahren genutzt."
  },
  {
    id: 11,
    type: "multipleChoice",
    description: "Welches Prinzip beschreibt den Umgang mit sensiblen Daten in Client-Server-Anwendungen am besten?",
    options: [
      "Least Privilege (Minimale Rechtevergabe)",
      "Big Data-Analyse",
      "Garbage Collection",
      "Syntax-Highlighting"
    ],
    correctAnswer: "Least Privilege (Minimale Rechtevergabe)"
  },
  {
    id: 12,
    type: "multipleChoice",
    description: "Welche Schicht des OSI-Modells ist für die Wegwahl (Routing) im Netzwerk zuständig?",
    options: [
      "Sitzungsschicht (Session Layer)",
      "Vermittlungsschicht (Network Layer)",
      "Transportschicht (Transport Layer)",
      "Bitübertragungsschicht (Physical Layer)"
    ],
    correctAnswer: "Vermittlungsschicht (Network Layer)"
  },
  {
    id: 13,
    type: "multipleChoice",
    description: "Welche Aussage zum Bubble Sort Algorithmus ist korrekt?",
    options: [
      "Er hat eine durchschnittliche Laufzeit von O(n log n).",
      "Er hat eine durchschnittliche Laufzeit von O(n).",
      "Er hat eine durchschnittliche Laufzeit von O(n²).",
      "Er mischt die Elemente zufällig."
    ],
    correctAnswer: "Er hat eine durchschnittliche Laufzeit von O(n²)."
  },
  {
    id: 14,
    type: "multipleChoice",
    description: "Was beschreibt das EVA-Prinzip in der Informatik?",
    options: [
      "Entscheiden, Verarbeiten, Ausgeben",
      "Eingabe, Verarbeitung, Ausgabe",
      "Erfassen, Verteilen, Ablegen",
      "Elektronische Verwaltung und Analyse"
    ],
    correctAnswer: "Eingabe, Verarbeitung, Ausgabe"
  },
  {
    id: 15,
    type: "multipleChoice",
    description: "Welche Aussage über ein Binärbaum-Durchlaufverfahren (Tree Traversal) ist korrekt?",
    options: [
      "Beim Preorder wird zuerst der rechte Teilbaum durchlaufen, dann der linke.",
      "Beim Inorder wird zuerst der Knoten selbst verarbeitet, dann der linke Teilbaum.",
      "Beim Postorder wird zuerst der linke Teilbaum durchlaufen, dann der rechte und dann der Knoten.",
      "Beim Inorder wird zuerst der linke Teilbaum durchlaufen, dann der rechte und dann der Knoten."
    ],
    correctAnswer: "Beim Postorder wird zuerst der linke Teilbaum durchlaufen, dann der rechte und dann der Knoten."
  },
  {
    id: 16,
    type: "multipleChoice",
    description: "Welche der folgenden Aussagen über Compiler und Interpreter ist richtig?",
    options: [
      "Ein Compiler führt den Code Zeile für Zeile zur Laufzeit aus.",
      "Ein Interpreter übersetzt das gesamte Programm in eine ausführbare Datei.",
      "Ein Compiler übersetzt das gesamte Programm vor der Ausführung in Maschinencode.",
      "Weder Compiler noch Interpreter überprüfen Syntaxfehler."
    ],
    correctAnswer: "Ein Compiler übersetzt das gesamte Programm vor der Ausführung in Maschinencode."
  },
  {
    id: 17,
    type: "coding",
    description: "Schreibe eine Methode `solve`, die zwei Zahlen addiert.",
    template: "//Schreibe hier deinen Code und bestätige mit dem Button\npublic static int solve(int a, int b){\n    return a + b;\n}",
    testCases: [
      { input: "2,3", expectedOutput: "5" },
      { input: "-1,4", expectedOutput: "3" },
      { input: "10,15", expectedOutput: "25" }
    ],
    correctAnswer: "-"
  }
];

module.exports = taskPool; // Für den Server verfügbar machen
