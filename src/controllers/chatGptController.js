const { createChatGPTResponse } = require('../services/chatGPT');
const fs = require('fs');
const levenshtein = require('js-levenshtein');

module.exports = {
    async chatGPT(req, res) {
        const incomingMessage = req.body.message;
        const answerFromTXT = getAnswersFromTXT(incomingMessage);
        try {
            if (answerFromTXT.length > 0) {
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: answerFromTXT.join(' ')
                });
            } else {
                const chatGPTResponse = await createChatGPTResponse(incomingMessage);
                res.status(200).json({
                    code: 200,
                    status: "success",
                    message: chatGPTResponse
                });
            }
        } catch (error) {
            res.status(500).json({
                code: 500,
                status: "error",
                message: error.message
            });
        }
    }
};

// Function to calculate similarity between two strings using Levenshtein distance
function calculateSimilarity(input, target) {
    const distance = levenshtein(input.toLowerCase(), target.toLowerCase());
    const maxLength = Math.max(input.length, target.length);
    const similarityPercentage = ((maxLength - distance) / maxLength) * 100;
    return similarityPercentage;
}

function getAnswersFromTXT(question) {
    // console.log("Input question:", question);
    const fileContent = fs.readFileSync('./data/qa.txt', 'utf-8');
    const lines = fileContent.split('\n');
    const matchingAnswers = [];

    const threshold = 60; // Set the threshold for similarity percentage

    for (const line of lines) {
        const [fileQuestion, answer] = line.split(':');
        // console.log("File question:", fileQuestion);
        const similarity = calculateSimilarity(question, fileQuestion);
        // console.log("Similarity:", similarity);
        // Check if the similarity is above the threshold
        if (similarity >= threshold) {
            matchingAnswers.push(answer.trim());
        }
    }

    return matchingAnswers;
}