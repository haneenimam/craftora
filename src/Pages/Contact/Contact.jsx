import React, { useState, useEffect, useRef } from 'react';
import styles from './Contact.module.css';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  const validate = (data) => {
    const newErrors = {};

    // Name validation: allow letters, spaces, accented chars; min 3 chars
    if (data.name.trim() === '') {
      newErrors.name = 'Name is required.';
    } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]{3,}$/.test(data.name.trim())) {
      newErrors.name = 'Name must be at least 3 letters and contain only letters and spaces.';
    }

    // Email validation
    if (data.email.trim() === '') {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Message validation (min 10 chars, max 200 chars)
    const trimmedMessage = data.message.trim();
    if (trimmedMessage === '') {
      newErrors.message = 'Message is required.';
    } else if (trimmedMessage.length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    } else if (trimmedMessage.length > 200) {
      newErrors.message = `Message is too long (${trimmedMessage.length} characters). Maximum is 200.`;
    }

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // Mark all fields as touched to show all errors if any
  //   setTouched({ name: true, email: true, message: true });

  //   const validationErrors = validate(formData);
  //   setErrors(validationErrors);

  //   if (Object.keys(validationErrors).length === 0) {
  //     alert('Message sent successfully!');
  //     setFormData({ name: '', email: '', message: '' });
  //     setTouched({});
  //     setErrors({});
  //     setIsFormValid(false);
  //   } else {
  //     if (validationErrors.name) {
  //       nameRef.current?.focus();
  //     } else if (validationErrors.email) {
  //       emailRef.current?.focus();
  //     } else if (validationErrors.message) {
  //       messageRef.current?.focus();
  //     }
  //   }
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({ name: true, email: true, message: true });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/contact`,
          formData,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.status === 200) {
          alert('Message sent successfully!');
          setFormData({ name: '', email: '', message: '' });
          setTouched({});
          setErrors({});
          setIsFormValid(false);
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Failed to send message. Please try again later.');
      }
    } else {
      if (validationErrors.name) {
        nameRef.current?.focus();
      } else if (validationErrors.email) {
        emailRef.current?.focus();
      } else if (validationErrors.message) {
        messageRef.current?.focus();
      }
    }
  };

  return (
    <div className={styles.contactContainer}>
      <h2 className={styles.contactTitle}>Contact Us</h2>
      <form onSubmit={handleSubmit} className={styles.contactForm} noValidate>
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name && touched.name ? styles.errorInput : ''}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby="name-error"
            ref={nameRef}
            maxLength={50}
          />
          {touched.name && errors.name && (
            <p id="name-error" className={styles.errorText} role="alert">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email && touched.email ? styles.errorInput : ''}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby="email-error"
            ref={emailRef}
            maxLength={100}
          />
          {touched.email && errors.email && (
            <p id="email-error" className={styles.errorText} role="alert">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.message && touched.message ? styles.errorInput : ''}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby="message-error"
            ref={messageRef}
            maxLength={200}
          />
          {touched.message && errors.message && (
            <p id="message-error" className={styles.errorText} role="alert">
              {errors.message}
            </p>
          )}
          <p
            className={styles.charCount}
            style={{ color: formData.message.length < 10 ? 'red' : '#093866' }}
          >
            {formData.message.length} / 200 characters
          </p>
        </div>
        <button type="submit" disabled={!isFormValid}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;