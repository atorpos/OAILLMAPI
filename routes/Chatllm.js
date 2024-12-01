const axios = require('axios');

class Chatllm {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getChatllm(prompt) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o-mini',
                messages: [{
                    role: "user", content: prompt
                }],
            }, {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}`,},});
            return response.data.choices[0].message;

        } catch (error) {
            console.error(error);
            throw error;
        }


    }
}
module.exports = Chatllm;
