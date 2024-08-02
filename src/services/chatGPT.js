const OpenAI  = require('openai');
const openai = new OpenAI();

async function createChatGPTResponse(incomingMessage){
    const openaiApiKey = process.env.OPENAI_API_KEY;
    openai.openaiApiKey = openaiApiKey;

    const prompt = {
        model: 'text-davinci-002',
        prompt: incomingMessage,
        maxTokens: 100
    };
    
    try {
        const response = await openai.chat.completions.create(prompt);
        return response.data.choices[0].text;
    } catch (error) {
        throw new Error(error);
    }
    
}

module.exports = { createChatGPTResponse };