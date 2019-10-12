
if(process.argv.length<3){
    console.log(`usage:  generator.js <length>`);
    return;
}

let segundos = 0;
let max = 50;
let min = 40;
for (let i = 0; i < process.argv[2]; i++) {
    var temperatura=(25+Math.random()*30).toFixed(3);

    //let temperatura = Math.floor(Math.random() * 10);
    console.log(
        `{"milisegundos":${segundos * 1000}, "temperatura":${temperatura}},`
    );
    segundos += 3
}