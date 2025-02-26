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

class SolveMethodChecker extends require("java-parser").BaseJavaCstVisitorWithDefaults {
    constructor(socket) {
        super();
        this.socket = socket; // socket wird gespeichert, falls du Debug-Ausgaben auch via socket senden willst
        this.foundSolveMethod = false;
        this.usesAddition = false;
        this.isPublicStaticVoid = false;
        this.validateVisitor();
    }

    methodDeclaration(ctx) {
        // Ausgabe über console.log – du kannst alternativ auch this.socket.emit("test", ...) verwenden, wenn du es per Socket senden möchtest.
        console.log("Entering methodDeclaration with ctx: " + JSON.stringify(ctx, getCircularReplacer(), 2));

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

            if (methodName && methodName.toLowerCase() === "solve") {
                this.foundSolveMethod = true;
                console.log("Method 'solve' found!");
            } else {
                console.log("Method 'solve' not found. Found method name: " + methodName);
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
            } else {
                console.log("Unknown return type structure");
            }
            if (returnValid) {
                this.isPublicStaticVoid = true; // Wir benennen die Variable hier "isPublicStaticVoid" – sie gilt jetzt als "valid" für void oder int
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

    additiveExpression(ctx) {
        // Debug: Ausgabe des gesamten Kontexts der additiveExpression
        console.log("Entering additiveExpression: " + JSON.stringify(ctx, getCircularReplacer(), 2));

        // Prüfe, ob ein Plus-Operator vorhanden ist
        if ((ctx.Add && ctx.Add.length > 0) || (ctx.Plus && ctx.Plus.length > 0)) {
            this.usesAddition = true;
            console.log("Addition operator detected.");
        } else {
            console.log("No addition operator found in this additiveExpression.");
        }
        this.visitChildren(ctx);
    }

}

module.exports = SolveMethodChecker;
