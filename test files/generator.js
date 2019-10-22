
if(process.argv.length<3)
    num = (25+Math.random()*100).toFixed(2);
else
    num=process.argv[2];

let segundos = 0;
let max = 50;
let min = 40;

for (let i = 0; i < num; i++) {
    var temperatura=(25+Math.random()*15).toFixed(2);
    var ppm=(300+Math.random()*100).toFixed(0);

    //let temperatura = Math.floor(Math.random() * 10);
    console.log(
        `{"milisegundos":${segundos * 1000}, "temperatura":${temperatura}, "ppm":${ppm}},`
    );
    segundos += 3
}