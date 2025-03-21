// Debug-Helfer, um zirkuläre Objekte zu vermeiden
function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return "[Circular]";
            }
            seen.add(value);
        }
        return value;
    };
}

function searchForInt(node) {
    if (!node || typeof node !== "object") return false;
    if (node.image && typeof node.image === "string" && node.image.toLowerCase() === "int") {
        return true;
    }
    // Statt for...in iterieren wir über alle Werte
    for (const val of Object.values(node)) {
        if (Array.isArray(val)) {
            for (const item of val) {
                if (searchForInt(item)) return true;
            }
        } else if (typeof val === "object") {
            if (searchForInt(val)) return true;
        }
    }
    return false;
}


class SolveMethodChecker extends require("java-parser").BaseJavaCstVisitorWithDefaults {
    constructor(socket) {
        super();
        this.socket = socket; // socket wird gespeichert, falls du Debug-Ausgaben auch via socket senden willst
        this.foundSumMethod = false;
        this.foundCompareMethod = false;
        this.usesAddition = false;
        this.usesComparison = false;
        this.isPublicStaticVoid = false;
        this.validateVisitor();
    }

    methodDeclaration(ctx) {
        // Ausgabe über console.log – du kannst alternativ auch this.socket.emit("test", ...) verwenden, wenn du es per Socket senden möchtest.
        console.log("Entering methodDeclaration with ctx");

        // Versuche, den Methodenheader zu finden
        if (ctx.methodHeader && ctx.methodHeader[0].children) {
            const headerChildren = ctx.methodHeader[0].children;
            const headerKeys = Object.keys(headerChildren);
            console.log("Method header keys: " + headerKeys.join(", "));

            // Versuche, den Methodennamen zu extrahieren – bei dieser Parser-Version steht er vermutlich unter "methodDeclarator"
            let methodName = null;
            if (headerChildren.methodDeclarator) {
                const md = headerChildren.methodDeclarator[0].children;
                if (md.Identifier && md.Identifier[0] && md.Identifier[0].image) {
                    methodName = md.Identifier[0].image;
                    console.log("Found method name via methodDeclarator.Identifier: " + methodName);
                } else {
                    console.log("No Identifier found in methodDeclarator");
                }
            } else if (headerChildren.Identifier && headerChildren.Identifier[0] && headerChildren.Identifier[0].image) {
                methodName = headerChildren.Identifier[0].image;
                console.log("Found method name via Identifier: " + methodName);
            } else {
                console.log("Method name not found in headerChildren");
            }

            if (methodName && methodName.toLowerCase() === "sum") {
                this.foundSumMethod = true;
                console.log("Method 'sum' found!");
            } else {
                console.log("Method 'sum' not found. Found method name: " + methodName);
            }
            if (methodName && methodName.toLowerCase() === "compare") {
                this.foundCompareMethod = true;
                console.log("Method 'compare' found!");
            } else {
                console.log("Method 'compare' not found. Found method name: " + methodName);
            }
        } else {
            console.log("No methodHeader or children found in ctx");
        }

        // Prüfe die Modifier (z. B. public, static)
        if (ctx.methodModifier) {
            const modifiers = ctx.methodModifier.map(mod => {
                const key = Object.keys(mod.children)[0];
                return mod.children[key][0].image;
            });
            console.log("Method modifiers: " + modifiers.join(", "));
        } else {
            console.log("No methodModifier found in ctx");
        }

        // Prüfe den Rückgabetyp
        if (ctx.methodHeader && ctx.methodHeader[0].children.result) {
            const resultChildren = ctx.methodHeader[0].children.result[0].children;
            const resultKeys = Object.keys(resultChildren);
            console.log("Return type keys: " + resultKeys.join(", "));

            let returnValid = false;
            if (resultChildren.Void) {
                console.log("Return type is void");
                returnValid = true;
            } else if (resultChildren.unannPrimitiveType) {
                console.log("Return type is primitive type");
                const primType = resultChildren.unannPrimitiveType[0];
                if (primType.children && primType.children.Int) {
                    console.log("Return type is int");
                    returnValid = true;
                } else {
                    console.log("Primitive type is not int: " + JSON.stringify(primType, getCircularReplacer()));
                }
            } else if (resultChildren.unannType) {
                console.log("Return type is wrapped in unannType, checking inner type recursively...");
                const unannTypeNode = resultChildren.unannType[0];

                if (searchForInt(unannTypeNode)) {
                    console.log("Return type is int (found via recursive search in unannType)");
                    returnValid = true;
                } else {
                    console.log("No 'int' token found in unannType (recursive search)");
                }
            } else {
                console.log("Unknown return type structure");
            }
            if (returnValid) {
                this.isPublicStaticVoid = true;
            }
        } else {
            console.log("No result found in methodHeader for return type");
        }


        // Body besuchen
        if (ctx.methodBody) {
            console.log("Visiting method body...");
            this.visit(ctx.methodBody);
        } else {
            console.log("No method body found.");
        }
    }

    block(ctx) {
        if (ctx.blockStatements) {
            ctx.blockStatements.forEach(stmt => {
                this.visit(stmt);
            });
        }
    }

    binaryExpression(ctx) {
        // Logge den gesamten Knoten, um zu sehen, welche Felder vorhanden sind
        console.log("Entering binaryExpression: " + JSON.stringify(ctx, getCircularReplacer(), 2));

        // Prüfe, ob es ein Feld "BinaryOperator" gibt und iteriere über alle Operatoren
        if (ctx.BinaryOperator && ctx.BinaryOperator.length > 0) {
            for (const op of ctx.BinaryOperator) {
                if (op.image === "+") {
                    this.usesAddition = true;
                    console.log("Addition operator detected in binaryExpression.");
                    break;
                }
            }
            for (const op of ctx.BinaryOperator) {
                if (op.image === ">" || op.image === "<" || op.image === ">=" || op.image === "<=") {
                    this.usesComparison = true;
                    console.log("Comparison operator detected.");
                    break;
                }
            }
        }
    }
}

module.exports = SolveMethodChecker;
