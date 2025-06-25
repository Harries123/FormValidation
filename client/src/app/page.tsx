'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';
import moment from 'moment';

const govtIdTypes = ['Aadhar', 'PAN', 'Driving License', 'Passport'] as const;

const formSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
    gender: z.enum(['male', 'female', 'prefer not to say'], {
      errorMap: () => ({ message: 'Select a gender' }),
    }),
    dob: z
      .string()
      .refine((date) => moment(date, 'YYYY-MM-DD', true).isValid(), {
        message: 'Invalid date',
      })
      .refine((date) => {
        const age = moment().diff(moment(date, 'YYYY-MM-DD'), 'years');
        return age >= 18;
      }, {
        message: 'You must be at least 18 years old',
      }),
    address: z.string().min(5, 'Address is too short'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
    govtIdType: z.enum(govtIdTypes, {
      errorMap: () => ({ message: 'Select a Govt ID' }),
    }),
    govtIdNumber: z.string().min(5, 'Enter valid ID number'),
    
    idProof: z.instanceof(File).refine((file) => file.size > 0, {
  message: 'Upload ID proof',
}),

    gstNo: z
      .string()
      .regex(
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        'Invalid GSTIN format'
      ),
    password: z
      .string()
      .min(6)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/, 'Password must include uppercase, lowercase, and number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof formSchema>;
type Errors = Partial<Record<keyof FormData, string>>;

export default function SellerRegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dob: '',
    address: '',
    pincode: '',
    govtIdType: 'Aadhar',
    govtIdNumber: '',
    idProof: new File([], ''),
    gstNo: '',
    password: '',
    confirmPassword: '',
  });

  const [age, setAge] = useState<number | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (formData.dob) {
      const years = moment().diff(moment(formData.dob, 'YYYY-MM-DD'), 'years');
      setAge(years);
    } else {
      setAge(null);
    }
  }, [formData.dob]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, idProof: file }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    const parsed = formSchema.safeParse(formData);
    if (!parsed.success) {
      const fieldErrors: Errors = {};
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
      const payload = new FormData();

      for (const key in formData) {
        const value = formData[key as keyof FormData];
        if (key === 'idProof' && value instanceof File) {
          payload.append('idProof', value);
        } else {
          payload.append(key, String(value));
        }
      }

     const response = await fetch('https://formvalidation-server-ko5b.onrender.com/api/form', {

  method: 'POST',
  body: payload,
});


      const contentType = response.headers.get('Content-Type') || '';

      if (!response.ok) {
        const errorMessage =
          contentType.includes('application/json')
            ? (await response.json()).message
            : await response.text();

        alert(errorMessage || 'Submission failed');
        return;
      }

      const result = await response.json();
      console.log(' Registered:', result);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: 'male',
        dob: '',
        address: '',
        pincode: '',
        govtIdType: 'Aadhar',
        govtIdNumber: '',
        idProof: new File([], ''),
        gstNo: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error(' Submission Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10 dark:bg-neutral-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 bg-white dark:bg-neutral-800 rounded-2xl shadow space-y-6"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Seller Admin Registration
        </h2>

        {[
          { label: 'Name', name: 'name' },
          { label: 'Email', name: 'email' },
          { label: 'Phone Number', name: 'phone' },
          { label: 'Address', name: 'address' },
          { label: 'Pincode', name: 'pincode' },
          { label: 'Govt ID Number', name: 'govtIdNumber' },
          { label: 'GST Number', name: 'gstNo' },
          { label: 'Password', name: 'password', type: 'password' },
          { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">{label}</label>
            <input
              type={type || 'text'}
              name={name}
              value={formData[name as keyof FormData] as string}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg text-sm dark:bg-neutral-700 dark:text-white ${
                errors[name as keyof FormData] ? 'border-red-500' : ''
              }`}
            />
            {errors[name as keyof FormData] && (
              <p className="text-xs text-red-500">{errors[name as keyof FormData]}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Gender</label>
          <div className="flex gap-4">
            {['male', 'female', 'prefer not to say'].map((g) => (
              <label key={g} className="flex items-center space-x-2 text-sm">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleInputChange}
                />
                <span className="capitalize text-gray-700 dark:text-gray-300">{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && <p className="text-xs text-red-500">{errors.gender}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg text-sm dark:bg-neutral-700 dark:text-white ${
              errors.dob ? 'border-red-500' : ''
            }`}
          />
          {errors.dob && <p className="text-xs text-red-500">{errors.dob}</p>}
          {age !== null && <p className="text-sm mt-1 text-green-600">Age: {age} years</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Govt ID Type</label>
          <select
            name="govtIdType"
            value={formData.govtIdType}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-lg text-sm dark:bg-neutral-700 dark:text-white"
          >
            {govtIdTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.govtIdType && <p className="text-xs text-red-500">{errors.govtIdType}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm text-gray-700 dark:text-gray-300">Upload ID Proof</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="w-full text-sm"
          />
          {errors.idProof && <p className="text-xs text-red-500">{errors.idProof}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Registering...' : 'Register'}
        </button>

        {success && <p className="text-sm text-center text-green-600">Seller registered successfully!</p>}
      </form>
    </main>
  );
}
