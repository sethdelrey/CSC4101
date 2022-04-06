package project2csc4101;

public class Convertor {

    private final static int BIAS = 127;

    private final static int NUM_EXPONENT_BITS = 8;
    private final static int NUM_FRACTION_BITS = 23;
    
    public static String IEEE754(double number) {
        var negativeBit = "0";
        var exponentAndMantissa = "";
        if (number < 0) {
            number *= -1;
            negativeBit = "1";
        }
        
        int wholeNumber = (int) Math.floor(number);
        var decimal = number - wholeNumber;

        if (wholeNumber != 0) {
            var wholeNumStr = intToBinary(wholeNumber);
            var decimalStr = decimalToBinary(decimal);
            exponentAndMantissa = findMantissaAndExponent(wholeNumStr, decimalStr);
        } else {
            var decimalStr = decimalToBinary(decimal);
            exponentAndMantissa = findMantissaAndExponent("0", decimalStr);
        }

        return negativeBit + " | " + exponentAndMantissa;
    }

    private static String intToBinary(int num) {
        StringBuilder sb = new StringBuilder();
        if (num == 0) {
            sb.append("0");
        } else {
            // Save remainder when dividing by two and half the number
            while (num != 0) {
                sb.insert(0, num % 2);
                num /= 2;
            }
        }

        return sb.toString();
    }

    private static String decimalToBinary(double num) {
        // Multiply by two and save the first number, then subtract by one if that value was a 1.
        StringBuilder sb = new StringBuilder();
        while (num != 0 && num > 0) {
            num = num * 2;
            if (num >= 1) {
                sb.append(1);
                float one = 1;
                num = num - one;
            } else {
                sb.append(0);
            }
        }

        sb.append(0);
        
        return sb.toString();
    }

    private static String findMantissaAndExponent(String num, String dec) {
        // Find the first 1 in the whole number part, then exp = BIAS + the number of times shifted 
        var shiftIndex = num.indexOf('1');
        var exponentInt = 0;
        var mantissa = "";
        if (shiftIndex != -1) {
            exponentInt = BIAS + (num.length() - shiftIndex - 1);
            mantissa = num.substring(shiftIndex + 1) + dec;
        } else {
            shiftIndex = dec.indexOf('1') + 1;
            exponentInt = BIAS - (shiftIndex);
            mantissa = dec.substring(shiftIndex);
        }

        var exponent = intToBinary(exponentInt);

        if (mantissa.length() > NUM_FRACTION_BITS) {
            // Cut off end if the number is too long
            mantissa = mantissa.substring(0, NUM_FRACTION_BITS);
        } else if (mantissa.length() < NUM_FRACTION_BITS) {
            // Append zeros to the end if it is not long enough
            var count = NUM_FRACTION_BITS - mantissa.length();
            while (count != 0) {
                mantissa += "0";
                count--;
            }
        }

        if (exponent.length() > NUM_EXPONENT_BITS) {
            // Cut off end if the number is too long, though this should never realistically happen and if it did an overflow should occur.
            exponent = exponent.substring(0, NUM_EXPONENT_BITS - 1);
        } else if (exponent.length() < NUM_EXPONENT_BITS) {
            // Pad with zeros if it is too small
            var count = NUM_EXPONENT_BITS - exponent.length();
            while (count != 0) {
                exponent = "0" + exponent;
                count--;
            }
        }

        return exponent + " | " + mantissa;
    }
}
