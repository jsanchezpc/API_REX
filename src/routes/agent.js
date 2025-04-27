"use strict";
require("dotenv").config();
const express = require("express");
const Auth = require("../middlewares/Auth");
const { default: ollama } = require('ollama');
// const User = require("../models/User");

const app = express();

app.use(express.json());

app.post("/agent/chat", Auth, async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({
                ok: false,
                message: "History is required and should be an array"
            });
        }

        try {
            const response = await ollama.chat({
                model: 'Super_AI_Agent',
                messages: history,
                format: "json",
                
            });

            let parsedContent;
            try {
                parsedContent = JSON.parse(response.message.content);
            } catch (e) {
                return res.status(500).json({
                    ok: false,
                    message: "Error parsing JSON from AI response",
                    error: e.message,
                });
            }

            console.log("Ollama response:", parsedContent);

            const newMessages = [
                { role: "user", content: history[history.length - 1].content },
                { role: "ai", content: parsedContent.response || "No response" }
            ];

            const updatedHistory = [...history, newMessages[1]]; 

            await User.findByIdAndUpdate(req.body.user._id, {
                $push: {
                    chatHistory: {
                        $each: newMessages
                    }
                }
            });

            return res.status(200).json({
                ok: true,
                history: updatedHistory,
                suggestions: parsedContent.suggestions || []
            });
        } catch (error) {
            console.error("Error in Ollama chat:", error);
            return res.status(500).json({
                ok: false,
                message: "Error processing your request",
                error: error.message
            });
        }
    } catch (error) {
        console.error("Error in chat endpoint:", error);
        return res.status(500).json({
            ok: false,
            message: "Error processing your request",
            error: error.message
        });
    }
});

module.exports = app;
