'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';

// Zod validation schema
const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
      'Password must include at least one uppercase letter, one lowercase letter, and one number'
    ),
});


type FormData = z.infer<typeof formSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Zod validation
    const parsed = formSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      parsed.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle backend validation errors (e.g., Express Validator)
        if (Array.isArray(data.errors)) {
          const fieldErrors: FormErrors = {};
          data.errors.forEach((err: { param: keyof FormData; msg: string }) => {
            fieldErrors[err.param] = err.msg;
          });
          setErrors(fieldErrors);
        } else {
          alert(data?.message || 'Submission failed');
        }
        return;
      }

      setSuccess(true);
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Network error or server not responding.');
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-hide success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-neutral-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-neutral-800 shadow-lg rounded-2xl space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Register
        </h2>

        {(['name', 'email', 'password'] as (keyof FormData)[]).map((field) => (
          <div key={field}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
              {field}
            </label>
            <input
              type={field === 'password' ? 'password' : 'text'}
              placeholder={`Enter your ${field}`}
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 ${
                errors[field] ? 'border-red-500' : ''
              }`}
            />
            {errors[field] && (
              <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        {success && (
          <p className="text-green-600 text-sm text-center">
            Form submitted successfully!
          </p>
        )}
      </form>
    </main>
  );
}

