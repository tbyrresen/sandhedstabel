import Token from './token';

/*
Tokenizes the input expression and returns an array of the resulting tokens.
If any illegal character is encountered, an error is thrown.
*/

class Tokenizer {
    static tokenType = {
        NOT: 'NOT',
        AND: 'AND',
        NAND: 'NAND',
        OR: 'OR',
        XOR: 'XOR',
        NOR: 'NOR',
        IMPLY: 'IMPLY',
        XNOR: 'XNOR',
        LEFTPAREN: 'Venstre parentes',
        RIGHTPAREN: 'Højre parentes',
        OPERAND: 'Operand',
        EOL: 'Afsluttet udtryk'
    }

    static tokenize = (expression) => {
        const tokens = [];
        const charArr = expression.split('');
        let i = 0;

        while (i < charArr.length) {
            if (charArr[i] === ' ') {
                i++;
            }
            else if (charArr[i] === '(') {
                tokens.push(new Token(this.tokenType.LEFTPAREN, '(', null));
                i++;
            }
            else if (charArr[i] === ')') {
                tokens.push(new Token(this.tokenType.RIGHTPAREN, ')', null));
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
                        tokens.push(new Token(this.tokenType.NOT, 'NOT'));
                        break;
                    case 'AND': 
                        tokens.push(new Token(this.tokenType.AND, 'AND'));
                        break;
                    case 'NAND': 
                        tokens.push(new Token(this.tokenType.NAND, 'NAND'));
                        break;
                    case 'OR': 
                        tokens.push(new Token(this.tokenType.OR, 'OR'));
                        break;
                    case 'XOR': 
                        tokens.push(new Token(this.tokenType.XOR, 'XOR'));
                        break;
                    case 'NOR': 
                        tokens.push(new Token(this.tokenType.NOR, 'NOR'));
                        break;
                    case 'IMPLY': 
                        tokens.push(new Token(this.tokenType.IMPLY, 'IMPLY'));
                        break;     
                    case 'XNOR': 
                        tokens.push(new Token(this.tokenType.XNOR, 'XNOR'));
                        break;              
                    default:
                        tokens.push(new Token(this.tokenType.OPERAND, tokenString));
                }
            }
        }
        tokens.push(new Token(this.tokenType.EOL, ''));
        return tokens;
    }
}

export default Tokenizer;