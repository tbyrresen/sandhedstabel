import BinaryNode from "./tree_nodes/binaryNode";
import UnaryNode from "./tree_nodes/unaryNode";
import OperandNode from "./tree_nodes/operandNode";

/*
Evaluates an expression tree using a depth-first post-order traversal such that the resulting
boolean value of each node is a result of performing the operator associated with that node on 
its children. If the node is a operand node, the boolean value of that node is returned. 
The final result of the evaluation is the boolean value of the root node.
Assumes that operandToBoolMapping contains a mapping from operand to boolean for each operand 
in expressionTree.
*/
class TreeEvaluator {
    static evaluate = (expressionTree, operandToBoolMapping) => {
        if (expressionTree instanceof BinaryNode) {
            const lhsResult = this.evaluate(expressionTree.lhs, operandToBoolMapping);
            const rhsResult = this.evaluate(expressionTree.rhs, operandToBoolMapping);

            let binaryNodeResult;
            switch (expressionTree.op.spelling) {
                case 'AND':
                    binaryNodeResult = lhsResult && rhsResult;
                    break;
                case 'NAND':
                    binaryNodeResult = !(lhsResult && rhsResult);
                    break;
                case 'OR':
                    binaryNodeResult = lhsResult || rhsResult;
                    break;
                case 'XOR':
                    binaryNodeResult = (lhsResult || rhsResult) && !(lhsResult && rhsResult);
                    break;
                case 'NOR': 
                    binaryNodeResult = !(lhsResult || rhsResult);
                    break;
                case 'IMPLY':
                    binaryNodeResult = !lhsResult || rhsResult;
                    break;
                case 'XNOR':
                    binaryNodeResult = (lhsResult && rhsResult) || (!lhsResult && !rhsResult);
                    break;
                default:
                    throw new Error('Ukendt binær operator'); // should not happen 
            }
            return binaryNodeResult;
        }
        else if (expressionTree instanceof UnaryNode) {
            const childResult = this.evaluate(expressionTree.child, operandToBoolMapping);

            let unaryNodeResult;
            switch (expressionTree.op.spelling) {
                case 'NOT':
                    unaryNodeResult = !childResult;
                    break;
                default:
                    throw new Error('Ukendt unær operator'); // should not happen
            }
            return unaryNodeResult;
        }
        else if (expressionTree instanceof OperandNode) {
            return operandToBoolMapping[expressionTree.spelling];
        }
    }
}

export default TreeEvaluator;