'use client';

import React, { useState } from 'react';
import Lottie from 'lottie-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { submitSupportRequest } from '@/redux/features/supportSlice';
import { toast } from 'react-toastify';
import '@/styles/ContactSection.css';

// Using a placeholder JSON for demonstration. 
// Replace next line with your actual Lottie JSON import.
// import contactAnimationData from './contact-animation.json'; 
import contactAnimationData from '../../../public/lottie/Email.json';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const ContactSection = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isSubmitting } = useSelector((state: RootState) => state.support);

  // Validation Logic
  const validate = (): boolean => {
    let newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
      isValid = false;
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.';
      isValid = false;
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Only allow numbers for the phone field
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Redux API call
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      };

      const response = await dispatch(submitSupportRequest(payload)).unwrap();
      
      setIsSuccess(true);
      // toast.success(response.message || "Support ticket submitted successfully");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      console.error('Error submitting form', error);
      toast.error(error || "An error occurred while submitting. Please try again.");
    } finally {
      // Optional: Hide success message after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  return (
    <section className="contact-section-container">
      {/* <h2 className="contact-section-title">Get in Touch</h2> */}
      
      <div className="contact-section-content">
        {/* Left Side: Lottie Animation */}
        <div className="lottie-container">
          <Lottie animationData={contactAnimationData} loop={true} className="lottieAnimation" />
          {/* <Lottie 
            animationData={contactAnimationData} 
            loop={true} 
            style={{ width: '100%', height: '100%', maxWidth: 450 }} 
          /> */}
        </div>

        {/* Right Side: Contact Form Card */}
        <div className="contact-form-card">
           <h2 className="exchangeFormTitle">Get in Touch</h2>
          <p className="exchangeFormSubtitle">Connect with us for support, queries, or feedback.</p>
          {isSuccess ? (
            <div className="success-message">
              Thank you! Your message has been sent successfully. We'll be in touch soon.
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="contact-form" noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name <span>*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span>*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject <span>*</span></label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="form-input"
                placeholder="How can we help you?"
                value={formData.subject}
                onChange={handleChange}
              />
              {errors.subject && <span className="error-message">{errors.subject}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message <span>*</span></label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
              />
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>

            <button 
              type="submit" 
              className="submit-button" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
