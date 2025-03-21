//IMMER MACHEN BEI ÄNDERUNG: npx webpack

const socket = io();

// URL-Parameter auslesen
const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('userID'); // ID des Benutzers aus der URL holen
const startName = urlParams.get('name'); //Startname
let startTime; // Startzeitpunkt des Timers
let elapsedTime; // Verstrichene Zeit in Sekunden
let isCodingTask = false;
let points = 0;
const { parse } = require("java-parser");
const SolveMethodChecker = require("./visitors/solveMethodChecker.js");

document.addEventListener("DOMContentLoaded", function () {
    let textarea = document.getElementById("codeEditor");
    if (textarea) {
        window.editor = CodeMirror.fromTextArea(textarea, {
            mode: "text/x-java",
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 4,
            smartIndent: true
        });
    }

    //submitButton-Funktionalität
    const submitButton = document.getElementById("submitButton");
    function handleSubmit(e) {
        e.preventDefault();
        submitAnswer();
    }
    submitButton.addEventListener("click", handleSubmit, false);
    submitButton.addEventListener("touchstart", handleSubmit, false);

});

//Anzeigen des Namens
socket.on("updateUserList", (users) => {
    const quizTitle = document.getElementById("quizTitle");
    users.forEach(user => {
        if (user.userID == userID) {
            points = user.points;
            if (user.name === startName) {
                quizTitle.textContent = `Informatik-Quiz (Name: ${user.name})`;
            } else {
                window.location.href = `/taskView.html?name=${encodeURIComponent(user.name)}&userID=${encodeURIComponent(userID)}`;
            }
        }
    });
});


// Neue Frage anzeigen
socket.on("newTask", (task) => {
    document.body.style.backgroundColor = "white";
    document.getElementById("quizContainer").style.display = "block"; // Container wieder sichtbar machen
    document.getElementById("submitButton").style.display = "block"; //submitButton wieder sichtbar machen
    document.getElementById("personalRankMessage").style.display = "none";
    document.getElementById("editorContainer").style.display = "none"; // CodeMirror ausblenden


    const optionsContainer = document.getElementById("answerOptions");
    optionsContainer.innerHTML = ""; // Vorherige Antworten löschen

    startTime = Date.now(); // Zeitstempel beim Start der Aufgabe
    elapsedTime = 0; // Timer zurücksetzen

    if (task.type === "multipleChoice") {
        task.options.forEach((option) => {
            const button = document.createElement("button");
            button.textContent = option;
            button.className = "optionButton";
            button.onclick = () => selectAnswer(button, option);
            optionsContainer.appendChild(button);
        });
    } else if (task.type === "coding") {
        isCodingTask = true;
        document.getElementById("quizContainer").style.display = "none"; // Container wieder sichtbar machen
        document.getElementById("editorContainer").style.display = "block"; // CodeMirror anzeigen
        editor.setValue(task.template || ""); // Template in CodeMirror laden
        setTimeout(() => editor.refresh(), 100); // Stelle sicher, dass CodeMirror richtig lädt
        window.currentTask = task; // Speichere die aktuelle Aufgabe
    } else if (task.type === "text" || task.type === "output") {
        const textArea = document.createElement("textarea");
        textArea.id = "textAnswer";
        textArea.classList.add("largeTextArea"); // CSS-Klasse zuweisen
        optionsContainer.appendChild(textArea);
    }
});

let selectedAnswer = "nurAlsPlatzhalter";
let previousSelectedButton = null;

function selectAnswer(button, answer) {
    selectedAnswer = answer;

    // Entferne die Markierung von der vorherigen Auswahl
    if (previousSelectedButton) {
        previousSelectedButton.classList.remove("selected");
    }

    // Markiere die aktuelle Auswahl
    button.classList.add("selected");
    previousSelectedButton = button; // Speichere die aktuelle Auswahl
}

function submitAnswer() {
    document.getElementById("submitButton").style.display = "none"; //submitButton ausblenden
    document.getElementById("quizContainer").style.display = "none"; // Antwortmöglichkeiten ausblenden
    document.getElementById("editorContainer").style.display = "none";
    // Falls es sich um eine Text- oder Output-Aufgabe handelt:
    const textAnswer = document.getElementById("textAnswer");
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    if (textAnswer) {
        selectedAnswer = textAnswer.value.trim(); // Eingabe aus Textfeld holen und speichern
    } else if (isCodingTask) {
        isCodingTask = false;
        const userCode = editor.getValue(); // Code aus CodeMirror holen
        const task = window.currentTask;
        const success = proofJavaCode(userCode);
        socket.emit("test", success);
        socket.emit("submitTask", [userID, success, elapsedTime]); // Nur `true` oder `false` senden
        return;
    }
    socket.emit("submitTask", [userID, selectedAnswer, elapsedTime]);
}

function proofJavaCode(userCode) {
    socket.emit("test", "Starte erweiterte Prüfung...");

    try {
        // 1) Java-Code parsen
        const cst = parse(userCode);

        // 2) Visitor mit Socket erstellen
        const SolveMethodChecker = require("./visitors/solveMethodChecker.js");
        const checker = new SolveMethodChecker(socket);
        checker.visit(cst);
        socket.emit("test", "Prüfung des CST abgeschlossen.");

        // 3) Einzelprüfungen:
        if (!checker.foundSumMethod && !checker.foundCompareMethod) {
            socket.emit("test", "Prüfung: Methode 'sum' oder 'compare' wurde nicht gefunden.");
            return false;
        } else {
            socket.emit("test", "Prüfung: Methode 'sum' existiert.");
        }

        if (!checker.isPublicStaticVoid) {
            socket.emit("test", "Prüfung: Die 'sum'-Methode hat ungültige Modifier oder einen ungültigen Rückgabetyp.");
            return false;
        } else {
            socket.emit("test", "Prüfung: Modifier und Rückgabetyp der 'sum'-Methode sind korrekt.");
        }
        // Je nach Aufgabe unterschiedliche Operator-Prüfung:
        if (!checker.usesAddition && !checker.usesComparison) {
            socket.emit("test", "Prüfung: In 'sum'/'compare' wird keine Addition (+) / Vergleich verwendet.");
            return false;
        } else {
            socket.emit("test", "Prüfung: In 'sum'/'compare' wird Addition/Vergleich verwendet.");
        }

        socket.emit("test", "Alle Prüfungen erfolgreich: Aufgabe erfüllt!");
        return true;
    } catch (error) {
        socket.emit("test", "Fehler beim Parsen: " + error);
        return false;
    }
}





socket.on("showPersonalRank", (data) => { // data = { userID, rank }
    if (data[0] === userID) {
        let rank = data[1];
        const rankMessage = document.getElementById("personalRankMessage");
        let rankText = "";

        // Entferne vorherige Klassen (falls bereits gesetzt)
        rankMessage.classList.remove("rank-1", "rank-2", "rank-3");

        if (rank === 1) {
            rankText = "🥇 Du warst der/die SCHNELLSTE mit korrekter Antwort!";
            rankMessage.classList.add("rank-1");
        } else if (rank === 2) {
            rankText = "🥈 Du warst der/die ZWEITSCHNELLSTE mit korrekter Antwort!";
            rankMessage.classList.add("rank-2");
        } else if (rank === 3) {
            rankText = "🥉 Du warst der/die DRITTSCHNELLSTE mit korrekter Antwort!";
            rankMessage.classList.add("rank-3");
        }

        rankMessage.textContent = rankText;
        rankMessage.style.display = "block"; // Sichtbar machen
    }
});



socket.on("showTrueOrFalse", (userIDs) => {
    if (userIDs.includes(userID)) {
        document.body.style.backgroundColor = "lightgreen";
    } else {
        document.body.style.backgroundColor = "lightcoral";
    }
    resetPage();
});

socket.on("reset", () => {
    document.body.style.backgroundColor = "white";
    document.getElementById("personalRankMessage").style.display = "none";
    document.getElementById("personalRanking").style.display = "none";
    resetPage();
});

//Anzeige des persönlichen Rankings
socket.on("quizCompleted", (ranking) => {
    const myRank = ranking.find(player => player.userID == userID);
    if (myRank) {
        setTimeout(() => {
            let rankMessage = document.getElementById("personalRanking");
            rankMessage.textContent = `Du hast Platz ${myRank.rank} erreicht! 🎉`;
            rankMessage.style.display = "block";
        }, 7000); // Zeigt das eigene Ranking nach der Siegerehrung
    }
});

function resetPage() {
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("editorContainer").style.display = "none";
    // Zustand zurücksetzen
    selectedAnswer = "nurAlsSchranke"; // Antwort zurücksetzen
    previousSelectedButton = null; // Button-Auswahl zurücksetzen
    startTime = null; // Timer zurücksetzen
    elapsedTime = 0; // Verstrichene Zeit zurücksetzen
}

// Benutzer beim Verlassen der Seite abmelden
window.addEventListener("beforeunload", () => {
    socket.emit("disconnectUser", [userID, points]);
});

window.onload = () => {
    socket.emit("userConnect", [userID, startName]); // data = { userID, name, points }
    socket.emit("requestUserList");
};