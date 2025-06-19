import React, { useState } from 'react';
import Layout from '@/components/Layout';

const professions = [
  'Student (School / College / University)',
  'Education (Teacher, Lecturer, Academic)',
  'Business & Management',
  'Engineering & Technology',
  'Health & Medicine',
  'Science & Research',
  'Law & Policy',
  'Environment & Sustainability',
  'Arts, Design & Creative Fields',
  'Media & Communications',
  'Social Sciences & Humanities',
  'IT & Software Development',
  'Government & Public Sector',
  'Hospitality, Travel & Tourism',
  'Skilled Trades (e.g., Electrician, Plumber, Mechanic)',
  'Retail, Sales & Customer Service',
  'Logistics, Transport & Delivery',
  'Home & Caregiving (e.g., Stay-at-home parent, Care worker)',
  'Currently Unemployed or Exploring Options',
  'Prefer Not to Say',
];

const genders = [
  'Male',
  'Female',
  'Non-binary',
  'Prefer not to say',
];

const cities = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Berlin',
  'Paris',
  'Toronto',
  'Singapore',
  'Dubai',
  'Mumbai',
];

const countries = [
  'United States',
  'United Kingdom',
  'Japan',
  'Australia',
  'Germany',
  'France',
  'Canada',
  'Singapore',
  'United Arab Emirates',
  'India',
];

const ageRanges = [
  '10-20',
  '20-25',
  '25-30',
  '> 30',
];

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    profession: '',
    city: '',
    country: '',
    household: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic validation
    if (!form.name || !form.email || !form.age || !form.gender || !form.profession || !form.city || !form.country || !form.household) {
      setError('Please fill in all fields.');
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (Number(form.household) <= 0) {
      setError('Please enter a valid household size.');
      return;
    }
    setSuccess(true);
    alert('Signup successful!\n' + JSON.stringify(form, null, 2));
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-160px)] flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 py-12 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 space-y-6">
          <h1 className="text-3xl font-bold text-center text-emerald-800 mb-2">Tell Us About Yourself</h1>
          <p className="text-center text-gray-500 mb-6">We'd love to get to know you! What name should we use when we chat about your eco-journey?</p>
          <input name="name" type="text" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required />
          <div>
            <label className="block text-gray-700 mb-1">Stay Connected</label>
            <input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required />
            <span className="text-xs text-gray-400">We respect your privacy and only use this to keep you in the loop!</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Age</label>
            <div className="flex flex-wrap gap-2">
              {ageRanges.map((range) => (
                <label key={range} className="flex items-center space-x-2 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="age"
                    value={range}
                    checked={form.age === range}
                    onChange={handleChange}
                    className="form-radio text-emerald-600"
                    required
                  />
                  <span>{range}</span>
                </label>
              ))}
            </div>
            <span className="text-xs text-gray-400">How many years young are you?</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Identity</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required>
              <option value="">Select...</option>
              {genders.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <span className="text-xs text-gray-400">Your answer helps us understand our community better.</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Work & Lifestyle</label>
            <select name="profession" value={form.profession} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required>
              <option value="">Select...</option>
              {professions.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Neighborhood</label>
            <select name="city" value={form.city} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required>
              <option value="">Select City...</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select name="country" value={form.country} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400 mt-2" required>
              <option value="">Select Country...</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <span className="text-xs text-gray-400">This helps us see local trends in our eco-community.</span>
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Your Tribe at Home</label>
            <input name="household" type="number" min="1" placeholder="e.g. 3" value={form.household} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-400" required />
            <span className="text-xs text-gray-400">Every household is a team effort towards a better planet.</span>
          </div>
          {error && <div className="text-red-500 text-center text-sm">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm">Signup successful!</div>}
          <button type="submit" className="w-full text-white rounded-full py-3 font-bold text-lg shadow transition" style={{ backgroundColor: '#5E1614' }}>Sign Up</button>
        </form>
      </div>
    </Layout>
  );
};

export default Signup; 