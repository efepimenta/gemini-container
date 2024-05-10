require('dotenv').config();
const fs = require('fs');
const path = require('path'); // Importar módulo 'path' para manipulação de caminhos
const { execSync } = require('child_process');

const argumento1 = process.argv[2];
const argumento2 = process.argv[3];

if (!argumento1) {
    console.log('Argumentos inválidos. Exemplo de uso: node index.js <pasta do projeto> [-s]');
    return;
}
if (argumento1 === '-s') {
    console.log('Argumentos inválidos. Exemplo de uso: node index.js <pasta do projeto> [-s]');
    return;
}
if (argumento2 && argumento2 !== '-s') {
    console.log('Argumentos inválidos. Exemplo de uso: node index.js <pasta do projeto> [-s]');
    return;
}

function processarPasta() {
    // Validar se a pasta existe
    try {
        fs.statSync(argumento1);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Erro: A pasta "${argumento1}" não existe.`);
            return false;
        } else {
            console.error(`Erro inesperado ao verificar pasta: ${error.message}`);
            return false;
        }
    }

    // Validar se o arquivo composer.json existe
    const arquivoComposer = path.join(argumento1, 'composer.json');
    try {
        fs.statSync(arquivoComposer);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error(`Erro: O arquivo "composer.json" não existe na pasta "${argumento1}".`);
            return false;
        } else {
            console.error(`Erro inesperado ao verificar arquivo: ${error.message}`);
            return false;
        }
    }

    // Carregar o conteúdo do arquivo composer.json
    const dadosComposer = fs.readFileSync(arquivoComposer, 'utf8');
    try {
        return JSON.parse(dadosComposer).require;
    } catch (error) {
        console.error(`Erro ao processar o arquivo "composer.json": ${error.message}`);
        return false;
    }
}

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({model: 'gemini-1.0-pro'});

async function run(parts) {
    // For text-only input, use the gemini-pro model
    const generationConfig = {
        temperature: 0.1
    };
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];


    const model = genAI.getGenerativeModel({model: 'gemini-1.0-pro', generationConfig, safetySettings});

    const result = await model.generateContent([...parts]);
    const response = await result.response;
    const text = response.text();
    if (text === 'false') {
        return false;
    }
    const services = [];
    text.split(',').forEach((service) => {
        const [name, version] = service.split(':');
        if (['magento','elasticsearch','mariadb','php','rabbitmq','redis','nginx'].includes(name)) {
            if (name === 'magento' || (name !== 'magento' && validateDecimalNumber(version))) {
                services.push({name, version});
            }
        }
    });
    if (services.length === 7) {
        const mappedData = [];
        services.forEach(obj => {
            const mappedObj = {};
            mappedObj[obj.name] = obj.version;
            mappedData.push(mappedObj);
        });
        return mappedData;
    }
    return false;
}

function validateDecimalNumber(number) {
    const regex = /^(?:\d+\.\d{1,2}|\d+)$/;
    return regex.test(number);
}

function getCsvData() {
    const filePath = './data/controle.csv'; // Substitua por seu caminho de arquivo real
    return fs.readFileSync(filePath, 'utf8');
}

let input_values = '';
const versions = processarPasta();
Object.keys(versions).forEach((service) => {
    input_values += `${service}:${versions[service]},`;
});
const parts = [
    `dados de controle: ${getCsvData()}`,
    'formato dos dados de controle: csv sem cabeçalho e para cada linha = servico e suas versoes, coluna = veroes e seus servicos',
    'valide se existe uma versao correspondente nos dados de entrada que esteja nos dados de controle',
    'se sim, a resposta deve ser: magento:versao_encontrada,composer:versao_encontrada,elasticsearch:versao_encontrada,mariadb:versao_encontrada,php:versao_encontrada,rabbitmq:versao_encontrada,redis:versao_encontrada,varnish:versao_encontrada,nginx:versao_encontrada\nonde versao_encontrada é somente o valor da versao',
    'se nao, a resposta deve ser o texto false',
    `dados de entrada: ${input_values}`
];

run(parts).then((response) => {
    if (response !== false) {
        const params = {
            magento: 'v',
            nginx: 'n',
            php: 'p',
            mariadb: 's',
            elasticsearch: 'e',
            rabbitmq: 'q',
            redis: 'r',
        }
        let command = `fcontainer magic -k -m -b ${argumento1} `;
        response.forEach((service) => {
            const [name, version] = Object.entries(service)[0];
            command += `-${params[name]} ${version} `;
        });
        if (argumento2) {
            console.log(command);
            return;
        }
        require("child_process").spawn(
            command,
            {shell: true, stdio: 'inherit'}
        );
    } else {
        console.log(response);
    }
});
