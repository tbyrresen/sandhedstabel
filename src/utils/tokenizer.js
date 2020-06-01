import Token from './token';
import { tokenType } from './tokenType';


class Tokenizer {
    static tokenize = (expression) => {
        const tokens = [];
        const charArr = expression.split('');
        let i = 0;

        while (i < charArr.length) {
            if (charArr[i] === ' ') {
                i++;
            }
            else if (charArr[i] === '(') {
                tokens.push(new Token(tokenType.LEFTPAREN, '(', null));
                i++;
            }
            else if (charArr[i] === ')') {
                tokens.push(new Token(tokenType.RIGHTPAREN, ')', null));
                i++;
            }
            else {
                const tokenChars = [];
                const legalChars = RegExp('[a-zA-Z]');
                while (i < charArr.length && charArr[i] !== ' ' && charArr[i] !== '(' && charArr[i] !== ')') {
                    if (!legalChars.test(charArr[i])) {
                        throw new Error('Ulovlig karakter: ' + charArr[i]);                        
                    } 
                    else {
                        tokenChars.push(charArr[i++])
                    }
                }

                const tokenString = tokenChars.join('');
                switch (tokenString.toUpperCase()) {
                    case 'NOT':
                        tokens.push(new Token(tokenType.NOT, 'NOT', null));
                        break;
                    case 'AND': 
                        tokens.push(new Token(tokenType.AND, 'AND', null));
                        break;
                    case 'NAND': 
                        tokens.push(new Token(tokenType.NAND, 'NAND', null));
                        break;
                    case 'OR': 
                        tokens.push(new Token(tokenType.OR, 'OR', null));
                        break;
                    case 'XOR': 
                        tokens.push(new Token(tokenType.XOR, 'XOR', null));
                        break;
                    case 'NOR': 
                        tokens.push(new Token(tokenType.NOR, 'NOR', null));
                        break;
                    case 'IMPLY': 
                        tokens.push(new Token(tokenType.IMPLY, 'IMPLY', null));
                        break;     
                    case 'XNOR': 
                        tokens.push(new Token(tokenType.XNOR, 'XNOR', null));
                        break;              
                    default:
                        tokens.push(new Token(tokenType.VARIABLE, tokenString, null));
                }
            }
        }
    }
}

export default Tokenizer;