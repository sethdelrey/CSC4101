//$('document').ready(ColorTableData(5, '*'));
let state = 0;

let parseTable = [
    ["S5", "", "", "S4", "", "", "1", "2", "3"], 
    ["", "S6", "", "", "", "accept", "", "", ""], 
    ["", "R2", "S7", "", "R2", "R2", "", "", ""], 
    ["", "R4", "R4", "", "R4", "R4", "", "", ""], 
    ["S5", "", "", "S4", "", "", "8", "2", "3"], 
    ["", "R6", "R6", "", "R6", "R6", "", "", ""], 
    ["S5", "", "S4", "", "", "", "", "9", "3"], 
    ["S5", "", "", "S4", "", "", "", "", "10"], 
    ["", "S6", "", "", "S11", "", "", "", ""], 
    ["", "R1", "S7", "", "R1", "R1", "", "", ""], 
    ["", "R3", "R3", "", "R3", "R3", "", "", ""], 
    ["R5", "R5", "", "R5", "R5", "", "", "", ""]
]


function RunBottomUp() {
    var input = $("#codeInput").val();
    console.log(input);
    var charArray = input.split('');
    let token = "";
    let column = 0;
    let tableData = "";
    let color = "green";
    for (let i = 0; i < charArray; i++) {
        token = charArray[i];
        if (token == 'i') {
            i++;
            token += charArray[i];
        }

        column = GetNumberFromToken(token);
        tableData = parseTable[state][column];
        if (tableData == "") {
            color = "red";
        }
        ColorTableData(state, '*', 'green');
    }
    
}

function ColorTableData(state, character, color) {
    var id = "#state" + state + "char" + EditIfSpecialCharacter(character);
    console.log(id);
    $(id).css("background-color",color);
}



function EditIfSpecialCharacter(char) {
    switch (char) {
        case '*':
            char = "\\" + char;
            break;
        case '+':
            char = "\\" + char;
            break;
        case '(':
            char = "\\" + char;
            break;
        case ')':
                char = "\\" + char;
                break;
        case '$':
                char = "\\" + char;
                break;
        default:
            char = char;
    }

    return char;
}

function GetNumberFromToken(token) {
    var num = 0;
    switch (token) {
        case 'id':
            num = 0;
            break;
        case '+':
            num = 1;
            break;
        case '*':
            num = 2;
            break;
        case '(':
            num = 3;
            break;
        case ')':
            num = 4;
            break;
        case '$':
            num = 5;
            break;
        case 'E':
            num = 6;
            break;
        case 'T':
            num = 7;
            break;
        case 'F':
            num = 8;
            break;
    }

    return num;
}