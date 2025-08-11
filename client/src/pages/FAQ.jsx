import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

// --- SVG Icons for Categories and Accordion ---
const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);
const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
);
const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
);
const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
);


// --- Accordion Item Component (Slightly Restyled) ---
const AccordionItem = ({ faq, index, isOpen, setIsOpen }) => {
    const { question, answer } = faq;
    const currentlyOpen = isOpen === index;

    const toggleAccordion = () => {
        setIsOpen(currentlyOpen ? null : index);
    };

    return (
        <div className="border-b border-stone-200">
            <button
                onClick={toggleAccordion}
                className="w-full flex justify-between items-center text-left py-5 text-stone-800 focus:outline-none"
            >
                <span className="font-semibold text-lg">{question}</span>
                <span className="text-primary flex-shrink-0 ml-4">
                    {currentlyOpen ? <MinusIcon /> : <PlusIcon />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${currentlyOpen ? 'max-h-screen pb-5' : 'max-h-0'}`}
            >
                <p className="text-stone-600 pr-8">{answer}</p>
            </div>
        </div>
    );
};


// --- Main FAQ Page Component ---
const FAQ = () => {
    const [isOpen, setIsOpen] = useState(0); // Default to first item open
    const { setIsChatbotOpen } = useAppContext();
    
    const faqCategories = [
        {
            name: "General",
            icon: <InfoIcon />,
            questions: [
                {
                    question: "What types of furniture do you sell?",
                    answer: "We offer a wide range of high-quality furniture for every room, including the living room, bedroom, dining room, and home office. Our collection includes sofas, beds, tables, chairs, and storage solutions, all designed with a blend of modern style and timeless comfort."
                },
                {
                    question: "Do you have physical stores or showrooms?",
                    answer: "Currently, Studio Oak is an online-only retailer. This allows us to offer premium furniture at more accessible prices by cutting out the overhead of physical locations. You can view our full collection with detailed images and descriptions on our website."
                },
                {
                    question: "How do I care for my furniture?",
                    answer: "Each product comes with specific care instructions. Generally, we recommend dusting regularly with a soft, dry cloth. For spills, blot immediately and use a mild, water-based cleaner. Avoid direct sunlight and harsh chemicals to preserve the finish."
                },
                {
                    question: "What is your commitment to sustainability?",
                    answer: "Sustainability is at the core of our brand. We prioritize responsibly sourced woods, recycled metals, and eco-friendly fabrics. Our manufacturing process is designed to minimize waste, and we are constantly seeking innovative ways to reduce our environmental impact."
                },
                {
                    question: "Do you offer custom furniture designs?",
                    answer: "Yes, we offer a custom design service for select furniture pieces. You can choose your preferred size, material, and finish to create a piece that perfectly matches your space and style."
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit and debit cards, net banking, UPI, and popular digital wallets. For large orders, we also provide flexible EMI options."
                },
                {
                    question: "Do you offer free delivery?",
                    answer: "We offer free standard delivery on all orders above a certain value. Delivery charges, if applicable, will be clearly displayed at checkout before you confirm your purchase."
                },
                {
                    question: "Can I see fabric and material samples before ordering?",
                    answer: "Yes, we can send you small swatches of upholstery fabrics or wood finish samples so you can see and feel the quality before making a purchase."
                },
                {
                    question: "What if my furniture arrives damaged?",
                    answer: "We take great care in packaging and delivery. However, if your furniture arrives damaged, please contact our customer support within 48 hours with photos, and we will arrange for a replacement or repair at no extra cost."
                }
            ]
        },
        {
            name: "Products & Materials",
            icon: <BoxIcon />,
            questions: [
                {
                    question: "What materials do you use?",
                    answer: "We are committed to using high-quality, sustainable materials. Our products feature responsibly sourced wood, eco-friendly fabrics, and durable metals to ensure longevity and minimize our environmental impact."
                },
                {
                    question: "Can I order fabric swatches?",
                    answer: "Yes! We understand the importance of seeing colors and textures in person. You can order fabric swatches for many of our upholstered items directly from the product page. Swatches are typically delivered within 5-7 business days."
                },
                {
                    question: "Is assembly required for your furniture?",
                    answer: "Some of our furniture requires minimal assembly to ensure safe shipping. All necessary tools and clear, step-by-step instructions are included. We also offer professional assembly services for an additional fee, which you can select at checkout."
                },
                {
                    question: "Do your products come with a warranty?",
                    answer: "Yes, all Studio Oak products come with a one-year manufacturer's warranty covering defects in materials and workmanship. For more details, please visit our warranty information page."
                },
                {
                    question: "What should I do if a product is out of stock?",
                    answer: "If a product you're interested in is out of stock, you can sign up on the product page to be notified via email as soon as it becomes available again. We do our best to restock popular items quickly."
                },
            ]
        },
        {
            name: "Ordering",
            icon: <InfoIcon />,
            questions: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept all major credit cards (Visa, MasterCard, American Express), as well as PayPal and other secure online payment options. We also offer a Cash on Delivery (COD) option for your convenience."
                },
                {
                    question: "Can I modify or cancel my order after placing it?",
                    answer: "You can cancel your order free of charge within 24 hours of placing it. To modify an order, please contact our support team as soon as possible. While we'll do our best to accommodate, changes may not be possible once an order has been processed for shipping."
                },
                {
                    question: "Do you offer financing or payment plans?",
                    answer: "We are working on providing flexible financing options in the near future. Please check back for updates or subscribe to our newsletter to be notified when this service becomes available."
                },
                {
                    question: "How do I use a promo code?",
                    answer: "You can apply your promo code during the checkout process. Simply enter the code into the designated field, and the discount will be applied to your order total."
                },
            ]
        },
        {
            name: "Shipping & Returns",
            icon: <TruckIcon />,
            questions: [
                {
                    question: "What is your shipping policy?",
                    answer: "We offer free standard shipping on all orders over $50. For orders under $50, a flat rate of $5 applies. Expedited shipping options are also available at checkout. Most orders are processed within 1-2 business days, and you'll receive a tracking number as soon as your order ships."
                },
                 {
                    question: "What is your return policy?",
                    answer: "We have a 30-day return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Please ensure the item is in its original condition and packaging. To initiate a return, please visit the 'My Orders' page or contact our support team."
                },
                {
                    question: "What if my item arrives damaged?",
                    answer: "We take great care in packaging our products, but in the rare event that an item arrives damaged, please contact us within 48 hours of delivery. Include photos of the damage and the packaging. We will arrange for a replacement or a full refund at no extra cost to you."
                },
                {
                    question: "How long does delivery take?",
                    answer: "Standard shipping typically takes 5-7 business days, while expedited shipping takes 2-3 business days. Please note that delivery times may vary based on your location and carrier availability."
                },
            ]
        },
        {
            name: "Account & Security",
            icon: <ShieldIcon />,
            questions: [
                {
                    question: "Is my personal information secure?",
                    answer: "Absolutely. We use industry-standard SSL encryption to protect your details. Your payment information is processed securely by our payment partners, and we never store your credit card details on our servers."
                },
                {
                    question: "Do I need an account to place an order?",
                    answer: "While you can check out as a guest, creating an account allows you to track your orders, view your order history, and manage your shipping addresses for a faster checkout experience in the future."
                },
                {
                    question: "How do I reset my password?",
                    answer: "If you've forgotten your password, you can click the 'Forgot Password' link on the login page. We'll send you an email with instructions on how to reset it."
                },
                {
                    question: "How can I view my order history?",
                    answer: "You can view your complete order history by logging into your account and navigating to the 'My Orders' section. Here, you'll find details of all your past and current orders."
                },
            ]
        }
    ];

    const [activeCategory, setActiveCategory] = useState(faqCategories[0].name);

    return (
        <div className="mt-16 pb-16 max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Help Center
                </h1>
                <p className="text-gray-500 mt-3 text-lg">Find answers to the most common questions below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
                
                {/* Left Column: Navigation */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-stone-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Categories</h2>
                    <ul className="space-y-2 mb-8">
                        {faqCategories.map(category => (
                            <li key={category.name}>
                                <button 
                                    onClick={() => {
                                        setActiveCategory(category.name)
                                        setIsOpen(0); // Reset accordion to open the first item of the new category
                                    }}
                                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-md font-semibold ${activeCategory === category.name ? 'bg-primary text-white shadow-md' : 'text-stone-600 hover:bg-stone-100'}`}
                                >
                                    {category.icon}
                                    {category.name}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="p-6 bg-surface rounded-lg text-center">
                        <h3 className="text-lg font-bold text-stone-800">Can't find your answer?</h3>
                        <p className="text-stone-600 mt-2 text-sm">
                            Our customer support team is here to help. Chat with us for a quick response.
                        </p>
                        <button
                            onClick={() => setIsChatbotOpen(true)}
                            className="mt-4 w-full px-4 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                        >
                            Chat With Us
                        </button>
                    </div>
                </div>

                {/* Right Column: Accordions */}
                <div className="lg:col-span-3">
                    {faqCategories.find(c => c.name === activeCategory)?.questions.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            faq={faq}
                            index={index}
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;