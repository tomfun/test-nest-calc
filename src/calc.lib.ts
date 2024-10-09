type TokenType = 'Number' | 'Operator' | 'LeftParen' | 'RightParen';
interface Token {
  type: TokenType;
  value: string;
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  const tokenRegex = /\s*([0-9]+(?:\.[0-9]+)?|[\+\-\*\/\(\)])\s*/g;
  let match;

  while ((match = tokenRegex.exec(expression)) !== null) {
    const [_, value] = match;
    let type: TokenType;

    if (!isNaN(Number(value))) {
      type = 'Number';
    } else if ('+-*/'.includes(value)) {
      type = 'Operator';
    } else if (value === '(') {
      type = 'LeftParen';
    } else if (value === ')') {
      type = 'RightParen';
    } else {
      throw new Error(`Unknown token: ${value}`);
    }

    tokens.push({ type, value });
  }

  return tokens;
}

function shuntingYard(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];
  const precedence: { [key: string]: number } = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
  };
  const associativity: { [key: string]: 'Left' | 'Right' } = {
    '+': 'Left',
    '-': 'Left',
    '*': 'Left',
    '/': 'Left',
  };

  for (const token of tokens) {
    if (token.type === 'Number') {
      outputQueue.push(token);
    } else if (token.type === 'Operator') {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1].type === 'Operator' &&
        ((associativity[token.value] === 'Left' &&
          precedence[token.value] <=
            precedence[operatorStack[operatorStack.length - 1].value]) ||
          (associativity[token.value] === 'Right' &&
            precedence[token.value] <
              precedence[operatorStack[operatorStack.length - 1].value]))
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      operatorStack.push(token);
    } else if (token.type === 'LeftParen') {
      operatorStack.push(token);
    } else if (token.type === 'RightParen') {
      while (
        operatorStack.length &&
        operatorStack[operatorStack.length - 1].type !== 'LeftParen'
      ) {
        outputQueue.push(operatorStack.pop()!);
      }
      if (
        operatorStack.length === 0 ||
        operatorStack[operatorStack.length - 1].type !== 'LeftParen'
      ) {
        throw new Error('Mismatched parentheses');
      }
      operatorStack.pop(); // Remove the left parenthesis
    }
  }

  while (operatorStack.length) {
    const op = operatorStack.pop()!;
    if (op.type === 'LeftParen' || op.type === 'RightParen') {
      throw new Error('Mismatched parentheses');
    }
    outputQueue.push(op);
  }

  return outputQueue;
}

function evaluateRPN(tokens: Token[]): number {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === 'Number') {
      stack.push(Number(token.value));
    } else if (token.type === 'Operator') {
      const right = stack.pop();
      const left = stack.pop();
      if (left === undefined || right === undefined) {
        throw new Error('Invalid expression');
      }

      let result: number;
      switch (token.value) {
        case '+':
          result = left + right;
          break;
        case '-':
          result = left - right;
          break;
        case '*':
          result = left * right;
          break;
        case '/':
          if (right === 0) {
            throw new Error('Division by zero');
          }
          result = left / right;
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
      stack.push(result);
    } else {
      throw new Error(`Invalid token type: ${token.type}`);
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

export function calculate(expression: string): number {
  const tokens = tokenize(expression);
  const rpn = shuntingYard(tokens);
  return evaluateRPN(rpn);
}
