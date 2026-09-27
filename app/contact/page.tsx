'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { submitWebsiteEnquiry } from '@/lib/backend-client';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', clinicName: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      await submitWebsiteEnquiry(form);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit the enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '48px 0 80px' }}>
      <div className="container">
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#51b291', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Get In Touch
          </span>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            Speak With Our Medical Specialists
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '12px' }}>
            Request pricing, clinical demonstration, or biomedical service support in UAE.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
          {/* Contact Details */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>
              Corporate Office & Showroom
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <MapPin size={22} color="#51b291" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Location</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Building 27, Dubai Healthcare City (DHCC)<br />
                    Dubai, United Arab Emirates
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Phone size={22} color="#51b291" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Direct Line & WhatsApp</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    <a href="tel:+971508893589" style={{ color: '#51b291', textDecoration: 'none', fontWeight: 600 }}>
                      +971 508 893 589
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Mail size={22} color="#51b291" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Sales & Enquiries</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                    <a href="mailto:sales@fastonmed.com" style={{ color: '#51b291', textDecoration: 'none', fontWeight: 600 }}>
                      sales@fastonmed.com
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px' }}>
                <Clock size={22} color="#51b291" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem' }}>Working Hours</div>
                  <div style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.5 }}>
                    Monday – Friday: 8:30 AM – 6:00 PM<br />
                    Saturday: 9:00 AM – 2:00 PM<br />
                    24/7 Emergency Biomedical Callout Available
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '36px', border: '1px solid #e2e8f0' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Thank you! Enquiry Received.
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  A biomedical representative from FastonMed will reach out to you within 2 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  Send Clinical Enquiry
                </h2>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+971 50 ..."
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Hospital / Clinic / Organization Name
                  </label>
                  <input
                    type="text"
                    value={form.clinicName}
                    onChange={e => setForm({ ...form, clinicName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Equipment Required / Inquiries *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specify equipment models, quantities, or clinic setup requirements..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: '#51b291',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '13px 24px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    boxShadow: '0 4px 12px rgba(81, 178, 145, 0.3)'
                  }}
                >
                  <Send size={16} />
                  <span>{submitting ? 'Saving to CRM…' : 'Submit Clinical Inquiry'}</span>
                </button>
                {submitError && (
                  <p role="alert" style={{ color: '#dc2626', fontSize: '0.88rem', margin: 0 }}>
                    {submitError}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
