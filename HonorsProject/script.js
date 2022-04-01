const BIAS = 127;
const NUM_EXPONENT_BITS = 8;
const NUM_FRACTION_BITS = 23;
const NUM_SIGN_BITS = 1;

function RunConverters() {
    var input = $("#floatInput").val();
    var binOutput = toBinary(input);

    $('#outputSpan').text(binOutput);
}

function toBinary(number) {
    // Split the input string into the whole number part and the decimal part
    var temp = number.split(".");
    var decimal = parseFloat("." + temp[1]);
    var wholeNumber = parseInt(temp[0]);
    
    // Check if the number is negative
    var negativeBit = 0;
    if (wholeNumber < 0) {
        wholeNumber *= -1;
        negativeBit = 1;
    }
    
    // Convert to binary
    console.log(wholeNumber + "." + decimal);
    var binaryInt = intToBinary(wholeNumber);
    var binaryFloat = decimalToBinary(decimal); 
    
    // Combine whole number and decimal and find exponent
    var exponentAndMantissa = findMantissaAndExponent(binaryInt, binaryFloat);
    
    
    return negativeBit + " | " + exponentAndMantissa;
}

// function ToBinary(input) {

//     var number = parseFloat(input);

//     var negativeBit = "0";
//     var exponentAndMantissa = "";
//     if (number < 0) {
//         number *= -1;
//         negativeBit = "1";
//     }

//     var wholeNumber = Math.floor(number);
//     var decimal = number - wholeNumber;
//     console.log(wholeNumber);
//     console.log(decimal);

//     if (wholeNumber != 0) {
//         var wholeNumStr = intToBinary(wholeNumber);
//         var decimalStr = decimalToBinary(decimal);
//         exponentAndMantissa = findMantissaAndExponent(wholeNumStr, decimalStr);
//     } else {
//         var decimalStr = decimalToBinary(decimal);
//         exponentAndMantissa = findMantissaAndExponent("0", decimalStr);
//     }

//     return negativeBit + " | " + exponentAndMantissa;

// }

function intToBinary(num) {
    var result = "";
    if (num == 0) {
        result = result + "0"; //sb.append("0");
    } else {
        // Save remainder when dividing by two and half the number
        while (num != 0) {
            result = num % 2 + result;
            //sb.insert(0, num % 2);
            num = Math.floor(num / 2);
        }
    }

    return result; //sb.toString();
}

function decimalToBinary(num) {
    // Multiply by two and save the first number, then subtract by one if that value was a 1.
    result = ""; //StringBuilder sb = new StringBuilder();
    while (num != 0 && num > 0) {
        num = num * 2;
        if (num >= 1) {
            result = result + "1"; //sb.append(1);
            //var one = 1;
            num = num - 1;
        } else {
            result = result + "0"; //sb.append(0);
        }
    }

    result = result + "0";

    //sb.append(0);
    
    return result //sb.toString();
}

function findMantissaAndExponent(num, dec) {
    // Find the first 1 in the whole number part, then exp = BIAS + the number of times shifted 
    var shiftIndex = num.indexOf('1');
    var exponentInt = 0;
    var mantissa = "";
    if (shiftIndex != -1) {
        exponentInt = BIAS + (num.length - shiftIndex - 1);
        mantissa = num.substring(shiftIndex + 1) + dec;
    } else {
        shiftIndex = dec.indexOf('1') + 1;
        exponentInt = BIAS - (shiftIndex);
        mantissa = dec.substring(shiftIndex);
    }

    var exponent = intToBinary(exponentInt);

    if (mantissa.length > NUM_FRACTION_BITS) {
        // Cut off end if the number is too long
        mantissa = mantissa.substring(0, NUM_FRACTION_BITS);
    } else if (mantissa.length < NUM_FRACTION_BITS) {
        // Append zeros to the end if it is not long enough
        var count = NUM_FRACTION_BITS - mantissa.length;
        while (count != 0) {
            mantissa += "0";
            count--;
        }
    }

    if (exponent.length > NUM_EXPONENT_BITS) {
        // Cut off end if the number is too long, though this should never realistically happen and if it did an overflow should occur.
        exponent = exponent.substring(0, NUM_EXPONENT_BITS - 1);
    } else if (exponent.length < NUM_EXPONENT_BITS) {
        // Pad with zeros if it is too small
        var count = NUM_EXPONENT_BITS - exponent.length;
        while (count != 0) {
            exponent = "0" + exponent;
            count--;
        }
    }

    return exponent + " | " + mantissa;
}