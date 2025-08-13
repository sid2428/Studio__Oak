import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/User.js";
import Order from "../models/Order.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateChatResponse = async (req, res) => {
    try {
        const { userId, prompt, history } = req.body;

        if (!prompt) {
            return res.json({ success: false, message: "A prompt is required." });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const geminiHistory = (history || []).map(msg => ({
            role: msg.isUser ? "user" : "model",
            parts: [{ text: msg.text }]
        }));

        if (geminiHistory.length > 0) {
            geminiHistory.pop();
        }

        // --- FIX STARTS HERE ---
        // The Gemini API requires the history to alternate between user and model, starting with user.
        // This loop removes any initial bot messages to ensure the history is valid.
        while (geminiHistory.length > 0 && geminiHistory[0].role !== 'user') {
            geminiHistory.shift(); // Removes the first element if it's from the model
        }
        // --- FIX ENDS HERE ---

        const user = await User.findById(userId);
        let systemInstruction = `
            You are a helpful and friendly customer support assistant for "Studio Oak," an online furniture store. 
            Your role is to answer questions strictly related to the company's products, services, orders, and shipping.

            **RULES:**
            1.  Stay On-Topic: ONLY answer questions about furniture, product details, materials, orders, shipping, returns, and store policies.
            2.  Decline Off-Topic Questions: If the user asks a question unrelated to Studio Oak, you MUST politely decline. Respond with: "I can only help with questions about Studio Oak furniture and orders. How can I assist you with that today?"
            3.  Use User Information: Use the user's name and order details below to provide personalized and helpful answers. Be conversational and friendly.
            4.  Be Concise: Keep your answers helpful but brief.
            ---
            **User's Information (for this turn):**
        `;

        if (user) {
            const recentOrders = await Order.find({ userId }).sort({ createdAt: -1 }).limit(2).populate('items.product');
            systemInstruction += `\n- User Name: ${user.name}`;
            if (recentOrders.length > 0) {
                systemInstruction += `\n- Recent Orders:`;
                recentOrders.forEach(order => {
                    systemInstruction += `\n  - Order #${order._id.toString().slice(-6)} (Status: ${order.status}):`;
                    order.items.forEach(item => {
                        if (item.product) {
                            systemInstruction += `\n    - ${item.quantity} x "${item.product.name}"`;
                        }
                    });
                });
            }
        } else {
            systemInstruction += "\n- The user is not logged in.";
        }
        
        const chat = model.startChat({
            history: geminiHistory,
        });

        const result = await chat.sendMessage(`${systemInstruction}\n---\n**User's Current Question:** "${prompt}"`);
        const response = result.response;
        const text = response.text();

        res.json({ success: true, response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.json({ success: false, message: "Sorry, I'm having trouble thinking right now. Please try again." });
    }
};