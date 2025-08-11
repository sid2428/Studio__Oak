import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

// --- Accordion Item Component ---
const AccordionItem = ({ faq, index, isOpen, setIsOpen }) => {
    const { question, answer } = faq;
    const currentlyOpen = isOpen === index;

    const toggleAccordion = () => {
        setIsOpen(currentlyOpen ? null : index);
    };

    return (
        <div className="border-b border-gray-200 py-4">
            <button
                onClick={toggleAccordion}
                className="w-full flex justify-between items-center text-left text-lg font-semibold text-gray-800 focus:outline-none"
            >
                <span>{question}</span>
                <span className={`transform transition-transform duration-300 ${currentlyOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${currentlyOpen ? 'max-h-screen mt-2' : 'max-h-0'}`}
            >
                <p className="text-gray-600 pt-2">{answer}</p>
            </div>
        </div>
    );
};

// --- Main FAQ Page Component ---
const FAQ = () => {
    const [isOpen, setIsOpen] = useState(null);
    const { setIsChatbotOpen } = useAppContext();

    const faqs = [
        {
            question: "What types of furniture do you sell?",
            answer: "We offer a wide range of high-quality furniture for every room, including the living room, bedroom, dining room, and home office. Our collection includes sofas, beds, tables, chairs, and storage solutions, all designed with a blend of modern style and timeless comfort."
        },
        {
            question: "What is your shipping policy?",
            answer: "We offer free standard shipping on all orders over $50. For orders under $50, a flat rate of $5 applies. Expedited shipping options are also available at checkout. Most orders are processed within 1-2 business days, and you'll receive a tracking number as soon as your order ships."
        },
        {
            question: "What is your return policy?",
            answer: "We have a 30-day return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Please ensure the item is in its original condition and packaging. To initiate a return, please visit the 'My Orders' page or contact our support team."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this information to track the status of your delivery. You can also find your tracking information in the 'My Orders' section of your account."
        },
        {
            question: "Do you offer assembly services?",
            answer: "Yes, we offer professional assembly services for an additional fee. You can select this option at checkout. All of our furniture also comes with clear instructions for hassle-free self-assembly."
        },
        {
            question: "What materials do you use?",
            answer: "We are committed to using high-quality, sustainable materials. Our products feature responsibly sourced wood, eco-friendly fabrics, and durable metals to ensure longevity and minimize our environmental impact."
        }
    ];

    return (
        <div className="mt-16 pb-16 px-4 md:px-8 max-w-4xl mx-auto font-serif">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Frequently Asked Questions
                </h1>
                <p className="text-gray-500 mt-2">Find answers to the most common questions below.</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        faq={faq}
                        index={index}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    />
                ))}
            </div>

            <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-800">Can't find your answer?</h2>
                <p className="text-gray-600 mt-2">
                    Our customer support team is here to help. You can chat with us for a quick response.
                </p>
                <button
                    onClick={() => setIsChatbotOpen(true)}
                    className="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                    Chat With Us
                </button>
            </div>
        </div>
    );
};

export default FAQ;