const axios = require('axios');
const API_URL = "https://api-auth.refones.com/api";

async function test() {
    try {
        const loginRes = await axios.post(`${API_URL}/login`, { email: 'test@example.com', password: 'password' });
        console.log("Login OK");
    } catch (e) {
        console.log("Login failed");
    }
}
test();
