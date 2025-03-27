const axios = require('axios');

class GptVisual {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getVisual(prompt) {
        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [{
                    role: "user",
                    content: [
                        {
                            "type": "text",
                            // "text": "Please analyst and describe the image, if there is a person in the image, please identify who he or she is or if you can't please analyst is there is EXIF info and describe it or if it is a question in the image, please answer the question",
                            "text": "Create a Studio Ghibli Version of this image"
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": prompt
                            },
                        },
                    ],
                }],
                max_tokens: 4000,
            }, {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${this.apiKey}`,},});
            return response.data.choices[0].message;
        } catch (e) {
            console.error(e);
            throw e;
        }
    };
}

module.exports = GptVisual;