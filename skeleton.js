const exress = require('express'); 
const http = require('http'); 
const { Server } = require('socket.io'); 
const axios = require('axios'); 
const Sentiment = require('sentiment'); 

const app = express(); 
const server = http.createServer(app); 
const io = new Server(server); 
const sentiment = new Sentiment(); 

const cryptos = ['bitcoin', 'ethereum', 'dogecoin']

async function fetchPrices() {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptos.join(',')}&vs_currencies=usd`
        );
        return response.data; 
    } catch (err) {
        console.error('Price fetch error:', err.message); 
        return null;
    }
}

// Dummy sentiment fetch, needs to replace with real Twitter/Reddit API calls
async function fetchSentiment() {
    const sampleTexts = [
        'Bitcoin is soaring',
        'Ethereum is expensive!', 
        'Dogecoin dropping'
    ];
    const results = sampleTexts.map(text => ({
        text, 
        score: sentiment.analyze(text).score
    }));
    return results; 
}

io.on('connection', (socket) =>{
    console.log('Client connected');

    const intervalID = setInterval(async () => {
        const prices = await fetchPrices(); 
        const sentiments = await fetchSentiment(); 

        socket.emit('cryptoUpdate', {prices, sentiments}); 
    }, 15000); 

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clearInterval(intervalID); 
    });
});

server.listen(prototype, () => {
    console.log('Server running on port ${PORT}');
});