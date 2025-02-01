import yamlParser from 'js-yaml';
import fs from 'node:fs';
// import path from 'node:path';

// const COMMENT = '#';
// const EMPTY_STRING = '';
// const SEMI_COLON = ':';
// const SINGLE_SPACED_STRING = ' ';

// export default function parseTargetYAML() {
//     console.log(process.cwd() + '/_config/sample.yaml');
//     const PATH = path.join(process.cwd() + '/_config/sample.yaml')
//     const yamlString = fs.readFileSync(PATH, {
//         encoding: 'utf-8'
//     });
//     const result = {};

//     const yamlStringArr = yamlString.split('\n');

//     for (let i = 0; i < yamlStringArr.length; i++) {
//         const TOKEN = yamlStringArr[i];
//         console.log({ TOKEN })
//         if (
//             TOKEN.startsWith(COMMENT) ||
//             TOKEN === EMPTY_STRING
//         ) continue;

//         const [k, v] = TOKEN.split(SEMI_COLON);
//         console.log({ k, v })

//         console.log({ k, v: v.replace(/\s+/g, '') });
//         if (
//             v !== EMPTY_STRING
//         ) { }
//     }
// }


export const parseTargetYAML = (configFilePath = process.cwd() + '/_config/sample.yaml') => {
    const config = yamlParser.load(fs.readFileSync(configFilePath, 'utf8'));
    console.log(config);
    return config;
}