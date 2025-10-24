const fs = require('fs');
const path = require('path');
const readline = require('readline'); //взаимодействие с пользователями через консоль
const os = require('os');
const pkg = require('../package.json');

const argv = process.argv.slice(2);
const [command, subcommand, ...rest] = argv;

const CONFIG_PATH = path.join(os.homedir(), '.hello-cli.json');

function loadConfig() {
    try {
        const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
        return JSON.parse(raw);

    } catch {
        return {};
    }
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

function printHelp() {
    console.log('Использование:');
    console.log('hello <команда> [опции] \n');
    console.log('Команды:');
    console.log('init Конфиги');

    console.log('help   Показать помощь');
    console.log('greet [--name]-n Поздороваться');
    console.log('add [a b c ...] Сложить числа');
    console.log('now  Показать текущую дату и время');
    console.log('version Показать номер версии');
    console.log('config  get: получить конфиг, set: установить конфиг set');

    //console.log('\n Общие опции');
}

function parseFlags(args) {
    const flags = {
        _: []
    };

    for (let i = 0; i < args.length; i++) {
        const a = args[i];

        if (a === '-n' || a === '--name') {
            flags.name = args[i + 1];
            i++;
        } else if (a.startsWith('--name=')) {
            flags.name = a.split('=')[1];
        } else if (a.startsWith('-')) {
            if (!flags.unknown) {
                flags.unknown = [];
            }
            flags.unknown.push(a);
        } else {
            flags._.push(a);
        }
    }

    return flags;
}

async function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    const answer = await new Promise((resolve) => {
        rl.question(question, resolve);
    });

    rl.close();

    return answer;
}

async function main() {
    if (!command || command === 'help' || rest.includes('-h') || rest.includes('--help')) {
        return printHelp();
    }

    const flags = parseFlags(rest);

    if (flags.unknown && flags.unknown.length) {
        console.warn(`Предупреждение: неизвестные флаги ${flags.unknown.join(', ')}`);
    }

    const ctg = loadConfig();

    switch (command) {
        case 'version': {
            console.log(pkg.version);
            break;

        }
        case 'now': {
            console.log(new Date().toString());
            break;

        }

        case 'init': {
            let name = flags.name
            if (!name) {
                name = await prompt('Как тебя зовут?');

            }
            const next = {
                ...ctg,
                name
            }
            saveConfig(next);
            console.log(`Готово Конфиг сохранен в ${CONFIG_PATH}`);
            break;

        }

        case 'greet': {
            const name = flags.name || ctg.name || 'Пользователь';
            console.log(`Привет, ${name}!`);
            if (!ctg.name && !flags.name) {
                console.log('Подсказка: сохраните имя командой init ');
            }
            break;
        }

        case 'add': {
            let nums = flags._.length ? flags._ : null;
            if (!nums) {
                const line = await prompt('Введите числа через пробел');
                nums = line.split(/\s+/).filter(Boolean)
            }

            const values = nums.map(Number);
            if (values.some(Number.isNaN)) {
                console.error('Ошибка все аргументы должны быть числами');
                process.exitCode = 1;
                return;
            }

            const sum = values.reduce((a, b) => a + b);
            console.log(`Результат: ${sum}`);
            break;
        }

        case 'config': {

            if (subcommand === 'get') {
                const surname = ctg.surname || 'Фамилия не задана';
                console.log(surname);
                if (!ctg.surname) {
                    console.log('Подсказка: сохраните фамилию командой congig set ');
                }
            } else if (subcommand === 'set') {
                const surname = await prompt('Введите фамилию');
                const next = {
                    ...ctg,
                    surname
                }
                saveConfig(next);
                console.log(`Готово Конфиг сохранен в ${CONFIG_PATH}`);
            } else {
                console.error(`Неизвестная подкоманда ${subcommand}`);
                printHelp();
                process.exitCode = 1;
            }
            break;
        }

        default: {
            console.error(`Неизвестная команда ${command}`);
            printHelp();
            process.exitCode = 1;
        }
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
})