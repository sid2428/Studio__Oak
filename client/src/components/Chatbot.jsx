import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext'; // Import AppContext
import toast from 'react-hot-toast'; // Import toast for notifications

// --- SVG Icons for a more polished look ---
const ChatIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);


// --- Helper Components ---
const ChatBubble = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`rounded-lg px-4 py-2 max-w-xs ${isUser ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
            {message}
        </div>
    </div>
);

const OptionButton = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left bg-white border border-primary text-primary hover:bg-primary/10 transition px-4 py-2 rounded-lg mb-2 text-sm"
    >
        {text}
    </button>
);


// --- Main Chatbot Component ---
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentNode, setCurrentNode] = useState('start');
    const chatEndRef = useRef(null);
    const { user, axios } = useAppContext(); // Get user and axios from context

    // --- Decision Tree Definition ---
    const decisionTree = {
        'start': {
            question: 'Hi there! 👋 How can I help you today?',
            options: {
                'My Order': 'order_issues',
                'Shipping & Returns': 'shipping_returns_info',
                'Product Information': 'product_info',
                'Talk to an Agent': 'contact_agent',
            },
        },
        'order_issues': {
            question: 'Sure, I can help with that. What is your order-related question?',
            options: {
                'Where is my order?': 'track_order_info',
                'How to cancel my order?': 'cancel_order_info',
                'Go back': 'start',
            }
        },
        'track_order_info': {
            answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this to track your delivery.",
            options: { 'I have another question': 'start' }
        },
        'cancel_order_info': {
            answer: "You can cancel your order within 24 hours of placing it. Please go to 'My Orders' and select the cancel option. If it's been more than 24 hours, please contact our support team.",
            options: { 'I have another question': 'start' }
        },
        'shipping_returns_info': {
            answer: "We offer free standard shipping on all orders over $50. We also have a 30-day return policy. If you're not satisfied, you can return it within 30 days for a full refund.",
            options: { 'I have another question': 'start' }
        },
        'product_info': {
            answer: "You can find detailed information, including materials and dimensions, on each product's page. If you have a specific question, feel free to ask an agent!",
            options: { 'Talk to an Agent': 'contact_agent', 'Go back': 'start' }
        },
        'contact_agent': {
            answer: "No problem! I've notified our support team. An agent will get in touch with you via email shortly. Please have your order number ready if you have one.",
            options: { 'Thanks!': 'end' },
            action: 'logSupportRequest' // Add an action to log the request
        },
        'end': {
            answer: "You're welcome! Have a great day.",
            options: {}
        }
    };

    // --- Chat Logic ---
    useEffect(() => {
        if (isOpen) {
            resetChat();
        }
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleOptionClick = async (nextNodeKey) => {
        console.log("Current user state:", user); // **DEBUG LOG**
        if (!user) {
            toast.error("Please log in to chat with support.");
            setIsOpen(false);
            return;
        }

        const selectedOptionText = Object.keys(decisionTree[currentNode].options).find(key => decisionTree[currentNode].options[key] === nextNodeKey);
        
        if (selectedOptionText) {
            setMessages(prev => [...prev, { text: selectedOptionText, isUser: true }]);
        }

        const nextNode = decisionTree[nextNodeKey];

        if (nextNode.action === 'logSupportRequest') {
            try {
                console.log("Sending support request to backend..."); // **DEBUG LOG**
                const { data } = await axios.post('/api/support/request');
                if (data.success) {
                    toast.success("Your request has been sent to the support team!");
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error("Could not submit support request.");
                console.error("Support request API error:", error); // **DEBUG LOG**
            }
        }

        setTimeout(() => {
            if (nextNode.question) {
                setMessages(prev => [...prev, { text: nextNode.question, isUser: false, options: nextNode.options }]);
            } else if (nextNode.answer) {
                setMessages(prev => [...prev, { text: nextNode.answer, isUser: false, options: nextNode.options }]);
            }
        }, 500);

        setCurrentNode(nextNodeKey);
    };

    const resetChat = () => {
        setCurrentNode('start');
        const startingNode = decisionTree['start'];
        setMessages([{ text: startingNode.question, isUser: false, options: startingNode.options }]);
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-50 transition-transform transform hover:scale-110 animate-pulse-slow"
                aria-label="Toggle chat"
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </button>

            <div className={`fixed bottom-24 right-6 w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col z-50 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <div className="bg-primary p-4 text-white rounded-t-xl flex justify-between items-center">
                    <h3 className="font-bold text-lg">Studio Oak Support</h3>
                    <button onClick={resetChat} className="font-bold text-lg transition-transform transform hover:rotate-180" aria-label="Reset chat">&#x21bb;</button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <ChatBubble message={msg.text} isUser={msg.isUser} />
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {messages.length > 0 && messages[messages.length - 1]?.options && Object.entries(messages[messages.length - 1].options).map(([text, nextNodeKey]) => (
                        <OptionButton key={nextNodeKey} text={text} onClick={() => handleOptionClick(nextNodeKey)} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Chatbot;
