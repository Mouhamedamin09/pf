const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const apiKey = "AIzaSyA5F613bC2cUfMjCNxUVJIcPTszoil3q64";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

let locationData = null;
let userData = null;

async function generateDailyPlan(city, tempCelsius, startTime, endTime, budget, type) {
    const chatSession = model.startChat({
        generationConfig,
        safetySettings,
        history: [],
    });

    const result = await chatSession.sendMessage(`Generate a detailed daily plan based on the following inputs:
    Location: ${city}
    Weather: ${tempCelsius.toFixed(1)}°C
    Budget: ${budget} dollars
    Time range: from ${startTime} to ${endTime}
    Preferences: ${type}
    The plan should include activities, places to visit, and meal suggestions. Make sure to spread the activities throughout the day and provide approximate time slots. The output must strictly follow this format without any deviations:
    "8:00 AM - 9:00 AM": {
        "time": "1:30 PM - 3:00 PM",
        "titleActivity": "Explore the Djerba Explore Park",
        "description": "Immerse yourself in the beauty of Djerba's diverse landscape at the Djerba Explore Park. This unique attraction features a variety of activities, including camel rides, quad biking, and a chance to encounter exotic animals. It's an exciting way to experience the island's natural beauty.",
        "cost": "$20"
     },
    9:30 AM - 11:00 AM: time titleActivity description cost
    11:30 AM - 1:00 PM: time titleActivity description cost
    1:30 PM - 2:30 PM: time titleActivity description cost
    3:00 PM - 5:00 PM: time titleActivity description cost
    5:30 PM - 7:00 PM: time titleActivity description cost
    7:30 PM - 9:00 PM: time titleActivity description cost
    ALERT: "This output will go in code so we need strict output. The output is in JSON format and the activity description is 3 lines long."
    `);

    const planString = result.response.text();
    return parsePlan(planString);
}

function parsePlan(plan) {
    const cleanedOutput = plan.replace(/```json/g, '').replace(/```/g, '');
    try {
        const jsonObject = JSON.parse(cleanedOutput);
        return jsonObject;
    } catch (error) {
        console.error("Invalid JSON input:", error.message);
        return null;
    }
}

app.post('/receive-location', async (req, res) => {
    locationData = req.body;

    try {
        const geoResponse = await axios.get(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${locationData.coords.latitude}&longitude=${locationData.coords.longitude}&localityLanguage=en`);
        const city = geoResponse.data.city;
        console.log('City:', city);

        const APIkey = "638bdc506f552e2390c7caa3153d36c9";
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`);
        const tempFahrenheit = weatherResponse.data.main.temp;
        const tempCelsius = (tempFahrenheit - 32) * 5 / 9;
        console.log('Weather in Fahrenheit:', tempFahrenheit);
        console.log('Weather in Celsius:', tempCelsius);

        locationData.city = city;
        locationData.tempCelsius = tempCelsius;
        
        if (userData) {
            const plan = await generateDailyPlan(city, tempCelsius, userData.startTime, userData.endTime, userData.budget, userData.type);
            console.log(plan)
            res.json({ city, tempCelsius: tempCelsius, plan });
        } else {
            res.json({ message: 'Location data received. Waiting for user data.' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error in processing the request' });
    }
});

app.post('/data', async (req, res) => {
    userData = req.body;
    console.log('User Data:', userData);

    if (locationData) {
        const { city, tempCelsius } = locationData;
        const { startTime, endTime, budget, type } = userData;

        try {
            const plan = await generateDailyPlan(city, tempCelsius, startTime, endTime, budget, type);
            res.json({ city, tempCelsius, plan });
            console.log(plan)
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Error in generating the plan' });
        }
    } else {
        res.json({ message: 'User data received. Waiting for location data.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
