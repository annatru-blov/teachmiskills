const fs = require('fs');

const { Transform, pipeline } = require('stream');
const read = fs.createReadStream('data.txt', { encoding: 'utf-8' });
read.on('data', (chunk) => console.log('chunk', chunk.length));
read.on('end', () => console.log('end'));

read.pipe(fs.createWriteStream('copy.txt'))
.on('finish', () => console.log('copied'))


const upper = new Transform({
    decodeStrins: false, 
    transform(chunk, enc, cb) {
        cb(null, chunk.toString().toUpperCase());
    }
})
//console.log(upper);


pipeline(
    read,
    upper, 
    fs.createReadStream('upper.txt'),
    (err) => err ? console.error(err) : console.log('done')
)