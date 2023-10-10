var fs = require("fs");
var c = require("ansi-colors");
var sampleText = `
hi macha
eduthuko macha a=2
eduthuko macha b=3
ippo macha (a+b==5)
{
    padi macha a+b + " macha"
} illana macha {
    padi macha "illana macha"
}
bye macha
`;

process.argv.forEach(function (val, index, array) {
  if (index == 2) {
    var path = val;
    fs.readFile(path, "utf8", function (err, data) {
      if (err) throw err;
      console.log(c.yellow(path + " pannitu iruken macha..."));
      text = data;
      interpret(text);
    });
  }
});
function findDataBetweenQuotes(text) {
  return text.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
}

function interpret(text) {
  var inputSplit = text.split("\n");
  var output = "";
  var begin = false;

  if (!text.includes("hi macha") || !text.includes("bye macha")) {
    console.log("Dei macha, hi macha and bye macha use pannu");
    return;
  }
  for (var i = 0; i < inputSplit.length; i++) {
    inputSplit[i] = inputSplit[i]
      .trim()
      .replace(/ama/gm, "true")
      .replace(/poi/gm, "false")
      .replace(/onnum illa/gm, "null");

    if (begin == true) {
      if (inputSplit[i].includes("eduthuko macha")) {
        //begin interpreting
        var variable = inputSplit[i].split(" ")[2].split("=")[0];
        var value = inputSplit[i].substring(
          inputSplit[i].indexOf("=") + 1,
          inputSplit[i].length
        );

        output += "\nvar " + variable + "=" + value + ";";
      } else if (inputSplit[i].includes("padi macha")) {
        //print
        var print = inputSplit[i].replace("padi macha", "");
        output += "\nconsole.log(" + print + ");";
      } else if (inputSplit[i].includes("hi macha")) {
        begin = true;
      } else if (inputSplit[i].includes("ippo macha")) {
        //if condition
        var condition = inputSplit[i].replace("ippo macha", "");
        output += "\nif" + condition + "";
      } else if (inputSplit[i].includes("illana macha")) {
        //else condition
        var condition = inputSplit[i].replace("illana macha", "else");
        output += "\n" + condition;
      } else if (inputSplit[i].includes("bye macha")) {
        begin = false;
        try {
          eval(output);
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.log(c.red("ayyo macha :( error:"));
            console.log(c.bgRedBright(e));
            console.log(c.yellowBright("spelling check pannu macha"))
          } else {
            console.log(c.green("wow macha!"));
          }
        }
        break;
      } else {
        output += "\n" + inputSplit[i];
      }
    } else if (inputSplit[i].includes("hi macha")) {
      begin = true;
    }
  }
}
