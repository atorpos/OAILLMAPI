const axios = require('axios');
class JokeCon {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async fetchJoke() {
        try {
            const response = await axios.get('https://api.api-ninjas.com/v1/jokes', {
                headers: {'X-API-Key': this.apiKey},
            });
            return response.data;
        } catch (error) {
            console.error('Error feching jokes:', error);
            throw error;
        }
    }
}

module.exports = JokeCon;