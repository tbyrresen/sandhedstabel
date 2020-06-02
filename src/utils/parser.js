import Tokenizer from './tokenizer';

/*
Parses the provided tokens using a recursive descent strategy. Progresses through the tokens
by calling the accept method to continuously match tokens according to the grammar. If the accept 
method is called with an invalid token, an error is thrown. 
*/
class Parser {
    static tokens;
    static currentIdx;
    static currentToken;

    static parse = (tokens) => {
        this.tokens = tokens;
        this.currentIdx = 0;
        this.currentToken = tokens[this.currentIdx];
        this.expression();
        this.accept(Tokenizer.tokenType.EOL);
    }

    static expression = () => {
        if (this.currentToken.type === Tokenizer.tokenType.NOT || this.currentToken.type === Tokenizer.tokenType.LEFTPAREN ||
            this.currentToken.type === Tokenizer.tokenType.VARIABLE) {
            this.biconditional();
        }
        else {
            throw new Error('Forventede: NOT operator, venstre parentes eller en variabel')
        }
    }

    static biconditional = () => {
        this.implication();
        while (this.currentToken.type === Tokenizer.tokenType.XNOR) {
            this.accept(Tokenizer.tokenType.XNOR);
            this.implication();
        }
    }

    static implication = () => {
        this.orOperation();
        while (this.currentToken.type === Tokenizer.tokenType.IMPLY) {
            this.accept(Tokenizer.tokenType.IMPLY);
            this.orOperation();
        }
    }

    static orOperation = () => {
        this.andOperation();
        while (this.currentToken.type === Tokenizer.tokenType.OR || this.currentToken.type === Tokenizer.tokenType.XOR ||
            this.currentToken.type === Tokenizer.tokenType.NOR) {
            if (this.currentToken.type === Tokenizer.tokenType.OR) {
                this.accept(Tokenizer.tokenType.OR);
            }
            else if (this.currentToken.type === Tokenizer.tokenType.XOR) {
                this.accept(Tokenizer.tokenType.XOR);
            }
            else {
                this.accept(Tokenizer.tokenType.NOR);
            }
            this.andOperation();                    
        }
    }

    static andOperation = () => {
        this.notOperation();
        while (this.currentToken.type === Tokenizer.tokenType.AND || this.currentToken.type === Tokenizer.tokenType.NAND) {
            if (this.currentToken.type === Tokenizer.tokenType.AND) {
                this.accept(Tokenizer.tokenType.AND);
            }
            else {
                this.accept(Tokenizer.tokenType.NAND);
            }
            this.notOperation();
        }
    }

    static notOperation = () => {
        if (this.currentToken.type === Tokenizer.tokenType.NOT) {
            this.accept(Tokenizer.tokenType.NOT);
            this.notOperation();
        }
        else {
            this.primary();    
        }
    }

    static primary = () => {
        if (this.currentToken.type === Tokenizer.tokenType.LEFTPAREN) {
            this.accept(Tokenizer.tokenType.LEFTPAREN);
            this.expression();       
            this.accept(Tokenizer.tokenType.RIGHTPAREN);      
        }
        else {
            this.accept(Tokenizer.tokenType.VARIABLE);
        }
    }

    static accept = (expectedType) => {
        if (this.currentToken.type !== expectedType) {
            throw new Error('Forventede: ' + expectedType);
        }
        else {
            this.currentToken = this.tokens[++this.currentIdx]; 
        }
    }
}

export default Parser;