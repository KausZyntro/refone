"use client";
import { useState } from "react";
import "@/styles/FAQSection.css";

const faqs = [
  {
    question: "What is a refurbished iPhone?",
    answer:
      "A refurbished iPhone is a previously owned iPhone that has been professionally inspected, tested, repaired if necessary, and certified for resale. At Refone, every refurbished iPhone goes through a 52-point SUPER certification process — covering battery health, screen condition, camera quality, Face ID, IMEI status, and iCloud lock status. A Refone refurbished iPhone is not a used phone — it is a certified, warranted device that looks and performs like new."
  },
  {
    question: " What is the difference between a used iPhone and a refurbished iPhone?",
    answer:
      "A used iPhone is sold as-is, with no inspection, no warranty, and no guarantee of quality. A refurbished iPhone — especially one from Refone — has been professionally tested, certified, and backed by warranty. At Refone, our SUPER grade standard means zero visible scratches on the screen and body, battery health of 90% or higher, all cameras and sensors fully functional, iCloud unlocked, and a clean IMEI. That is the difference between a random second-hand phone and a certified refurbished iPhone from Refone."
  },
  {
    question: "What is a SUPER grade iPhone?",
    answer:
      "SUPER grade is the highest — and only — quality standard. A SUPER grade iPhone has a flawless screen with zero scratches and no dead pixels, a body with no dents or chips, battery health at 90% or above, fully working Face ID or Touch ID, all cameras functioning perfectly, iCloud completely unlocked, and a clean IMEI not linked to any theft or blacklist. Refone sells exclusively SUPER grade iPhones. We do not sell good-grade or fair-grade phones.."
  },
  {
    question: "Is it safe to buy a refurbished iPhone online in India?",
    answer:
      "Yes — when you buy from a certified seller like Refone. Every Refone iPhone comes with a clean IMEI verified against Apple's database, iCloud completely unlocked so you can set it up with your own Apple ID, a 12-month hardware warranty, and a 7-day return policy. We provide an unboxing video with every order so you can see the exact phone before you open the box. Buying a refurbished iPhone from Refone is as safe as buying a new one — with the added benefit of paying significantly less."
  },
  {
    question: "Are refurbished iPhones original?",
    answer:
      "Yes. Refone sells only genuine Apple iPhones. Every phone is verified using its IMEI number against Apple's global activation database. We do not sell clones, replicas, or phones with unauthorised parts. Every device in our store is an original Apple iPhone — the same hardware you would get in a sealed new box, at a fraction of the price."
  },
  {
    question: "Is a refurbished iPhone good or bad?",
    answer:
      "A refurbished iPhone from a certified seller like Refone is genuinely good — in fact, it is one of the smartest purchases you can make. You get the same Apple hardware and iOS experience as a new phone, with the same camera quality and software update support, at 30 to 50% less than the new retail price. The key is buying SUPER grade from a trusted, warranted seller. That is exactly what Refone provides."
  },
  {
    question: "What does 90% battery health mean on a refurbished iPhone?",
    answer:
      "Battery health percentage tells you how much of the original battery capacity remains. A new iPhone starts at 100%. At 90%, you still have 90% of the original full-day battery life — meaning you will comfortably get through a full day of normal use. Refone guarantees 90% or above battery health on every SUPER grade iPhone. Below 90%, a phone does not qualify for our SUPER standard and does not enter our store."
  },
  {
    question: "What is Refone's replacement policy?",
    answer:
      "Refone offers a 7-day replacement policy on all purchases. If your phone does not arrive in the described SUPER condition, or if you are not satisfied for any reason within 7 days of delivery, contact us, and we will arrange a replacement. We also provide an unboxing video with every order so you have video proof of the phone's condition at the time of dispatch."
  },{
    question: "How much cheaper is a refurbished iPhone compared to a new one?",
    answer:
      "On average, a SUPER grade refurbished iPhone from Refone is 30 to 50 % cheaper than a brand new model. For example, a new iPhone 15 retails at approximately ₹79,900. The same model in SUPER grade from Refone starts around ₹46,799 — a saving of nearly ₹30,000. For iPhone 14, the savings can be even higher. You get identical camera performance, the same iOS update support, and a 12-month warranty — at a significantly lower price."
  },
  {
    question: "Is buying a refurbished iPhone better than buying a new one?",
    answer:
      "For most buyers, yes. A SUPER grade refurbished iPhone from Refone gives you the same Apple experience — same camera, same performance, same software — at 30 to 50 % less. The only practical difference is that it comes in a Refone box instead of a sealed Apple box, and the battery health is 90%+ rather than 100%. In real-world daily use, this difference is negligible. The money you save can go toward accessories, iCloud storage, or your next upgrade."
  },
  {
    question: "What should I check before buying a refurbished iPhone?",
    answer:
      "The five things to always check: one — battery health (must be 90% or above), two — screen condition (zero scratches, no dead pixels), three — iCloud lock status (must be unlocked), four — IMEI status (must be clean, not blacklisted), five — seller warranty (must be at least 6 months, ideally 12). At Refone, all five of these are verified and guaranteed on every SUPER grade iPhone before it is listed for sale — so you do not have to worry about any of them."
  },
  {
    question: "Which website is best for buying refurbished iPhones in India?",
    answer:
      "Refone is India's most trusted certified refurbished iPhone store for buyers who want zero compromise on quality. Refone sells only SUPER grade iPhones — with 90%+ battery health, 52-point certification, 12-month warranty, 7-day returns, and free Pan India delivery. If you want a refurbished iPhone that genuinely looks and performs like new — backed by a real warranty — Refone is the right choice."
  },
  {
    question: "How do I buy a refurbished iPhone from Refone?",
    answer:
      ": Buying from Refone is simple. Browse the store at refone.co.in, select your preferred iPhone model, check the listed battery health and specifications, and place your order using UPI, card, net banking, or EMI. Your phone is dispatched the same day with an unboxing video, and delivered free across India in 7 to 10 business days. A 12-month warranty card is included in every package."
  },
  {
    question: "Does Refone provide cash on delivery?",
    answer:
      "Currently, Refone does not provide Cash on Delivery (COD) services. At the moment, we only accept prepaid orders to ensure a smooth and secure shopping experience. However, we are working on introducing COD services in the future for our customers."
  },
  {
    question: "Where does Refone deliver? Can I get a refurbished iPhone delivered to my city?",
    answer:
      "Refone delivers free across India — including Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Lucknow, Varanasi, Pune, Ahmedabad, Jaipur, and thousands of other cities and towns."
  },
   {
    question: " Which refurbished iPhone is best to buy in 2026?",
    answer:
      "The best refurbished iPhone depends on your budget and usage. For most everyday users, the iPhone 14 from Refone offers the best value — 4K Dolby Vision video, Action Mode stabilisation, autofocus front camera, and all-day battery, starting around ₹25,000 SUPER grade. If you want the best camera for content creation, the iPhone 15 is the top pick. For professional video and ProRes recording, the iPhone 14 Pro is exceptional. And for the most budget-friendly SUPER grade option, the iPhone 13 starts under ₹31,343."
  },


];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className="container">
      <h2 className="faq-title">Frequently Asked Questions</h2>

      <div className="faq-container">
        {visibleFaqs.map((faq, index) => (
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

      {faqs.length > 4 && (
        <div className="faq-view-more">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll ? "View Less" : "View More FAQs"}
          </button>
        </div>
      )}
    </section>
  );
};

export default FAQSection;