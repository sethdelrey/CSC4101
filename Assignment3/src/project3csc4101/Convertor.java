package project3csc4101;

import java.util.Stack;

public class Convertor {
    
    public static String convertToPostfix(String expression) {
        Stack<String> stack = new Stack<String>();
        var array = expression.split(" ");
        StringBuilder sb = new StringBuilder();
        
        for (int i = 0; i < array.length; i++) {
            if (array[i].equals("(")) {
                stack.push(array[i]);
            } else if (array[i].equals(")")) {
                while (!stack.empty() && !stack.peek().equals("(")) {
                    sb.append(stack.pop());
                    sb.append(" ");
                }
                stack.pop();
            } else if (array[i].equals("*") || array[i].equals("/")) {
                if (!stack.empty() && (stack.peek().equals("*") || stack.peek().equals("/"))) {
                    sb.append(stack.pop());
                    sb.append(" ");
                }
                stack.push(array[i]);
            } else if (array[i].equals("-") || array[i].equals("+")) {
                if (!stack.empty() && (stack.peek().equals("+") || stack.peek().equals("-") || stack.peek().equals("*") || stack.peek().equals("/"))) {
                    sb.append(stack.pop());
                    sb.append(" ");
                }
                stack.push(array[i]);
            } else {
                sb.append(array[i]);
                sb.append(" ");
            }
        }
        while (!stack.empty()) {
            sb.append(stack.pop());
            sb.append(" ");
        }
        return sb.toString();
    }
    
    public static String evaluatePostfix(String expression) {
        var stack = new Stack<String>();
        var array = expression.split(" ");
        
        for (int i = 0; i < array.length; i++) {
            if (array[i].equals("+")) {
                    if (!stack.empty()) {
                        var opp1 = Double.parseDouble(stack.pop());
                        var opp2 = Double.parseDouble(stack.pop());
                        var sum = opp1 + opp2;
                        stack.push(sum + "");
                    }
                } else if (array[i].equals("-")) {
                    if (!stack.empty()) {
                        var opp1 = Double.parseDouble(stack.pop());
                        var opp2 = Double.parseDouble(stack.pop());
                        var sub = opp2 - opp1;
                        stack.push(sub + "");
                    }
                } else if (array[i].equals("*")) {
                    if (!stack.empty()) {
                        var opp1 = Double.parseDouble(stack.pop());
                        var opp2 = Double.parseDouble(stack.pop());
                        var mult = opp1 * opp2;
                        stack.push(mult + "");
                    }
                } else if (array[i].equals("/")) {
                    if (!stack.empty()) {
                        var opp1 = Double.parseDouble(stack.pop());
                        var opp2 = Double.parseDouble(stack.pop());
                        var div = opp2 / opp1;
                        stack.push(div + "");
                    }
                }
                else {
                    stack.push(array[i]);
                }
            }
        return stack.pop();
    }
}

