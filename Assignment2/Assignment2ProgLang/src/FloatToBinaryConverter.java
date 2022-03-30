import java.io.File;
import java.util.Scanner;
import java.util.regex.Pattern;

public class FloatToBinaryConverter {
	
	private final static int BIAS = 127;
	
	private final static int NUM_EXPONENT_BITS = 8;
	private final static int NUM_FRACTION_BITS = 23;
	private final static int NUM_SIGN_BITS = 1;

	public static void convert(String fileName) {
		try {

            // Open the text file
            Scanner fin = new Scanner(new File(fileName));
            String currentSymbol = "";

            // Read the text file line by line
            while (fin.hasNextLine()) {
            	var binary = toBinary(fin.nextLine());
            	System.out.println(binary);
            }
            
		} catch (Exception e) {
			//
		}
	}
	
	private static String toBinary(String number) {
		// Split the input string into the whole number part and the decimal part
		String[] temp = number.split(Pattern.quote("."));
		var decimal = Float.parseFloat("." + temp[1]);
		var wholeNumber = Integer.parseInt(temp[0]);
		
		// Check if the number is negative
		int negativeBit = 0;
		if (wholeNumber < 0) {
			wholeNumber *= -1;
			negativeBit = 1;
		}
		
		// Convert to binary
		var binaryInt = intToBinary(wholeNumber);
		var binaryFloat = floatToBinary(decimal); 
		
		// Combine whole number and decimal and find exponent
		var exponentAndMantissa = findMantissaAndExponent(binaryInt, binaryFloat);
		
		
		return negativeBit + " " + exponentAndMantissa;
	}
	
	private static String intToBinary(int num) {
		String result = "";
		if (num == 0) {
			result = "0";
		} else {
			// Save remainder when dividing by two and half the number
			while (num != 0) {
				result = num % 2 + result;    
				num /= 2;
			}
		}
		
		return result;
	}
	
	private static String floatToBinary(float num) {
		// Multiply by two and save the first number, then subtract by one if that value was a 1.
		String result = "";
		while (num != 0 && num > 0) {
			num = num * 2;
			if (num >= 1) {
				result = result + 1;
				float one = 1;
				num = num - one;
			} else {
				result = result + 0;
			}
		}
		
		result = result + 0;
		
		return result;
	}
	
	private static String findMantissaAndExponent(String num, String dec) {
		// Find the first 1 in the whole number part, then exp = BIAS + the number of times shifted 
		var shiftIndex = num.indexOf('1');
		var exponentInt = BIAS + (num.length() - shiftIndex - 1);  
		
		var exponent = intToBinary(exponentInt);
		var mantissa = num.substring(shiftIndex + 1) + dec;
		
		if (mantissa.length() > NUM_FRACTION_BITS) {
			// Cut off end if the number is too long
			mantissa = mantissa.substring(0, NUM_FRACTION_BITS);
		}
		else if (mantissa.length() < NUM_FRACTION_BITS) {
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
		}
		else if (exponent.length() < NUM_EXPONENT_BITS) {
			// Pad with zeros if it is too small
			var count = NUM_EXPONENT_BITS - exponent.length();
			while (count != 0) {
				exponent = "0" + exponent; 
				count--;
			}
		}
		
		return exponent + " " + mantissa;
	}
}
