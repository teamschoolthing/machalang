var fs = require("fs");
var c = require("ansi-colors");

var syntax = fs.readFileSync("./syntax.json");

process.argv.forEach(function (val, index, array) {
  if (index == 2) {
    var path = val;
    fs.readFile(path, "utf8", function (err, data) {
      if (err) throw err;
      console.log(c.yellow(path + " " + syntax.processDescriptors.interpretationNotice));
      text = data;
      interpret(text);
    });
  }
});

function interpret(text) {
  var inputSplit = text.split("\n");
  var output = "";
  var begin = false;

  if (
    !text.includes(syntax.interpretationTriggers.start) ||
    !text.includes(syntax.interpretationTriggers.end)
  ) {
    console.log(
      `Dei ${syntax.languageDescriptors.languagePointers}, ${syntax.interpretationTriggers.start} and ${syntax.interpretationTriggers.end} use pannu`
    );
    return;
  }
  for (var i = 0; i < inputSplit.length; i++) {
    var trueRegex = new RegExp(syntax.boolean.true, "gm");
    var falseRegex = new RegExp(syntax.boolean.false, "gm");
    var nullRegex = new RegExp(syntax.nullValue, "gm");
    inputSplit[i] = inputSplit[i]
      .trim()
      .replace(trueRegex, "true")
      .replace(falseRegex, "false")
      .replace(nullRegex, "null");

    if (begin == true) {
      if (inputSplit[i].includes(syntax.variableDeclaration)) {
        //begin interpreting
        var variable = inputSplit[i].split(" ")[2].split("=")[0];
        var value = inputSplit[i].substring(
          inputSplit[i].indexOf("=") + 1,
          inputSplit[i].length
        );

        output += "\nvar " + variable + "=" + value + ";";
      } else if (inputSplit[i].includes(syntax.printStatement)) {
        //print
        var print = inputSplit[i].replace(syntax.printStatement, "");
        output += "\nconsole.log(" + print + ");";
      } else if (inputSplit[i].includes(syntax.interpretationTriggers.start)) {
        begin = true;
      } else if (inputSplit[i].includes(syntax.conditionals.if)) {
        //if condition
        var condition = inputSplit[i].replace(syntax.conditionals.if, "");
        output += "\nif" + condition + "";
      } else if (inputSplit[i].includes(syntax.conditionals.else)) {
        //else condition
        var condition = inputSplit[i].replace(syntax.conditionals.else, "else");
        output += "\n" + condition;
      } else if (inputSplit[i].includes(syntax.interpretationTriggers.end)) {
        begin = false;
        try {
          eval(output);
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.log(c.red(syntax.processDescriptors.errors.nonDescript));
            console.log(c.bgRedBright(e));
            console.log(
              c.yellowBright(syntax.processDescriptors.errors.spellCheck)
            );
          } else {
            console.log(c.green(syntax.processDescriptors.success));
          }
        }
        break;
      } else {
        output += "\n" + inputSplit[i];
      }
    } else if (inputSplit[i].includes(syntax.interpretationTriggers.start)) {
      begin = true;
    }
  }
}
