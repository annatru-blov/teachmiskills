const fs = require('fs');

const bufferStr = Buffer.from('Привет!');
//console.log('string', bufferStr, '=>', bufferStr.toString());

const bAlloc = Buffer.alloc(8);
bAlloc[0] = 0x41;
//console.log(bAlloc.toString());

//0x48 => H
//0x69 => i
//0x21 => !
const bArray = Buffer.from([0x48, 0x69, 0x21]);
//console.log(bArray.toString());

console.log(bufferStr.toString('base64'));

const hello = Buffer.from('hello!');
const view = hello.slice(0,2);
view[0] = 0x78;
console.log(hello.toString());
console.log(view.toString());

const copy = Buffer.from('hello');
copy[1] = 0x70;
const helloCopy = hello.copy(copy);

console.log(copy.toString(), hello.toString());

