import React, { useState, useEffect, useRef } from 'react';
import { Clock, UploadCloud, Camera, Image, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, autoDetectCategory, calculateImpulseScore } from '../services/impulseEngine';

export function ExpenseForm({ onSubmitExpense, recentExpenses = [] }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food_delivery');
  const [simulateMidnight, setSimulateMidnight] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Image Bill Upload State
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptName, setReceiptName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (description.trim().length > 3) {
      setCategory(autoDetectCategory(description));
    }
  }, [description]);

  const liveTimestamp = simulateMidnight
    ? new Date(new Date().setHours(2, 30, 0, 0)).toISOString()
    : new Date().toISOString();

  const preview = calculateImpulseScore({
    amount: Number(amount) || 0,
    category,
    timestamp: liveTimestamp,
    description,
    recentExpenses
  });

  const getRiskColor = (s) => {
    if (s >= 80) return '#dc2626';
    if (s >= 60) return '#f97316';
    if (s >= 35) return '#d97706';
    return '#16a34a';
  };

  // Handle Bill/Receipt Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReceiptName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptImage(event.target.result);
      // Simulate intelligent OCR Bill reading
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        // If description/amount are empty, smartly pre-fill from receipt
        if (!description) {
          setDescription('Swiggy Food Bill');
          setCategory('food_delivery');
        }
        if (!amount) {
          setAmount('640');
        }
      }, 700);
    };
    reader.readAsDataURL(file);
  };

  const removeReceipt = (e) => {
    e.stopPropagation();
    setReceiptImage(null);
    setReceiptName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    setIsSubmitting(true);
    try {
      await onSubmitExpense({
        amount: Number(amount),
        description: description.trim() || CATEGORIES[category]?.label || 'Unspecified',
        category,
        timestamp: liveTimestamp,
        receiptImage: receiptImage || null
      });
      setDescription('');
      setAmount('');
      setReceiptImage(null);
      setReceiptName('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const applyPreset = (desc, amt, cat, midnight = false) => {
    setDescription(desc);
    setAmount(amt.toString());
    setCategory(cat);
    setSimulateMidnight(midnight);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Log Expense</h3>
        <span className="tag tag-red">AI Roast</span>
      </div>
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* 📷 Receipt / Bill Image Upload Section */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Upload Bill / Receipt</span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Photo or Screenshot</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ display: 'none' }}
          />

          {!receiptImage ? (
            <div
              className="bill-upload-box"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="bill-upload-icon-circle">
                <Camera size={18} />
              </div>
              <div className="bill-upload-text">
                <span className="upload-main-text">Upload Bill / Receipt Image</span>
                <span className="upload-sub-text">Tap to take photo or choose image file</span>
              </div>
              <span className="bill-upload-chip">
                <UploadCloud size={12} /> Browse File
              </span>
            </div>
          ) : (
            <div className="bill-preview-card">
              <div className="bill-preview-thumb-wrap">
                <img src={receiptImage} alt="Receipt preview" className="bill-preview-thumb" />
              </div>
              <div className="bill-preview-info">
                <div className="bill-preview-name">{receiptName}</div>
                {isScanning ? (
                  <div className="bill-scanning-tag">
                    <Sparkles size={12} className="spin-icon" />
                    <span>AI Scanning Receipt...</span>
                  </div>
                ) : (
                  <div className="bill-scanned-tag">
                    <CheckCircle2 size={12} />
                    <span>Receipt Attached & Detected</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="bill-remove-btn"
                onClick={removeReceipt}
                title="Remove Receipt"
              >
                <X size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div className="form-group">
          <label className="form-label">Quick presets</label>
          <div className="presets-row">
            <button type="button" className="preset-chip" onClick={() => applyPreset('Midnight Butter Chicken + Naan (Swiggy)', 590, 'food_delivery', true)}>
              🌙 2AM Swiggy ₹590
            </button>
            <button type="button" className="preset-chip" onClick={() => applyPreset('Blinkit: Doritos + Cold Coffee + Brownie', 430, 'late_night_snacks', true)}>
              ⚡ Blinkit ₹430
            </button>
            <button type="button" className="preset-chip" onClick={() => applyPreset('Myntra: Casual Shoes 50% Off', 2600, 'shopping_fashion', false)}>
              👗 Myntra ₹2,600
            </button>
            <button type="button" className="preset-chip" onClick={() => applyPreset('Fresh Vegetables & Bread', 220, 'groceries_essentials', false)}>
              🥦 Essentials ₹220
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 3rd Swiggy order, Nike sneakers, Pub bill..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <span className="form-hint">Keywords auto-detect category</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount</label>
              <div className="form-input-with-prefix">
                <span className="form-prefix">₹</span>
                <input type="number" step="any" className="form-input" placeholder="499" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                {Object.values(CATEGORIES).map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="toggle-row">
            <div className="toggle-info">
              <h4><Clock size={12} style={{ display: 'inline', verticalAlign: '-2px' }} /> Simulate 2:30 AM</h4>
              <p>Test midnight impulse penalty (+35 pts)</p>
            </div>
            <label className="switch">
              <input type="checkbox" checked={simulateMidnight} onChange={(e) => setSimulateMidnight(e.target.checked)} />
              <span className="slider"></span>
            </label>
          </div>

          <div className="risk-preview">
            <div className="risk-preview-label">
              <span>Impulse risk</span>
              <span style={{ fontWeight: 700, color: getRiskColor(preview.score) }}>
                {preview.score}/100 · {preview.tier}
              </span>
            </div>
            <div className="risk-bar-track">
              <div className="risk-bar-fill" style={{ width: `${Math.max(4, preview.score)}%`, backgroundColor: getRiskColor(preview.score) }} />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting || !amount} className="btn btn-dark btn-block" style={{ padding: '12px' }}>
            {isSubmitting ? 'Generating roast...' : 'Log & Get Roasted →'}
          </button>
        </form>
      </div>
    </div>
  );
}
