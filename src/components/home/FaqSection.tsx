"use client";
import { useState } from "react";
import "@/styles/FAQSection.css";

const faqs = [
  {
    question: "Are your products original?",
    answer:
      "Yes, all our products are 100% original and sourced directly from trusted suppliers."
  },
  {
    question: "Do you offer warranty?",
    answer:
      "Yes, we provide up to 6 months warranty depending on the product."
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return the product within 7 days if there is any manufacturing defect."
  },
  {
    question: "How long does delivery take?",
    answer:
      "Delivery usually takes 3-5 working days depending on your location."
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? "active" : ""}`}
          >
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div className="faq-answer">
              {faq.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
