//$('document').ready(() => ($('#reset').hide()));
let state = 0;

let stack = [0];

let queue = new Array();

let errorFlag = false;

let derStep = "";

const parseTable = [
    ["S5", "",   "",   "S4", "",    "",       "1", "2", "3"],   // 0
    ["",   "S6", "",   "",   "",    "accept", "",  "",  ""],    // 1
    ["",   "R2", "S7", "",   "R2",  "R2",     "",  "",  ""],    // 2 
    ["",   "R4", "R4", "",   "R4",  "R4",     "",  "",  ""],    // 3
    ["S5", "",   "",   "S4", "",    "",       "8", "2", "3"],   // 4
    ["",   "R6", "R6", "",   "R6",  "R6",     "",  "",  ""],    // 5
    ["S5", "",   "",   "S4", "",    "",       "",  "9", "3"],   // 6
    ["S5", "",   "",   "S4", "",    "",       "",  "",  "10"],  // 7
    ["",   "S6", "",   "",   "S11", "",       "",  "",  ""],    // 8
    ["",   "R1", "S7", "",   "R1",  "R1",     "",  "",  ""],    // 9
    ["",   "R3", "R3", "",   "R3",  "R3",     "",  "",  ""],    // 10
    ["",   "R5", "R5", "",   "R5",  "R5",     "",  "",  ""]     // 11
]

const stackTrace = $("#stackTrace");

function Reset() {
    window.location.reload();
}

function RunBottomUp() {
    $('#reset').hide();
    $("#errorText").hide();
    $("#successText").hide();
    ClearAllColors();
    ClearAllDivs();
    ClearAllVals();

    StackPush(0);

    var input = $("#codeInput").val();
    if (input == "") {
        $('#errorText').text("You need to enter a value you parse.");
        $("#errorText").show();
        return;
    } else {
        $('#errorText').text("");
    }
    input = input.replaceAll(" ", "");

    if (input[input.length - 1] != "$") {
        input += "$";
    }

    derStep = input;
    AddToDerSteps();
    var charArray = input.split('');
    let token = "";
    let column = 0;
    let tableData = "";
    
    for (let i = 0; i < charArray.length; i++) {
        
        token = charArray[i];
        if (token == 'i') {
            i++;
            token += charArray[i];
        }
        column = GetNumberFromToken(token);
        tableData = parseTable[state][column];
    
        ParseTableData(tableData, token, null);

        if (errorFlag) {
            return;
        }

    }
    
    evalTableColor();

    $('#reset').show();
}

function evalTableColor() {
    var count = 0;

    var nIntervalId = setInterval(() => {
        if (count >= queue.length - 1) {
            clearInterval(nIntervalId);
        }
        let stateIN = queue[count].state;
        let characterIN = queue[count].character;
        let colorIN = queue[count].color;

        var id = "#state" + stateIN + "char" + EditIfSpecialCharacter(characterIN);
        console.log(id);
        $(id).css("background-color", colorIN);
        count = (count + 1);
        }, 250
    );
}

function ClearAllColors() {
    var tds = $(".colorCanChange");

    for (let i = 0; i < tds.length; i++) {
        tds.eq(i).css("background-color", "white");
    }
}

function ClearAllDivs() {
    $("#stackTrace").empty();
    $("#prodRules div").empty();
    $("#derSteps div").empty();
    $("#actions div").empty();
    $("#stepsDone div").empty();
}

function ClearAllVals() {
    stack = new Array();
    queue = new Array();
    state = 0;
    errorFlag = false;
    derStep = "";
}

function ColorTableData(state, character, color) {
    
    queue.push({state, character, color});
    var bl = state == 1 && character == "$";
    if (!(color == "red" || (bl))) {
        color = "white";
        queue.push({state, character, color});
    }
}

function ParseTableData(tableData, token, gotoValue) {
    let color = "green";
    if (tableData == "") {
        color = "red";
    }
    
    if (gotoValue != null) {
        ColorTableData(state, gotoValue, color);
    }
    else {
        ColorTableData(state, token, color);
    }

    var tdArray = tableData.split('');
    
    if (tdArray[0] == 'S') {
        // Put token onto the stack and set state equal to number portion
        AddToAction(tableData);
        StackPush(token);
        var stateText = ""
        for (let i = 1; i < tdArray.length; i++) {
            stateText += tdArray[i];
        }
        // Push state onto the stack
        AddToStepsDone("Shift Input. Go to state " + stateText);
        state = parseInt(stateText);
        StackPush(state);
    }
    else if (tdArray[0] == 'R') {
        // Reduce using the 
        AddToAction(tableData);
        var ruleText = "";
        for (let i = 1; i < tdArray.length; i++) {
            ruleText += tdArray[i];
        }
        AddToStepsDone("Reduce using production rule " + ruleText + ".");
        Reduce(parseInt(ruleText), token);
    }
    else if (tableData == "accept") {
        
        $('#successText').text("The parsing has finished!");
        $('#successText').show();
        console.log("FINISHED");
    }
    else if (Number(tdArray[0]) != NaN) {
        var stateText = ""
        for (let i = 0; i < tdArray.length; i++) {
            stateText += tdArray[i];
        }
        var temp = parseInt(stateText);
        if (!Number.isNaN(temp)) {
            state = temp;
            StackPush(state);
            ParseTableData(parseTable[state][GetNumberFromToken(token)], token);
        }
        else {
            throwError();
            //setTimeout(() => (alert("An error has orrured!")), 1000);
            
        }
        

        
    }
    else {
        // Throw an error
        throwError();
    }
}

function Reduce(rule, token) {
    // Pop the state off the stack
    state = StackPop();
    switch (rule) {
        // E -> E + T
        case 1:
            AddToProdRules("E -> E + T")
            StackPop();
            StackPop();
            StackPop();
            peek = stack[stack.length-1];
            state = peek
            derStep = derStep.replace("E+T", "E");
            AddToDerSteps();
            ParseTableData(parseTable[peek][GetNumberFromToken(token)], token);
            break;

        // E -> T
        case 2:
            AddToProdRules("E -> T")
            StackPop();
            var peek = stack[stack.length-1];
            StackPush("E");
            state = peek;
            derStep = derStep.replace("T", "E");
            AddToDerSteps();
            ParseTableData(parseTable[peek][GetNumberFromToken("E")], token, "E");
            break;

        // T -> T * F
        case 3: 
            AddToProdRules("T -> T * F")
            StackPop();
            StackPop();
            StackPop();
            peek = stack[stack.length-1];
            state = peek
            derStep = derStep.replace("T*F", "T");
            AddToDerSteps();
            ParseTableData(parseTable[peek][GetNumberFromToken(token)], token);
            break;

        // T -> F
        case 4:
            AddToProdRules("T -> F")
            StackPop();
            var peek = stack[stack.length-1];
            StackPush("T");
            state = peek;
            derStep = derStep.replace("F", "T");
            AddToDerSteps();
            ParseTableData(parseTable[peek][GetNumberFromToken("T")], token, "T");
            
            break;

        // F -> (E)
        case 5: 
            AddToProdRules("F -> (E)")
            derStep = derStep.replace("(E)", "F");
            AddToDerSteps();
            StackPop();
            StackPop();
            StackPop();
            StackPop();
            StackPop();
            peek = stack[stack.length-1];
            state = peek
            StackPush("F");
            ParseTableData(parseTable[peek][GetNumberFromToken("F")], token, "F");
            break;

        // F -> id
        case 6:
            AddToProdRules("F -> id")
            StackPop();
            var peek = stack[stack.length-1];
            StackPush("F");
            state = peek;
            derStep = derStep.replace("id", "F");
            AddToDerSteps();
            ParseTableData(parseTable[peek][GetNumberFromToken("F")], token, "F");
            break;
    }
}

function StackPush(token) {
    stack.push(token);
    $("#stackTrace").append('<li>' + stack.join('') + '</li>');
}

function StackPop() {
    stack.pop();
    $("#stackTrace").append('<li>' + stack.join('') + '</li>');
}

function AddToAction(action) {
    $("#actions").append('<div>' + action + '</div>');
}

function AddToProdRules(pr) {
    $("#prodRules").append('<div>' + pr + '</div>');
}

function AddToDerSteps() {
    $("#derSteps").append('<div>' + derStep + '</div>');
}

function AddToStepsDone(step) {
    $("#stepsDone").append('<div>' + step + '</div>');
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

function throwError(message) {
    evalTableColor();
    if (message == null || message == "") {
        message = "A parsing error has occured."
    }
    $('#errorText').text(message);
    $('#errorText').show();
    errorFlag = true;
}