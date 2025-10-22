const EventEmitter = require('events');
const emitter = new EventEmitter();


emitter.on('greet', (name) => {
    console.log(`Hello ${name}`);
});

emitter.emit('greet', 'John');

emitter.once('connect', () => {
    console.log('Connected');
});

emitter.emit('connect');
emitter.emit('connect');



///удаление

function onMessage(msg) {
    console.log(msg);
}

emitter.on('msg', onMessage);
emitter.emit('msg', 'Hello');

emitter.off('msg', onMessage);
emitter.emit('msg', 'Секретный текст');
