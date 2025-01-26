const fs = require('fs')
const path = require('path')
const yamlParser = require('js-yaml')




async function getParsedConfig() {
    let runtime, language;
    try {
        const configFilePath = path.resolve('repo', '.vulkan', 'config.yaml')
        // console.log(configFilePath)
        const doc = yamlParser.load(fs.readFileSync(configFilePath, 'utf8'));
        console.log(doc);

        if (doc.version !== '1' && doc.version !== '1.0'){
            console.log('Invalid version')
            return;
        }
        runtime = doc.config.runtime;
        language = doc.config.language

        console.log(runtime, language)
        return doc
    }
    catch (error) {
        throw new Error('Config parsing error')
    }
}

getParsedConfig();

module.exports  = {
    getParsedConfig
}