const taskPool = [
  {
    id: 1,
    type: "multipleChoice",
    description: "Wofür steht die Abkürzung www?",
    options: ["web world wide", "web wide world", "world wide web", "world wide wave"],
    correctAnswer: "world wide web"
  },
  {
    id: 2,
    type: "output",
    description: "Was gibt diese Funktion zurück: ",
    template: `int a = 4;\nint b = 5;\npublic static int foo(int a, int b) {\n    return a * b;\n}`,
    correctAnswer: "20"
  },
  {
    id: 3,
    type: "text",
    description: "Nenne eine Datenstruktur in der mehrere Werte gespeichert werden können",
    correctAnswer: ["array", "liste", "list", "tupel", "set", "menge", "queue", "tree", "graph"] //muss Liste sein, welche Eingaben akzeptiere ich? Unterschiedliche Punkte?
  },
  {
    id: 4,
    type: "output",
    description: "Welche Ausgabe erzeugt dieser Python-Code:",
    template: `def generateOutput():\n    return "aaa"\n\noutput = generateOutput()\nprint(output)`,
    correctAnswer: "aaa"
  },
  {
    id: 5,
    type: "multipleChoice",
    description: "Wofür steht die Abkürzung CPU?",
    options: ["Central Processor United", "Core Plugin Utilizer", "Cinetic Progress User", "Central Processing Unit"],
    correctAnswer: "Central Processing Unit"
  },
  {
    id: 6,
    type: "multipleChoice",
    description: "Wie viele Bits sind ein Byte?",
    options: ["2", "4", "8", "16"],
    correctAnswer: "8"
  },
  {
    id: 7,
    type: "text",
    description: "Wie lautet die Dezimalzahl 9 in Binärschreibweise?",
    correctAnswer: ["01001", "1001", "001001", "0001001", "00001001"]
  },
  {
    id: 8,
    type: "coding",
    description: "Schreibe eine Methode `solve`, die zwei Zahlen addiert.",
    template: "//Achte auf korrekte Syntax!",
    testCases: [
      { input: "2,3", expectedOutput: "5" },
      { input: "-1,4", expectedOutput: "3" },
      { input: "10,15", expectedOutput: "25" }
    ],
    correctAnswer: "-"
  },
  {
    id: 9,
    type: "coding",
    description: "Schreibe eine Methode `solve`, die zwei Zahlen vergleicht und die Größere zurückgibt.",
    template: "//Achte auf korrekte Syntax!",
    testCases: [
      { input: "2,3", expectedOutput: "3" },
      { input: "-1,4", expectedOutput: "4" },
      { input: "10,15", expectedOutput: "15" }
    ],
    correctAnswer: "-"
  },
  {
    id: 10,
    type: "multipleChoice",
    description: "Welcher Datentyp ist in Java für Ganzzahlen am besten geeignet?",
    options: ["double", "int", "boolean", "String"],
    correctAnswer: "int"
  },
  {
    id: 11,
    type: "multipleChoice",
    description: "Welche Schleife wird mindestens einmal ausgeführt, auch wenn die Bedingung nicht erfüllt ist?",
    options: ["for", "while", "do-while", "foreach"],
    correctAnswer: "do-while"
  },
  {
    id: 12,
    type: "output",
    description: "Welche Ausgabe erzeugt dieser Java-Code?",
    template: `int x = 3;\nint y = 7;\nif (x > y) {\n    System.out.println(x + y);\n} else {\n    System.out.println(y - x)\n}`,
    correctAnswer: "4"
  },
  {
    id: 13,
    type: "output",
    description: "Welche Ausgabe erzeugt dieser Java-Code?",
    template: `int sum = 0;\nfor (int i = 2; i <= 5; i += 2) {\n    sum += i;\n}\nSystem.out.println("Summe: " + sum);`,
    correctAnswer: "Summe: 6"
  },
  {
    id: 14,
    type: "text",
    description: "Wie nennt man in Java eine Methode, die nichts zurückgibt?",
    correctAnswer: ["void", "void methode", "void-methode"]
  },
  {
    id: 15,
    type: "text",
    description: "Wie nennt man in der Informatik eine Wiederholung von Anweisungen?",
    correctAnswer: ["schleife", "loop", "wiederholung"]
  },
  {
    id: 16,
    type: "multipleChoice",
    description: "Was ist der richtige Vergleichsoperator für Gleichheit in Java?",
    options: ["=", "==", "===", "!="],
    correctAnswer: "=="
  },
  {
    id: 17,
    type: "output",
    description: "Was gibt dieser Code aus?",
    template: `String name = "Max";\nSystem.out.println("Hallo " + name + "!");`,
    correctAnswer: "Hallo Max!"
  },
  {
    id: 18,
    type: "multipleChoice",
    description: "Was ist KEIN gültiger primitiver Datentyp in Java?",
    options: ["boolean", "char", "String", "double"],
    correctAnswer: "String"
  },
  {
    id: 19,
    type: "text",
    description: "Nenne einen logischen Operator in Java.",
    correctAnswer: ["&&", "||", "!"]
  },
  {
    id: 20,
    type: "text",
    description: "Wie nennt man einen Fehler im Code?",
    correctAnswer: ["bug", "fehler", "syntaxfehler", "logikfehler"]
  },
  {
    id: 21,
    type: "output",
    description: "Was muss anstelle von `___` stehen, damit der Code `Summe: 10` ausgibt?",
    template: `int sum = 0;\nfor (int i = 1; i <= 4; i++) {\n    ___ = sum + i;\n}\nSystem.out.println("Summe: " + sum);`,
    correctAnswer: "sum"
  },
  {
    id: 22,
    type: "output",
    description: "Was muss anstelle von `___` stehen, damit der Code `13` ausgibt?",
    template: `int[] zahlen = {1, 3, 9};\nint summe = 0;\nfor (int i = 0; i < zahlen.length; i++) {\n    summe += ___;\n}\nSystem.out.println(summe);`,
    correctAnswer: "zahlen[i]"
  }


];

module.exports = taskPool; // Für den Server verfügbar machen
