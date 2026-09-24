"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { submitExchangeRequest, fetchBuybackQuestions, fetchDeviceOptions, submitDeviceBuybackRequest, submitBuybackAssessmentRequest, submitBuybackAssessmentStepRequest, fetchPriceBreakdown } from '@/redux/features/exchangeSlice';
import { openLoginModal } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import './ExchangeForm.css';
import { exchangeQuestionsSchema, StepSchema } from './ExchangeQuestions';
import { FaCubes, FaHome } from 'react-icons/fa';

interface Option {
  id: number;
  question_id: number;
  option_label: string;
  option_value: string;
  price_adjustment: string;
  adjustment_type: string;
  reject_device: number;
  option_order: number;
  status: number;
}

interface Question {
  id: number;
  section_id: number;
  question: string;
  question_type: string;
  is_required: number;
  inspection_only: number;
  question_order: number;
  status: number;
  options: Option[];
}

interface Section {
  id: number;
  section_name: string;
  section_slug: string;
  section_order: number;
  status: number;
  questions: Question[];
}

import { MdVerified } from 'react-icons/md';
import { TbDeviceMobileX } from 'react-icons/tb';
import { AiOutlineMobile } from 'react-icons/ai';
import { IoBatteryHalfSharp } from 'react-icons/io5';
import { SlCalender } from 'react-icons/sl';

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
  [questionId: number]: number;
}

export default function ExchangeForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [answers, setAnswers] = useState<Answers>({});
  const [assessmentId, setAssessmentId] = useState<number | string | null>(null);
  const [purchaseDateType, setPurchaseDateType] = useState<string>('monthYear');
  const [exactDate, setExactDate] = useState<string>('');
  const [purchaseMonth, setPurchaseMonth] = useState<string>('04');
  const [purchaseYear, setPurchaseYear] = useState<string>('2026');
  
  const [selectedBrand, setSelectedBrand] = useState<number | ''>('');
  const [selectedModel, setSelectedModel] = useState<number | ''>('');
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isSubmitting, questions: apiQuestions, isLoadingQuestions, deviceOptions, isLoadingDeviceOptions, isLoadingPriceBreakdown, priceBreakdownData } = useSelector((state: RootState) => state.exchange);
  const isAuthenticated = useSelector((state: RootState) => state.auth?.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth?.user);

  useEffect(() => {
    if (isAuthenticated === false) {
      dispatch(openLoginModal());
    }
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (currentStep > 1 && currentStep < 7) {
      dispatch(fetchBuybackQuestions(currentStep - 1));
    }
  }, [currentStep, dispatch]);

  useEffect(() => {
    if (currentStep === 7 && assessmentId) {
      dispatch(fetchPriceBreakdown(assessmentId));
    }
  }, [currentStep, assessmentId, dispatch]);

  useEffect(() => {
    if (currentStep === 1) {
      dispatch(fetchDeviceOptions({ 
        brand_id: selectedBrand || 1, 
        product_id: selectedModel || 7, 
        color: selectedColor || 'BLUE', 
        storage: selectedStorage || '128GB' 
      }));
    }
  }, [currentStep, dispatch, selectedBrand, selectedModel, selectedColor, selectedStorage]);

  const brands = deviceOptions?.data?.brands || [];
  const models = deviceOptions?.data?.models || [];
  const storages = deviceOptions?.data?.storages || [];
  const colors = deviceOptions?.data?.colors || [];

  const totalSteps = 8; // 1: Model Details, 2: Condition, 3-6: Additional, 7: Review & Offer, 8: Final Quote

  const handleOptionSelect = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  console.log(priceBreakdownData?.deductions[0]?.type)

const handleAssesment = () => {
  console.log("clicked", isAuthenticated);
   if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
   }

   window.location.href = '/assessment-history';
};


  const handleNext = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal());
      return;
    }
    console.log(assessmentId)

    // Basic validation: check if all questions in the current step are answered
    if (currentStep > 1 && currentStep < 7) {
      let allAnswered = true;
      const stepAnswers: { question_id: number; option_id: number }[] = [];
      
      for (const section of apiQuestions) {
        for (const question of section.questions) {
          if (question.is_required && !answers[question.id]) {
            allAnswered = false;
            // break;
          }
          if (answers[question.id]) {
            console.log("question_id:", question.id);
            console.log("option_id:", answers[question.id]);
            stepAnswers.push({
               question_id: question.id,
               option_id: answers[question.id]
            });
            
          }
        }
      }
      // if (!allAnswered) {
      //   toast.error('Please answer all questions before proceeding.');
      //   return;
      console.log("Assessment ID currently is:", assessmentId);
      console.log("Step answers prepared:", stepAnswers);
      
      if (assessmentId) {
        const payload = {
            step: currentStep - 1,
            answers: stepAnswers
        };
        console.log("Dispatching step submission with payload:", payload);
        dispatch(submitBuybackAssessmentStepRequest({ assessmentId, payload })).unwrap().then(() => {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch((err) => {
            console.error("Buyback Assessment Step API Error:", err);
            
            if (err === "This buyback assessment is already rejected") {
                router.push('/assesment-result');
                return;
            }

            toast.error(typeof err === 'string' ? err : err?.message || 'Failed to submit step answers');
        });
        return; // Don't increment currentStep here, it's done in the then block
      } else {
        console.warn("No assessmentId found, skipping step API submission.");
      }
    }
    
    if (currentStep < totalSteps) {
      if (currentStep === 1) {
        if (!selectedBrand || !selectedModel || !selectedStorage || !selectedColor) {
          toast.error('Please select Brand, Model, Variant, and Color.');
          return;
        }

        let buyingDate = exactDate;
        if (purchaseDateType === 'monthYear') {
          buyingDate = `${purchaseYear}-${purchaseMonth}-01`;
        } else if (purchaseDateType === 'exact' && !exactDate) {
          toast.error('Please select an exact purchase date.');
          return;
        }
        
        const payload = {
          user_id: user?.id,
          buying_date: buyingDate,
          brand_id: selectedBrand,
          product_id: selectedModel,
          storage: selectedStorage,
          color: selectedColor
        };
        
        dispatch(submitDeviceBuybackRequest(payload)).unwrap().then((res) => {
          // console.log("Device Buyback Response:", res);
          const assessmentFormData = new FormData();
          assessmentFormData.append('customer_id', String(user?.id || ''));
          assessmentFormData.append('device_id', String(res?.id || res?.data?.id || res?.device_id || '1')); // Defaulting to '1' if id not found just in case
          assessmentFormData.append('base_price', '50000');
          assessmentFormData.append('model_id', String(selectedModel));

          dispatch(submitBuybackAssessmentRequest(assessmentFormData)).unwrap().then((assessmentRes) => {
            console.log("Assessment Response received:", assessmentRes);
            const extractedId = assessmentRes?.data?.id || assessmentRes?.id || assessmentRes?.assessment_id;
            console.log("Extracted assessment ID:", extractedId);
            setAssessmentId(extractedId);
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }).catch((err) => {
            console.error("Buyback Assessment API Error:", err);
            toast.error(typeof err === 'string' ? err : err?.message || 'Failed to submit buyback assessment');
          });
        }).catch((err) => {
          console.error("Device Buyback API Error:", err);
          toast.error(typeof err === 'string' ? err : err?.message || 'Failed to submit device details');
        });
        return;
      }
      
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
          <span className="stepTitle">Model Details</span>
          <span className="stepSubtitle">Identify your device</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 2 ? '✓' : '2'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Device Condition</span>
          <span className="stepSubtitle">Answer a few questions</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 3 ? '✓' : '3'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Body Condition</span>
          <span className="stepSubtitle">Screen & Body</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 4 ? '✓' : '4'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Camera & Audio</span>
          <span className="stepSubtitle">Lenses & Sound</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 5 ? '✓' : '5'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Connectivity</span>
          <span className="stepSubtitle">Network & Sensors</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep >= 6 ? 'active' : ''} ${currentStep > 6 ? 'completed' : ''}`}>
        <div className="stepCircle">{currentStep > 6 ? '✓' : '6'}</div>
        <div className="stepLabels">
          <span className="stepTitle">Additional Details</span>
          <span className="stepSubtitle">Buttons & Sensors</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep === 7 ? 'active' : ''}`}>
        <div className="stepCircle">7</div>
        <div className="stepLabels">
          <span className="stepTitle">Final Quote</span>
          <span className="stepSubtitle">Get your final quote</span>
        </div>
      </div>
      <div className="stepLine" />
      <div className={`stepItem ${currentStep === 8 ? 'active' : ''}`}>
        <div className="stepCircle">8</div>
        <div className="stepLabels">
          <span className="stepTitle">Pickup & Payment</span>
          <span className="stepSubtitle">Schedule pickup</span>
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
               <span className="sidebarStepTitle">Model Details</span>
               <span className="sidebarStepSubtitle">Identify your device</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 2 ? '✓' : '2'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Device Condition</span>
               <span className="sidebarStepSubtitle">Answer a few questions</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 3 ? '✓' : '3'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Body Condition</span>
               <span className="sidebarStepSubtitle">Screen & Body</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 4 ? 'active' : ''} ${currentStep > 4 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 4 ? '✓' : '4'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Camera & Audio</span>
               <span className="sidebarStepSubtitle">Lenses & Sound</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 5 ? 'active' : ''} ${currentStep > 5 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 5 ? '✓' : '5'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Connectivity</span>
               <span className="sidebarStepSubtitle">Network & Sensors</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep >= 6 ? 'active' : ''} ${currentStep > 6 ? 'completed' : ''}`}>
            <div className="sidebarStepCircle">{currentStep > 6 ? '✓' : '6'}</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Additional Details</span>
               <span className="sidebarStepSubtitle">Buttons & Sensors</span>
            </div>
         </div>
          <div className={`sidebarStep ${currentStep === 7 ? 'active' : ''}`}>
            <div className="sidebarStepCircle">7</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Final Quote</span>
               <span className="sidebarStepSubtitle">Get your final quote</span>
            </div>
         </div>
         <div className={`sidebarStep ${currentStep === 8 ? 'active' : ''}`}>
            <div className="sidebarStepCircle">8</div>
            <div className="sidebarStepLabels">
               <span className="sidebarStepTitle">Pickup & Payment</span>
               <span className="sidebarStepSubtitle">Schedule pickup</span>
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
    if (isLoadingQuestions) {
      return (
        <div className="loadingQuestions" style={{ padding: '40px', textAlign: 'center' }}>
          Loading questions...
        </div>
      );
    }

    if (!apiQuestions || apiQuestions.length === 0) return null;

    return (
      <div className={`questionsContainer ${apiQuestions.length === 3 ? 'layout-masonry-3' : apiQuestions.length === 4 ? 'layout-masonry-4' : ''}`}>
        {apiQuestions.map((section) => (
          <div key={section.id} className="categoryBlock">
            {section.section_name && (
              <div className="categoryHeader">
                <div className="categoryIcon">
                  {section.section_slug.includes('power') ? <PowerIcon /> : <PhoneIcon />}
                </div>
                <div className="categoryTitles">
                  <h3>{section.section_name}</h3>
                </div>
              </div>
            )}
            <div className="categoryQuestions">
              {section.questions.map((q) => (
                <div key={q.id} className="questionItem">
                  <div className="questionText">
                    <span className="qBadge">{q.question_order}</span>
                    <label>{q.question}</label>
                  </div>
                  <div className="optionsGrid">
                    {q.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        className={`optionBtn ${answers[q.id] === opt.id ? 'selected' : ''}`}
                        onClick={() => handleOptionSelect(q.id, opt.id)}
                      >
                        {answers[q.id] === opt.id && <span className="checkIcon">✔</span>}
                        {opt.option_label}
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

  // Safely unwrap priceBreakdownData just in case it's wrapped in an array or a .data property
  let finalDeductions: any[] = [];
  let finalBasePrice = 0;
  let finalFinalPrice = 0;

  if (priceBreakdownData) {
    const dataObj = Array.isArray(priceBreakdownData) ? priceBreakdownData[0] : priceBreakdownData;
    const innerData = dataObj?.data ? dataObj.data : dataObj;
    
    finalDeductions = innerData?.deductions || [];
    finalBasePrice = innerData?.base_price || 0;
    finalFinalPrice = innerData?.final_price || 0;
  }


  if (currentStep === 7) {
    console.log("DEBUG: isLoadingPriceBreakdown =", isLoadingPriceBreakdown);
    console.log("DEBUG: raw priceBreakdownData from Redux =", priceBreakdownData);
    console.log("DEBUG: parsed finalDeductions =", finalDeductions);
    console.log("DEBUG: parts =", finalDeductions.filter((d: any) => d.type === 'part'));
    console.log("DEBUG: conditions =", finalDeductions.filter((d: any) => d.type === 'condition'));
  }


  const renderFinalQuote = () => (
    <div className="finalQuoteContainer">
      <div className="finalQuoteHeader">
        <div className="finalQuoteHeaderLeft">
          <h2>Review Your Device Details</h2>
          <p>Here's a summary of the information you've provided.<br/>Please check and confirm to get your final buyback price.</p>
        </div>
        <div className="accurateQuoteBadge">
          <span className="shieldIcon"><ShieldIcon /></span>
          <div>
            <strong>Accurate quote</strong>
            <span>Based on your device condition</span>
          </div>
        </div>
      </div>

      <div className="fqDeviceCardContainer">
        <div className="fqDeviceCard">
          <div className="fqDeviceImage">
            <img src="https://m.media-amazon.com/images/I/71bErtQPC3L._SX679_.jpg" alt="Apple iPhone 14" />
          </div>
          <div className="fqDeviceDetails">
            <h3>Apple iPhone 14</h3>
            <p>128 GB | Midnight (Black)</p>
            <button className="fqChangeModelBtn">
              <span className="editIcon">✎</span> Change Model
            </button>
          </div>
        </div>
        <div className="fqValueSection">
          <div className="fqValueDetails">
            <span>Estimated Buyback Value</span>
            <h2>{isLoadingPriceBreakdown ? 'Loading...' : `₹${finalFinalPrice}`}</h2>
            <div className="fqValueSub">
              <span className="fqStrikethrough">₹{finalBasePrice}</span>
              {finalBasePrice > 0 && finalFinalPrice > 0 && (
                <span className="fqLowerBadge">
                  ↓ {Math.round(((finalBasePrice - finalFinalPrice) / finalBasePrice) * 100)}% lower
                </span>
              )}
            </div>
            <p className="fqBasedOn">Based on your device condition</p>
          </div>
          <div className="fqGreatValueBadge">
            <div className="fqGreatValueIcon">↗</div>
            <strong>Great Value!</strong>
            <span>Your device is in<br/>good condition.</span>
          </div>
        </div>
      </div>

      <div className="fqConditionSummary">
        <div className="fqSectionHeader">
          <div>
            <h3>Condition Summary</h3>
            <p>You can go back and edit any details if needed.</p>
          </div>
          <button className="fqEditAllBtn"><span className="editIcon">✎</span> Edit All</button>
        </div>
        
        <div className="fqSummaryList">
          {finalDeductions.filter((d: any) => d.type === 'condition').map((cond: any, index: number) => (
            <div className="fqSummaryItem" key={index}>
              <div className="fqSummaryItemLeft">
                <span className="fqItemIcon"><AiOutlineMobile /></span>
                <span className="fqItemLabel">{cond.question}</span>
                <span className="fqItemValue">{cond.selected_option}</span>
              </div>
              <div className="fqSummaryItemRight">
                <span className="fqFactor"><span className="fqFactorText">Factor: </span>{cond.factor !== null ? cond.factor : 'N/A'}</span>
              </div>
            </div>
          ))}
          {isLoadingPriceBreakdown && (
            <div className="fqSummaryItem">
              <span className="fqItemLabel">Loading condition details...</span>
            </div>
          )}
          {!isLoadingPriceBreakdown && finalDeductions.filter((d: any) => d.type === 'condition').length === 0 && (
            <div className="fqSummaryItem">
              <span className="fqItemLabel">No condition details available.</span>
            </div>
          )}
        </div>
      </div>

      <div className="fqPartWiseDetails">
        <div className="fqSectionHeader">
          <div>
            <h3>Part-wise Details</h3>
            <p>Here are the details for individual components.</p>
          </div>
        </div>
        <div className="fqSummaryList">
          {finalDeductions.filter((d: any) => d.type === 'part').map((part: any, index: number) => (
            <div className="fqSummaryItem" key={index}>
              <div className="fqSummaryItemLeft">
                <span className="fqItemIcon"><PhoneIcon /></span>
                <span className="fqItemLabel">{part.question}</span>
                <span className="fqItemValue">{part.selected_option}</span>
              </div>
              <div className="fqSummaryItemRight">
                <span className="fqFactor"><span className="fqFactorText">Factor: </span>{part.factor !== null ? part.factor : 'N/A'}</span>
              </div>
            </div>
          ))}
          {isLoadingPriceBreakdown && (
            <div className="fqSummaryItem">
              <span className="fqItemLabel">Loading part details...</span>
            </div>
          )}
          {!isLoadingPriceBreakdown && finalDeductions.filter((d: any) => d.type === 'part').length === 0 && (
            <div className="fqSummaryItem">
              <span className="fqItemLabel">No part details available.</span>
            </div>
          )}
        </div>
        
      </div>

      {/* <div className="fqFooterAction">
        <div className="fqFooterTop">
          <div className="fqFooterImg">
            <div className="fqFooterImgCircle">
              <span>💸</span>
            </div>
          </div>
          <div className="fqFooterPriceInfo">
            <p>Your Estimated Buyback Value</p>
            <div className="fqFooterPriceRow">
              <h2>₹28,430</h2>
              <span className="fqStrikethrough">₹32,000</span>
              <span className="fqLowerBadge">↓ 12% lower</span>
            </div>
          </div>
        </div>
        <div className="fqFooterFeatures">
          <div className="fqFeature">
            <span className="fqFeatureIcon">🚚</span>
            <div>
              <strong>Free Pickup</strong>
              <span>Across India</span>
            </div>
          </div>
          <div className="fqFeature">
            <span className="fqFeatureIcon">⚡</span>
            <div>
              <strong>Instant Payment</strong>
              <span>UPI / Bank Transfer</span>
            </div>
          </div>
          <div className="fqFeature">
            <span className="fqFeatureIcon"><ShieldIcon /></span>
            <div>
              <strong>100% Secure</strong>
              <span>Safe & Transparent</span>
            </div>
          </div>
        </div>
        <button className="fqConfirmBtn" onClick={() => submitForm()}>
          Confirm & Get Final Quote &rarr;
        </button>
        <p className="fqRedirectText">You'll be redirected to schedule pickup and choose your payment method.</p>
      </div> */}
    </div>
  );

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

  const renderSchedulePickup = () => (
    <div className="schedulePickupContainer">
      <div className="spHeader">
        <div className="spHeaderLeft">
          <h2>Schedule Your Pickup</h2>
          <p>Choose a date and time that works best for you. Our partner will pick up the device from your location, free of cost.</p>
        </div>
        <div className="spHeaderBadge desktopOnly">
          <span className="spShieldIcon"><ShieldIcon /></span>
          <div>
            <strong>Free & Safe Pickup</strong>
            <span>Insured and contactless pickup</span>
          </div>
        </div>
      </div>

      <div className="spContent">
        <div className="spFormColumn">
          <div className="spSection">
            <div className="spSectionHeader">
              {/* <span className="spIcon">📍</span> */}
              <h3>Pickup Address</h3>
            </div>
            <p className="spSectionSub">Select a saved address or add a new one.</p>
            
            <div className="spAddressList">
              <div className="spAddressCard selected">
                <div className="spRadioBtn"><span className="spRadioInner"></span></div>
                <div className="spAddressDetails">
                  <div className="spAddressTitleRow">
                    <strong>Home</strong>
                    <button className="spEditBtn"><span className="editIcon">✎</span> Edit</button>
                  </div>
                  <p>123, Green Park, Sector 45, Gurgaon,<br/>Haryana - 122003</p>
                  <p className="spContact">Jatin Agarwal | 98765 43210</p>
                </div>
              </div>
              
              <div className="spAddressCard">
                <div className="spRadioBtn"></div>
                <div className="spAddressDetails">
                  <div className="spAddressTitleRow">
                    <strong>Office</strong>
                    <button className="spEditBtn"><span className="editIcon">✎</span> Edit</button>
                  </div>
                  <p>Tower B, DLF Cyber City, Phase 3,<br/>Gurgaon - 122002</p>
                  <p className="spContact">Jatin Agarwal | 98765 43210</p>
                </div>
              </div>
            </div>
            
            <button className="spAddAddressBtn">
              + Add New Address
            </button>
            
            <div className="spConvenienceBox desktopOnly">
              <span><FaHome /></span>
              <div>
                <strong>Pickup at your convenience</strong>
                <p>Our executive will call you before arriving.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="spFormColumn">
          <div className="spSection">
            <div className="spSectionHeader">
              {/* <span className="spIcon">📅</span> */}
              <h3>Select Pickup Date</h3>
              <span className="spSeeMore mobileOnly">See more &gt;</span>
            </div>
            <p className="spSectionSub desktopOnly">Choose a convenient date for pickup.</p>
            
            <div className="spDateList">
              <div className="spDateCard selected">
                <span className="spDay">Tue</span>
                <span className="spDate">10 Sep</span>
              </div>
              <div className="spDateCard">
                <span className="spDay">Wed</span>
                <span className="spDate">11 Sep</span>
              </div>
              <div className="spDateCard">
                <span className="spDay">Thu</span>
                <span className="spDate">12 Sep</span>
              </div>
              <div className="spDateCard">
                <span className="spDay">Fri</span>
                <span className="spDate">13 Sep</span>
              </div>
              <div className="spDateCard">
                <span className="spDay">Sat</span>
                <span className="spDate">14 Sep</span>
              </div>
            </div>
          </div>

          <div className="spSection">
            <div className="spSectionHeader">
              {/* <span className="spIcon">🕒</span> */}
              <h3>Select Time Slot</h3>
            </div>
            <p className="spSectionSub desktopOnly">Choose a time slot for pickup.</p>
            
            <div className="spTimeGrid">
              <div className="spTimeCard selected">
                <div className="spRadioBtn"><span className="spRadioInner"></span></div>
                <span>9:00 AM - 11:00 AM</span>
              </div>
              <div className="spTimeCard">
                <div className="spRadioBtn"></div>
                <span>11:00 AM - 1:00 PM</span>
              </div>
              <div className="spTimeCard">
                <div className="spRadioBtn"></div>
                <span>1:00 PM - 3:00 PM</span>
              </div>
              <div className="spTimeCard">
                <div className="spRadioBtn"></div>
                <span>3:00 PM - 6:00 PM</span>
              </div>
            </div>
          </div>
          
          <div className="spInfoBox desktopOnly">
            <span className="spInfoIcon">i</span>
            <p>Our executive will contact you 30 minutes before pickup.</p>
          </div>
        </div>

        <div className="spSummaryColumn">
          <div className="spSummaryCard">
            <h3>Pickup Summary</h3>
            <div className="spSummaryProduct">
              <img src="https://m.media-amazon.com/images/I/71bErtQPC3L._SX679_.jpg" alt="iPhone 14" />
              <div>
                <h4>Apple iPhone 14</h4>
                <p>128 GB | Midnight (Black)</p>
              </div>
            </div>
            <div className="spSummaryValueRow">
              <span>Estimated Value</span>
              <strong>₹28,430</strong>
            </div>
            <div className="spSummaryDetails">
              <div className="spSummaryRow">
                <span className="spSummaryLabel">Pickup Address</span>
                <span className="spSummaryValue">123, Green Park, Sector 45, Gurgaon - 122003</span>
              </div>
              <div className="spSummaryRow">
                <span className="spSummaryLabel">Pickup Date</span>
                <span className="spSummaryValue">Tue, 10 Sep 2024</span>
              </div>
              <div className="spSummaryRow">
                <span className="spSummaryLabel">Time Slot</span>
                <span className="spSummaryValue">9:00 AM - 11:00 AM</span>
              </div>
            </div>
            
            <div className="spSummaryGuarantees">
              <div className="spGuaranteeItem">
                <span className="spCheckShieldIcon"><ShieldIcon /></span>
                <div>
                  <strong>Safe & Secure Pickup</strong>
                  <ul>
                    <li><span className="check">✓</span> Trained verification executive</li>
                    <li><span className="check">✓</span> Device inspected on pickup</li>
                    <li><span className="check">✓</span> Instant payment after verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="spFooterAction">
        <button className="spConfirmBtn" onClick={submitForm}>
          Confirm Pickup &rarr;
        </button>
        <p>You'll receive an SMS and a call to confirm your pickup.</p>
      </div>
    </div>
  );

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
            {currentStep === 1 && (
               <div className="stepOneContainer">
                  <div className="stepOneForm">
                     <div className="stepOneHeader" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                           <h2>Let's identify your device</h2>
                           <p>Tell us a few details about your phone to get an accurate buyback value.</p>
                        </div>
                        <button 
                          //  onClick={() => window.location.href = '/assessment-history'}
                         onClick={handleAssesment}
                           style={{
                              backgroundColor: '#ffffff',
                              color: '#4b80a9',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              border: '1px solid #4b80a9',
                              cursor: 'pointer',
                              fontWeight: 500,
                              fontSize: '14px'
                           }}
                        >
                           Assessment History
                        </button>
                     </div>
                     <div className="stepOneDropdowns">
                        <div className="dropdownWrapper">
                           <span className="dropdownIcon"><ShieldIcon /></span>
                           <div className="dropdownContent">
                              <label>Brand</label>
                              <select value={selectedBrand} onChange={(e) => setSelectedBrand(Number(e.target.value))}>
                                 <option value="">Select Brand</option>
                                 {brands.map((b: any) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        <div className="dropdownWrapper">
                           <span className="dropdownIcon"><PhoneIcon /></span>
                           <div className="dropdownContent">
                              <label>Model</label>
                              <select value={selectedModel} onChange={(e) => setSelectedModel(Number(e.target.value))}>
                                 <option value="">Select Model</option>
                                 {models.map((m: any) => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        <div className="dropdownWrapper">
                           <span className="dropdownIcon"><PowerIcon /></span>
                           <div className="dropdownContent">
                              <label>Variant</label>
                              <select value={selectedStorage} onChange={(e) => setSelectedStorage(e.target.value)}>
                                 <option value="">Select Variant</option>
                                 {storages.map((s: string) => (
                                    <option key={s} value={s}>{s}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        <div className="dropdownWrapper">
                           <span className="dropdownIcon"><ShieldIcon /></span>
                           <div className="dropdownContent">
                              <label>Color</label>
                              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                                 <option value="">Select Color</option>
                                 {colors.map((c: any) => (
                                    <option key={c.color} value={c.color}>{c.color}</option>
                                 ))}
                              </select>
                           </div>
                        </div>
                        
                        <div className="purchaseDateSection">
                          <div className="purchaseDateHeader">
                            <label>Purchase Date</label>
                            <p>Tell us when you purchased your phone.</p>
                          </div>
                          
                          <div className="purchaseDateTypeSelect">
                            <label className={`pdRadio ${purchaseDateType === 'monthYear' ? 'active' : ''}`}>
                              <div className="pdRadioBtn">
                                <input 
                                  type="radio" 
                                  name="pdType" 
                                  checked={purchaseDateType === 'monthYear'}
                                  onChange={() => setPurchaseDateType('monthYear')}
                                />
                                <span className="pdRadioInner"></span>
                              </div>
                              <div className="pdRadioText">
                                <strong>Month & Year</strong>
                                <span>I only remember the month and year</span>
                              </div>
                            </label>
                            
                            <label className={`pdRadio ${purchaseDateType === 'exact' ? 'active' : ''}`}>
                              <div className="pdRadioBtn">
                                <input 
                                  type="radio" 
                                  name="pdType" 
                                  checked={purchaseDateType === 'exact'}
                                  onChange={() => setPurchaseDateType('exact')}
                                />
                                <span className="pdRadioInner"></span>
                              </div>
                              <div className="pdRadioText">
                                <strong>Exact Date</strong>
                                <span>I know the exact date</span>
                              </div>
                            </label>
                          </div>

                          {purchaseDateType === 'monthYear' ? (
                            <div className="pdInputsRow">
                              <div className="pdInputGroup">
                                <label>Purchase Month</label>
                                <div className="pdDropdown">
                                  <span className="pdCalendarIcon"><SlCalender /></span>
                                  <select value={purchaseMonth} onChange={(e) => setPurchaseMonth(e.target.value)}>
                                  {[
                                    { name: "January", value: "01" },
                                    { name: "February", value: "02" },
                                    { name: "March", value: "03" },
                                    { name: "April", value: "04" },
                                    { name: "May", value: "05" },
                                    { name: "June", value: "06" },
                                    { name: "July", value: "07" },
                                    { name: "August", value: "08" },
                                    { name: "September", value: "09" },
                                    { name: "October", value: "10" },
                                    { name: "November", value: "11" },
                                    { name: "December", value: "12" }
                                  ].map((month) => (
                                    <option key={month.value} value={month.value}>
                                      {month.name}
                                    </option>
                                  ))}
                                </select>
                                </div>
                              </div>
                              <div className="pdInputGroup">
                                <label>Purchase Year</label>
                                <div className="pdDropdown">
                                  <span className="pdCalendarIcon"><SlCalender /></span>
                                  <select value={purchaseYear} onChange={(e) => setPurchaseYear(e.target.value)}>
                                    {Array.from({ length: 15 }, (_, i) => {
                                      const year = new Date().getFullYear() - i;
                                      return (
                                        <option key={year} value={year}>
                                          {year}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pdInputsRow">
                              <div className="pdInputGroup">
                                <label>Exact Date</label>
                                <div className="pdDropdown">
                                  <span className="pdCalendarIcon"><SlCalender /></span>
                                  <input 
                                    type="date" 
                                    className="pdDateInput"
                                    value={exactDate}
                                    onChange={(e) => setExactDate(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                     </div>
                     
                     <button 
                       type="button" 
                       className="stepOneContinueBtn" 
                       onClick={handleNext}
                       disabled={isSubmitting}
                     >
                       Continue to Device Condition &rarr;
                     </button>
                     
                    
                  </div>
                  
                  <div className="stepOneHero">
                     <h2>Same Device.<br/><span>New Possibilities.</span></h2>
                     <p>Sell your old phone in a few simple steps and get the best value.</p>
                     <div className="heroImageWrapper">
                        <img src="https://m.media-amazon.com/images/I/71bErtQPC3L._SX679_.jpg" alt="Dummy Phone" className="heroPhoneImg" />
                        
                     </div>
                  </div>
               </div>
            )}

            {currentStep > 1 && currentStep < 7 && renderQuestions()}
            
            {currentStep === 7 && renderFinalQuote()}

            {currentStep === 8 && renderSchedulePickup()}
          </div>
          
          {currentStep > 1 && currentStep < 8 && (
            <div className="wizardActions">
              <button type="button" className="backBtn" onClick={handleBack}>
                &lt; Back
              </button>
              <button 
                type="button" 
                className="continueBtn" 
                onClick={handleNext}
                disabled={isSubmitting}
              >
                {currentStep === totalSteps ? 'Submit' : 'Continue >'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* {currentStep === 8 && (
        <div className="sellingEasyBanner">
          <div className="sebContent">
            <h2>We Make Selling Easy</h2>
            <p>Sit back while we take care of the rest.</p>
            
            <div className="sebFeatures">
              <div className="sebFeature">
                <span className="sebIcon">🚚</span>
                <div>
                  <strong>Free Pickup</strong>
                  <span>Across India</span>
                </div>
              </div>
              <div className="sebFeature">
                <span className="sebIcon"><ShieldIcon /></span>
                <div>
                  <strong>100% Secure</strong>
                  <span>Insured & Tracked</span>
                </div>
              </div>
              <div className="sebFeature">
                <span className="sebIcon">⚡</span>
                <div>
                  <strong>Instant Payment</strong>
                  <span>After Device Verification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* {renderFooterTrustBadges()} */}
    </div>
  );
}
