const BIAS = 127;
const NUM_EXPONENT_BITS_SINGLE = 8;
const NUM_EXPONENT_BITS_DOUBLE = 11;
const NUM_FRACTION_BITS_SINGLE = 23;
const NUM_FRACTION_BITS_DOUBLE = 52;
const NUM_SIGN_BITS = 1;

function RunConverters() {
    var input = $("#floatInput").val();

    SinglePercision(input);
    DoublePercision(input);
}

function SinglePercision(input) {
    var binOutput = toBinary(input, false);
    var floatFromBinary = toFloat(binOutput);
    var errorPercentage = (1 - floatFromBinary / input) * 100;

    $('#originalNumberSingle').text(input);
    $('#binaryOutputSingle').text(binOutput);
    $('#floatFromBinarySingle').text(floatFromBinary);
    $('#errorPercentageSingle').text(errorPercentage + "%");
}

function DoublePercision(input) {
    var binOutput = toBinary(input, true);
    var floatFromBinary = toFloat(binOutput);
    var errorPercentage = (1 - floatFromBinary / input) * 100;

    $('#originalNumberDouble').text(input);
    $('#binaryOutputDouble').text(binOutput);
    $('#floatFromBinaryDouble').text(floatFromBinary);
    $('#errorPercentageDouble').text(errorPercentage + "%");
}


function toBinary(number, doubleFlag) {
    // Split the input string into the whole number part and the decimal part
    var temp = number.split(".");
    var decimal = parseFloat("." + temp[1]);
    var wholeNumber = parseInt(temp[0]);
    
    // Check if the number is negative
    var negativeBit = 0;
    if (number < 0) {
        wholeNumber *= -1;
        negativeBit = 1;
    }
    
    // Convert to binary
    var binaryInt = intToBinary(wholeNumber);
    var binaryFloat = decimalToBinary(decimal); 
    
    // Combine whole number and decimal and find exponent
    var exponentAndMantissa = "";
    if (doubleFlag === true) {
        exponentAndMantissa = findMantissaAndExponentDouble(binaryInt, binaryFloat);
    }
    else {
        exponentAndMantissa = findMantissaAndExponentSingle(binaryInt, binaryFloat);
    }
    
    return negativeBit + " | " + exponentAndMantissa;
}

function findMantissaAndExponentSingle(num, dec) {
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

    if (mantissa.length > NUM_FRACTION_BITS_SINGLE) {
        // Cut off end if the number is too long
        mantissa = mantissa.substring(0, NUM_FRACTION_BITS_SINGLE);
    } else if (mantissa.length < NUM_FRACTION_BITS_SINGLE) {
        // Append zeros to the end if it is not long enough
        var count = NUM_FRACTION_BITS_SINGLE - mantissa.length;
        while (count != 0) {
            mantissa += "0";
            count--;
        }
    }

    if (exponent.length > NUM_EXPONENT_BITS_SINGLE) {
        // Cut off end if the number is too long, though this should never realistically happen and if it did an overflow should occur.
        exponent = exponent.substring(0, NUM_EXPONENT_BITS_SINGLE - 1);
    } else if (exponent.length < NUM_EXPONENT_BITS_SINGLE) {
        // Pad with zeros if it is too small
        var count = NUM_EXPONENT_BITS_SINGLE - exponent.length;
        while (count != 0) {
            exponent = "0" + exponent;
            count--;
        }
    }

    return exponent + " | " + mantissa;
}

function findMantissaAndExponentDouble(num, dec) {
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

    if (mantissa.length > NUM_FRACTION_BITS_DOUBLE) {
        // Cut off end if the number is too long
        mantissa = mantissa.substring(0, NUM_FRACTION_BITS_DOUBLE);
    } else if (mantissa.length < NUM_FRACTION_BITS_DOUBLE) {
        // Append zeros to the end if it is not long enough
        var count = NUM_FRACTION_BITS_DOUBLE - mantissa.length;
        while (count != 0) {
            mantissa += "0";
            count--;
        }
    }

    if (exponent.length > NUM_EXPONENT_BITS_DOUBLE) {
        // Cut off end if the number is too long, though this should never realistically happen and if it did an overflow should occur.
        exponent = exponent.substring(0, NUM_EXPONENT_BITS_DOUBLE - 1);
    } else if (exponent.length < NUM_EXPONENT_BITS_DOUBLE) {
        // Pad with zeros if it is too small
        var count = NUM_EXPONENT_BITS_DOUBLE - exponent.length;
        while (count != 0) {
            exponent = "0" + exponent;
            count--;
        }
    }

    return exponent + " | " + mantissa;
}

function intToBinary(num) {
    var result = "";
    if (num === 0) {
        result = result + "0"; 
    } else {
        // Save remainder when dividing by two and half the number
        while (num != 0) {
            result = num % 2 + result;
            num = Math.floor(num / 2);
        }
    }

    return result; 
}

function decimalToBinary(num) {
    // Multiply by two and save the first number, then subtract by one if that value was a 1.
    result = ""; 
    while (num != 0 && num > 0) {
        num = num * 2;
        if (num >= 1) {
            result = result + "1"; 
            //var one = 1;
            num = num - 1;
        } else {
            result = result + "0"; 
        }
    }

    result = result + "0";
    
    return result 
}

function toFloat(binary) {
    
    var split = binary.split(" | ");

    var exponent = binaryToInt(split[1]) - BIAS;

    var wholeNumber = 0;
    var decimal = 0.0;
    if (exponent >= 0) {
        wholeNumber = binaryToInt("1" + split[2].substring(0, exponent));
        decimal = binaryToFloat(split[2].substring(exponent));
    } else {
        wholeNumber = 0;
        var temp = split[2];
        temp = "1" + temp;
        for (let i = exponent + 1; i < 0; i++) {
            temp = "0" + temp;
        }

        decimal = binaryToFloat(temp);
    }

    var value = wholeNumber + decimal;

    if (split[0] === "1") {
        value = value * -1;
    }
    
    return value;
}

function binaryToInt(bin) {
    var value = 0;
    for (let i = bin.length - 1; i >= 0; i--) {
        // Each digit in a binary value has a value of {DIGIT} * 2^(i) where i is the distance from the right most digit (so the right-most digit has an i value of 0)
        value += parseInt(bin.charAt(i) + "") * (Math.pow(2, (bin.length - i - 1)));
    }

    return value;
}

function binaryToFloat(bin) {
    var value = 0.0;
    for (let i = 0; i < bin.length - 1; i++) {
        // Each digit after the decimal point is 1 / 2^(i) where i = the distance from the decimal point (so the first digit after the . has an i value of 0), when counting left to right. 
        value += parseInt(bin.charAt(i) + "") * 1 / (Math.pow(2, i + 1));
    }

    return value;
}
