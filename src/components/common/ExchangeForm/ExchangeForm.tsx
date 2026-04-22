"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { submitExchangeRequest } from '@/redux/features/exchangeSlice';
import { toast } from 'react-toastify';
import './ExchangeForm.css';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import inventoryData from '../../../../public/lottie/Inventory.json';

interface FormData {
  name: string;
  phone: string;
  email: string;
  brand: string;
  model: string;
  variant: string;
  color: string;
  purchaseYear: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function ExchangeForm() {
  const currentYear = new Date().getFullYear();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    brand: '',
    model: '',
    variant: '',
    color: '',
    purchaseYear: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isSubmitting } = useSelector((state: RootState) => state.exchange);

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Name is required' : '';
      case 'phone':
        if (!value) return 'Phone is required';
        if (!/^\d{10}$/.test(value)) return 'Phone must be exactly 10 digits';
        return '';
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email address';
        return '';
      case 'brand':
        return value.trim() === '' ? 'Brand is required' : '';
      case 'model':
        return value.trim() === '' ? 'Model is required' : '';
      case 'variant':
        return value.trim() === '' ? 'Variant is required' : '';
      case 'color':
        return value.trim() === '' ? 'Color is required' : '';
      case 'purchaseYear':
        if (!value) return 'Purchase year is required';
        const year = parseInt(value, 10);
        if (isNaN(year) || year < 2000 || year > currentYear) {
          return `Year must be between 2000 and ${currentYear}`;
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '');
      if (numericValue.length > 10) return;
      
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      const errorMsg = validateField(name, numericValue);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    }

    if (isSuccess) setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate all fields on submit
    (Object.keys(formData) as Array<keyof FormData>).forEach((key) => {
      const errorMsg = validateField(key, formData[key] as string);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      try {
        const payload = {
          full_name: formData.name,
          phone: formData.phone,
          email: formData.email,
          brand: formData.brand,
          model: formData.model,
          variant: formData.variant,
          color: formData.color,
          purchase_year: Number(formData.purchaseYear)
        };

        const response = await dispatch(submitExchangeRequest(payload)).unwrap();
        
        setIsSuccess(true);
        // toast.success(response.message || "Exchange request submitted successfully");
        setFormData({
          name: '', phone: '', email: '', brand: '', model: '',
          variant: '', color: '', purchaseYear: ''
        });
      } catch (error: any) {
        console.error("Exchange submission error:", error);
        toast.error(error || "An error occurred while submitting. Please try again.");
      }
    }
  };

  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="exchangeWrapper">
      <div className="lottieSection">
        <Lottie animationData={inventoryData} loop={true} className="lottieAnimation" />
      </div>
      
      <div className="exchangeFormContainer">
        <h2 className="exchangeFormTitle">Exchange Your Device</h2>
        <p className="exchangeFormSubtitle">Get an instant quote for your old device</p>
        
        <form onSubmit={handleSubmit} className="exchangeForm" noValidate>
        {/* Contact Info */}
        <div className="formGroup">
          <label htmlFor="name" className="label">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. John Doe"
          />
          {errors.name && <span className="errorText">{errors.name}</span>}
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="phone" className="label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`input ${errors.phone ? 'error' : ''}`}
              placeholder="e.g. 9876543210"
            />
            {errors.phone && <span className="errorText">{errors.phone}</span>}
          </div>

          <div className="formGroup">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'error' : ''}`}
              placeholder="e.g. john@example.com"
            />
            {errors.email && <span className="errorText">{errors.email}</span>}
          </div>
        </div>

        {/* Device Info */}
        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="brand" className="label">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className={`input ${errors.brand ? 'error' : ''}`}
              placeholder="e.g. Apple, Samsung"
            />
            {errors.brand && <span className="errorText">{errors.brand}</span>}
          </div>

          <div className="formGroup">
            <label htmlFor="model" className="label">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className={`input ${errors.model ? 'error' : ''}`}
              placeholder="e.g. iPhone 14 Pro"
            />
            {errors.model && <span className="errorText">{errors.model}</span>}
          </div>
        </div>

        <div className="formRow">
          <div className="formGroup">
            <label htmlFor="variant" className="label">Variant / Storage</label>
            <input
              type="text"
              id="variant"
              name="variant"
              value={formData.variant}
              onChange={handleChange}
              className={`input ${errors.variant ? 'error' : ''}`}
              placeholder="e.g. 256GB WiFi"
            />
            {errors.variant && <span className="errorText">{errors.variant}</span>}
          </div>

          <div className="formGroup">
            <label htmlFor="color" className="label">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className={`input ${errors.color ? 'error' : ''}`}
              placeholder="e.g. Space Black"
            />
            {errors.color && <span className="errorText">{errors.color}</span>}
          </div>
        </div>

        <div className="formGroup">
          <label htmlFor="purchaseYear" className="label">Purchase Year</label>
          <select
            id="purchaseYear"
            name="purchaseYear"
            value={formData.purchaseYear}
            onChange={handleChange}
            className={`select ${errors.purchaseYear ? 'error' : ''}`}
          >
            <option value="">Select year</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {errors.purchaseYear && <span className="errorText">{errors.purchaseYear}</span>}
        </div>

        <button type="submit" className="submitBtn" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {isSuccess && (
          <div className="successMessage">
            Thank you! Your device details have been submitted successfully.
          </div>
        )}
      </form>
      </div>
    </div>
  );
}
