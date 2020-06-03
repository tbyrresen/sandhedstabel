import Tokenizer from './tokenizer';
import BinaryNode from './tree_nodes/binaryNode';
import UnaryNode from './tree_nodes/unaryNode';
import OperandNode from './tree_nodes/operandNode';
import OperatorNode from './tree_nodes/operatorNode';

/*
Parses the provided tokens using a recursive descent strategy. Progresses through the tokens
by calling the accept method to continuously match tokens according to the grammar. If the accept 
method is called with an invalid token, an error is thrown. 
The final result of the parse is an expression parse with a structure that guarantees the desired 
precedence and associativty of operators given that the tree is evaluated using a depth-first 
post-order traversal
*/
class Parser {
    static tokens;
    static currentIdx;
    static currentToken;

    static parse = (tokens) => {
        this.tokens = tokens;
        this.currentIdx = 0;
        this.currentToken = tokens[this.currentIdx];
        const expressionTree = this.expression();
        this.accept(Tokenizer.tokenType.EOL);
        return expressionTree;
    }

    static expression = () => {
        if (this.currentToken.type === Tokenizer.tokenType.NOT || this.currentToken.type === Tokenizer.tokenType.LEFTPAREN ||
            this.currentToken.type === Tokenizer.tokenType.OPERAND) {
            return this.biconditional();
        }
        else {
            throw new Error('Forventede: NOT operator, venstre parentes eller en operand')
        }
    }

    static biconditional = () => {
        let node = this.implication();
        while (this.currentToken.type === Tokenizer.tokenType.XNOR) {
            const op = new OperatorNode(this.currentToken.spelling);
            this.accept(Tokenizer.tokenType.XNOR);          
            const rhs = this.implication();
            node = new BinaryNode(node, op, rhs);
        }
        return node;
    }

    static implication = () => {
        let node = this.orOperation();
        while (this.currentToken.type === Tokenizer.tokenType.IMPLY) {
            const op = new OperatorNode(this.currentToken.spelling);
            this.accept(Tokenizer.tokenType.IMPLY);
            const rhs = this.orOperation();
            node = new BinaryNode(node, op, rhs);
        }
        return node;
    }

    static orOperation = () => {
        let node = this.andOperation();
        let op;
        while (this.currentToken.type === Tokenizer.tokenType.OR || this.currentToken.type === Tokenizer.tokenType.XOR ||
            this.currentToken.type === Tokenizer.tokenType.NOR) {
            if (this.currentToken.type === Tokenizer.tokenType.OR) {            
                op = new OperatorNode(this.currentToken.spelling);
                this.accept(Tokenizer.tokenType.OR);             
            }
            else if (this.currentToken.type === Tokenizer.tokenType.XOR) {
                op = new OperatorNode(this.currentToken.spelling);
                this.accept(Tokenizer.tokenType.XOR);               
            }
            else {
                op = new OperatorNode(this.currentToken.spelling);
                this.accept(Tokenizer.tokenType.NOR);              
            }
            const rhs = this.andOperation();   
            node = new BinaryNode(node, op, rhs);                 
        }
        return node;
    }

    static andOperation = () => {
        let node = this.notOperation();
        let op;
        while (this.currentToken.type === Tokenizer.tokenType.AND || this.currentToken.type === Tokenizer.tokenType.NAND) {
            if (this.currentToken.type === Tokenizer.tokenType.AND) {
                op = new OperatorNode(this.currentToken.spelling);
                this.accept(Tokenizer.tokenType.AND);
            }
            else {
                op = new OperatorNode(this.currentToken.spelling);
                this.accept(Tokenizer.tokenType.NAND);
            }
            const rhs = this.notOperation();
            node = new BinaryNode(node, op, rhs);
        }
        return node;
    }

    static notOperation = () => {
        let node;
        if (this.currentToken.type === Tokenizer.tokenType.NOT) {
            const op = new OperatorNode(this.currentToken.spelling);
            this.accept(Tokenizer.tokenType.NOT);
            const child = this.notOperation();
            node = new UnaryNode(op, child);
        }
        else {
            node = this.primary();    
        }
        return node;
    }

    static primary = () => {
        let node;
        if (this.currentToken.type === Tokenizer.tokenType.LEFTPAREN) {
            this.accept(Tokenizer.tokenType.LEFTPAREN);
            node = this.expression();       
            this.accept(Tokenizer.tokenType.RIGHTPAREN);      
        }
        else {
            node = new OperandNode(this.currentToken.spelling);
            this.accept(Tokenizer.tokenType.OPERAND);
        }
        return node;
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