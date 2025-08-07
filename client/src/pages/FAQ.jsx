import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "What types of furniture do you sell?",
      answer: "We offer a wide range of high-quality furniture for every room, including the living room, bedroom, dining room, and home office. Our collection includes sofas, beds, tables, chairs, and storage solutions."
    },
    {
      question: "What is your shipping policy?",
      answer: "We offer free standard shipping on all orders over $50. For orders under $50, a flat rate of $5 applies. Expedited shipping options are also available at checkout. Most orders are processed within 1-2 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We have a 30-day return policy. If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund or exchange. Please ensure the item is in its original condition and packaging."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order has shipped, you will receive an email with a tracking number and a link to the carrier's website. You can use this information to track the status of your delivery."
    }
  ];

  return (
    <div className="mt-16 pb-16 px-4 md:px-8 max-w-4xl mx-auto font-serif">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Frequently Asked Questions</h1>
        <p className="text-gray-500 mt-2">Find answers to the most common questions below.</p>
      </div>
      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;