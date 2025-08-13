import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// --- SVG Icons ---
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
        <div className={`rounded-lg px-4 py-2 max-w-xs break-words ${isUser ? 'bg-primary text-white' : 'bg-gray-200 text-gray-800'}`}>
            {message}
        </div>
    </div>
);

const OptionButton = ({ text, onClick }) => (
    <button
        onClick={onClick}
        className="w-full text-left bg-white border border-primary text-primary hover:bg-primary/10 transition px-4 py-2 rounded-lg text-sm"
    >
        {text}
    </button>
);

// --- Main Chatbot Component ---
const Chatbot = () => {
    const { user, axios, isChatbotOpen, setIsChatbotOpen } = useAppContext();
    const [messages, setMessages] = useState([]);
    const [currentNode, setCurrentNode] = useState('start');
    const [isLoading, setIsLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [consecutiveFailures, setConsecutiveFailures] = useState(0);
    const chatEndRef = useRef(null);
    const chatbotRef = useRef(null);
    const chatButtonRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isChatbotOpen &&
                chatbotRef.current && !chatbotRef.current.contains(event.target) &&
                chatButtonRef.current && !chatButtonRef.current.contains(event.target)
            ) {
                setIsChatbotOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatbotOpen, setIsChatbotOpen]);

    const decisionTree = {
        'start': {
            question: 'Hi there! 👋 How can I help you today? You can choose an option below or ask me a question directly.',
            options: { 'My Order': 'order_issues', 'Shipping & Returns': 'shipping_returns_info', 'Product Information': 'product_info', 'Talk to an Agent': 'contact_agent' },
        },
        'order_issues': {
            question: 'Sure, I can help with that. What is your order-related question?',
            options: { 'Where is my order?': 'track_order_info', 'How to cancel my order?': 'cancel_order_info', 'Go back': 'start' }
        },
        'track_order_info': {
            answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website.",
            options: { 'I have another question': 'start' }
        },
        'cancel_order_info': {
            answer: "You can cancel your order within 24 hours of placing it. Go to 'My Orders' and select the cancel option. After 24 hours, please contact support.",
            options: { 'I have another question': 'start' }
        },
        'shipping_returns_info': {
            answer: "We offer free standard shipping on all orders over $50 and have a 30-day return policy.",
            options: { 'I have another question': 'start' }
        },
        'product_info': {
            answer: "You can find detailed information on each product's page. If you have a specific question, feel free to ask an agent!",
            options: { 'Talk to an Agent': 'contact_agent', 'Go back': 'start' }
        },
        'contact_agent': {
            answer: "No problem! I've notified our support team. An agent will get in touch with you via email shortly.",
            options: { 'Thanks!': 'end' },
            action: 'logSupportRequest'
        },
        'end': {
            answer: "You're welcome! Have a great day.",
            options: {}
        }
    };

    useEffect(() => {
        if (isChatbotOpen) resetChat();
    }, [isChatbotOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFreeformSubmit = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        if (!user) {
            toast.error("Please log in to chat with support.");
            return;
        }

        if (consecutiveFailures >= 2) {
            const userMessage = { text: inputValue, isUser: true };
            const escalationMessage = {
                text: "It seems I'm still having trouble. Would you like me to connect you with a support agent?",
                isUser: false,
                options: { 'Yes, talk to an agent': 'contact_agent' }
            };
            setMessages(prev => [...prev, userMessage, escalationMessage]);
            setInputValue('');
            setConsecutiveFailures(0);
            setCurrentNode('start'); 
            return; 
        }

        const userMessage = { text: inputValue, isUser: true };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/gemini/chat', { prompt: inputValue, history: newMessages });
            let aiMessage;
            if (data.success) {
                setConsecutiveFailures(0);
                aiMessage = { text: data.response, isUser: false, options: { 'Ask something else': 'start' } };
            } else {
                setConsecutiveFailures(prev => prev + 1);
                aiMessage = { text: data.message || "I couldn't process that.", isUser: false, options: { 'Try again': 'start' } };
                toast.error(data.message);
            }
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            setConsecutiveFailures(prev => prev + 1);
            const errorMessage = { text: "Sorry, I'm having trouble connecting. Please try again later.", isUser: false, options: { 'Go back to start': 'start' } };
            setMessages(prev => [...prev, errorMessage]);
            toast.error("Could not get a response from the AI assistant.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionClick = async (nextNodeKey) => {
        setConsecutiveFailures(0);
        if (!user) {
            toast.error("Please log in to chat with support.");
            setIsChatbotOpen(false);
            return;
        }

        const selectedOptionText = Object.keys(decisionTree[currentNode].options).find(key => decisionTree[currentNode].options[key] === nextNodeKey);
        
        if (selectedOptionText) {
            setMessages(prev => [...prev, { text: selectedOptionText, isUser: true }]);
        }

        const nextNode = decisionTree[nextNodeKey];

        if (nextNode.action === 'logSupportRequest') {
            try {
                const { data } = await axios.post('/api/support/request');
                if (data.success) toast.success("Your request has been sent to the support team!");
                else toast.error(data.message);
            } catch (error) {
                toast.error("Could not submit support request.");
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
        setConsecutiveFailures(0);
        const startingNode = decisionTree['start'];
        setMessages([{ text: startingNode.question, isUser: false, options: startingNode.options }]);
    };

    return (
        <>
            <button
                ref={chatButtonRef}
                onClick={() => setIsChatbotOpen(!isChatbotOpen)}
                // --- THIS IS THE FIX ---
                className="fixed bottom-6 right-6 bg-primary text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center z-40 transition-transform transform hover:scale-110 animate-pulse-slow"
                aria-label="Toggle chat"
            >
                {isChatbotOpen ? <CloseIcon /> : <ChatIcon />}
            </button>
            
            <div
                ref={chatbotRef}
                // --- THIS IS THE FIX ---
                className={`fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-xl shadow-2xl flex flex-col z-40 transition-all duration-300 ease-in-out ${isChatbotOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
            >
                <div className="bg-primary p-4 text-white rounded-t-xl flex justify-between items-center">
                    <h3 className="font-bold text-lg">Studio Oak Support</h3>
                    <button onClick={resetChat} className="font-bold text-lg transition-transform transform hover:rotate-180" aria-label="Reset chat">&#x21bb;</button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto no-scrollbar">
                    {messages.map((msg, index) => (<div key={index}><ChatBubble message={msg.text} isUser={msg.isUser} /></div>))}
                    {isLoading && <ChatBubble message="..." isUser={false} />}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    {messages.length > 0 && messages[messages.length - 1]?.options && Object.keys(messages[messages.length - 1].options).length > 0 ? (
                        <>
                            <div className="space-y-2">
                                {Object.entries(messages[messages.length - 1].options).map(([text, nextNodeKey]) => (<OptionButton key={nextNodeKey} text={text} onClick={() => handleOptionClick(nextNodeKey)} />))}
                            </div>
                            {currentNode === 'start' && (
                                <>
                                    <div className="relative my-3">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
                                        <div className="relative flex justify-center text-sm"><span className="bg-gray-50 px-2 text-gray-500">OR</span></div>
                                    </div>
                                    <form onSubmit={handleFreeformSubmit}>
                                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask a question..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                                    </form>
                                </>
                            )}
                        </>
                    ) : (
                        <form onSubmit={handleFreeformSubmit}>
                            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask another question..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" disabled={isLoading} />
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chatbot;