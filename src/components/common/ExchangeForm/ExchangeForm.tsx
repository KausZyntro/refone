"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { submitExchangeRequest } from '@/redux/features/exchangeSlice';
import { toast } from 'react-toastify';
import './ExchangeForm.css';
import { exchangeQuestionsSchema, StepSchema } from './ExchangeQuestions';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Icons (SVG strings or React components) can be extracted later, using placeholders for now
const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M11 18H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const PowerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2V12M18.36 6.64C19.61 7.89 20.31 9.58 20.31 11.35C20.31 13.12 19.61 14.81 18.36 16.06C17.11 17.31 15.42 18.01 13.65 18.01C11.88 18.01 10.19 17.31 8.94 16.06C7.69 14.81 6.99 13.12 6.99 11.35C6.99 9.58 7.69 7.89 8.94 6.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22S4 18 4 9V5L12 2L20 5V9C20 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface Answers {
  [questionId: number]: string;
}

export default function ExchangeForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isSubmitting } = useSelector((state: RootState) => state.exchange);

  const totalSteps = 5; // 1: Condition, 2-4: Additional, 5: Review & Offer

  const handleOptionSelect = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    // Basic validation: check if all questions in the current step are answered
    const currentSchema = exchangeQuestionsSchema.find(s => s.step === currentStep);
    if (currentSchema) {
      let allAnswered = true;
      for (const category of currentSchema.categories) {
        for (const question of category.questions) {
          if (!answers[question.id]) {
            allAnswered = false;
            break;
          }
        }
      }
      // if (!allAnswered) {
      //   toast.error('Please answer all questions before proceeding.');
      //   return;
      // }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      submitForm();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitForm = async () => {
    // In a real scenario, map these answers to the backend payload structure
    try {
      console.log('Final Answers Payload:', answers);
      // const response = await dispatch(submitExchangeRequest(payload)).unwrap();
      toast.success("Device evaluated successfully! Generating offer...");
      // Handle navigation or show success state
    } catch (error: any) {
      console.error("Exchange submission error:", error);
      toast.error(error || "An error occurred while submitting. Please try again.");
    }
  };

  const renderStepIndicator = () => (
    <div className="stepIndicator">
      <div className={`stepItem ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 1 ? '✓' : '1'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Device Condition</span>
          <span className="stepSubtitle">Answer a few questions</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 2 ? '✓' : '2'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Body Condition</span>
          <span className="stepSubtitle">Screen & Body</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 3 ? '✓' : '3'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Camera & Audio</span>
          <span className="stepSubtitle">Lenses & Sound</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 4 ? '✓' : '4'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Connectivity</span>
          <span className="stepSubtitle">Network & Sensors</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep === 5 ? 'active' : ''}`}>
        <div className="stepCircle">5</div>
        <div className="stepLabels">
          <span className="stepTitle">Review Offer</span>
          <span className="stepSubtitle">Get your final offer</span>
        </div>
      </div>
    </div>
  );

  const renderSidebar = () => (
    <div className="wizardSidebar">
      <div className="deviceInfoCard">
        {/* Placeholder image, should come from product state */}
        <div className="deviceImageWrapper">
           <img src="https://m.media-amazon.com/images/I/81sigpKWFHL._SX679_.jpg" alt="Device" className="deviceImage" />
        </div>
        <div className="deviceDetails">
          <h5 className="deviceName">iPhone 15 Pro Max</h5>
          <p className="deviceSpec">256GB | Natural Titanium</p>
          <button className="changeDeviceBtn">Change Device <span className="editIcon">✎</span></button>
        </div>
      </div>

      <div className="sidebarSteps">
         <div className={`sidebarStep ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 1 ? '✓' : '1'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Device Condition</span>
               <span className="sidebarStepSubtitle">Answer a few questions</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 2 ? '✓' : '2'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Body Condition</span>
               <span className="sidebarStepSubtitle">Screen & Body</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 3 ? '✓' : '3'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Camera & Audio</span>
               <span className="sidebarStepSubtitle">Lenses & Sound</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 4 ? '✓' : '4'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Connectivity</span>
               <span className="sidebarStepSubtitle">Network & Sensors</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep === 5 ? 'active' : ''}`}>
            <div className="sidebarStepCircle">5</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Review Offer</span>
               <span className="sidebarStepSubtitle">Get your final offer</span>
            </div>
         </div>
      </div>

      <div className="helpCard">
        <div className="helpIconWrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
        </div>
        <h4>Need help?</h4>
        <p>Our experts are here to assist you.</p>
        <button className="chatBtn">Chat with us</button>
      </div>
    </div>
  );

  const renderQuestions = () => {
    const currentSchema = exchangeQuestionsSchema.find(s => s.step === currentStep);
    
    if (!currentSchema) return null;

    return (
      <div className="questionsContainer">
        {/* {currentSchema.step === 1 && (
           <div className="heroHeader">
             <h2>iPhone Buyback</h2>
             <p>Help us know your device better.<br/>Answer a few quick questions.</p>
           </div>
        )} */}

        {currentSchema.categories.map((category) => (
          <div key={category.id} className="categoryBlock">
            <div className="categoryHeader">
              <div className="categoryIcon">
                {category.id.includes('power') ? <PowerIcon /> : <PhoneIcon />}
              </div>
              <div className="categoryTitles">
                <h3>{category.title}</h3>
                {category.subtitle && <p>{category.subtitle}</p>}
              </div>
            </div>
            <div className="categoryQuestions">
              {category.questions.map((q) => (
                <div key={q.id} className="questionItem">
                  <div className="questionText">
                    <span className="qBadge">{q.id}</span>
                    <label>{q.text}</label>
                  </div>
                  {q.infoMessage && (
                    <div className="infoBox">
                      <span className="infoIcon">ⓘ</span>
                      <p>{q.infoMessage}</p>
                    </div>
                  )}
                  <div className="optionsGrid">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        className={`optionBtn ${answers[q.id] === opt.value ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(q.id, opt.value)}
                      >
                        {answers[q.id] === opt.value && <span className="checkIcon">✔</span>}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // const renderFooterTrustBadges = () => (
  //   <div className="trustBadgesFooter">
  //     <div className="trustBadge">
  //       <ShieldIcon />
  //       <div>
  //         <h5>Secure & Private</h5>
  //         <p>Your data is 100% safe with us</p>
  //       </div>
  //     </div>
  //     <div className="trustBadge">
  //       <span className="badgeIcon">✓</span>
  //       <div>
  //         <h5>Best Price Promise</h5>
  //         <p>Get the highest value for your device</p>
  //       </div>
  //     </div>
  //     <div className="trustBadge">
  //       <span className="badgeIcon">⏱</span>
  //       <div>
  //         <h5>Quick & Easy</h5>
  //         <p>Complete the process in minutes</p>
  //       </div>
  //     </div>
  //     <div className="trustBadge">
  //       <span className="badgeIcon">★</span>
  //       <div>
  //         <h5>Trusted by 2M+ customers</h5>
  //         <p>★★★★★ 4.7/5</p>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="wizardLayout">
      <div className="wizardTopHeader">
        {/* Mobile specific header could go here, desktop has navbar */}
        <div className="mobileTopHeader">
           {renderStepIndicator()}
        </div>
      </div>
      
      <div className="wizardMainContent">
        {renderSidebar()}
        
        <div className="wizardFormArea">
          {/* <div className="desktopTopHeader">
             {renderStepIndicator()}
          </div> */}
          
          <div className="scrollableQuestions">
            {renderQuestions()}
            
            {currentStep === 5 && (
              <div className="reviewSection">
                <h3>Review & Offer Placeholder</h3>
                <p>Calculated offer will be shown here.</p>
              </div>
            )}
          </div>
          
          <div className="wizardActions">
            {currentStep > 1 && (
              <button type="button" className="backBtn" onClick={handleBack}>
                &lt; Back
              </button>
            )}
            <button 
              type="button" 
              className="continueBtn" 
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {currentStep === totalSteps ? 'Submit' : (currentStep === 1 ? 'Continue >' : 'Continue to Review >')}
            </button>
          </div>
        </div>
      </div>
      
      {/* {renderFooterTrustBadges()} */}
    </div>
  );
}
