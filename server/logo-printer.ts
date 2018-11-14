import colors = require('colors/safe');

export class LogoPrinter {
  print() {
    console.log();
    console.log(colors.yellow('                       oooooo   oooooo     oooo  o8o             '));
    console.log(colors.yellow('                        `888.    `888.     .8\'   `"\'             '));
    console.log(colors.yellow('ooo. .oo.    .oooooooo   `888.   .8888.   .8\'   oooo    oooooooo '));
    console.log(colors.yellow('`888P"Y88b  888\' `88b     `888  .8\'`888. .8\'    `888   d\'""7d8P  '));
    console.log(colors.yellow(' 888   888  888   888      `888.8\'  `888.8\'      888     .d8P\'   '));
    console.log(colors.yellow(' 888   888  `88bod8P\'       `888\'    `888\'       888   .d8P\'  .P '));
    console.log(colors.yellow('o888o o888o `8oooooo.        `8\'      `8\'       o888o d8888888P  '));
    console.log(colors.yellow('            d"     YD                                            '));
    console.log(colors.yellow('            "Y88888P\'                                            '));
    console.log();
  }
}
