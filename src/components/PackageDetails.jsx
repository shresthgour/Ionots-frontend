import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

const PackageDetails = () => {
  const [pkg, setPkg] = useState(null);
  const [bookingData, setBookingData] = useState({
    customerName: '',
    email: '',
    phoneNumber: '',
    numberOfTravelers: 1,
    specialRequests: ''
  });
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axiosInstance.get(`/packages/${id}`);
        setPkg(response.data);
      } catch (error) {
        showErrorToast('Failed to fetch package details');
      }
    };

    fetchPackage();
  }, [id]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear previous errors for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let errorMessages = [];

    // Name validation
    if (!bookingData.customerName.trim()) {
      newErrors.customerName = 'Name is required';
      errorMessages.push('Please provide a valid name');
    }

    // Email validation
    if (!validateEmail(bookingData.email)) {
      newErrors.email = 'Please enter a valid email address';
      errorMessages.push('Invalid email format');
    }

    // Phone number validation
    if (!validatePhoneNumber(bookingData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits';
      errorMessages.push('Phone number must be exactly 10 digits');
    }

    // Number of travelers validation
    if (bookingData.numberOfTravelers < 1) {
      newErrors.numberOfTravelers = 'At least 1 traveler is required';
      errorMessages.push('Minimum 1 traveler required');
    }

    setErrors(newErrors);

    // If there are any errors, show toast with all error messages
    if (errorMessages.length > 0) {
      showErrorToast(errorMessages.join(' | '));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const bookingPayload = {
        packageId: id,
        customerName: bookingData.customerName,
        email: bookingData.email,
        phoneNumber: bookingData.phoneNumber,
        numberOfTravelers: bookingData.numberOfTravelers,
        specialRequests: bookingData.specialRequests
      };
      const response = await axiosInstance.post('/bookings', bookingPayload);
      showSuccessToast('Booking successful!');
      
      // Create a booking object that matches the Invoice component expectations
      const invoiceBooking = {
        _id: response.data._id || response.data.booking._id,
        customerName: bookingData.customerName,
        customerEmail: bookingData.email,
        package: pkg,
        travelers: bookingData.numberOfTravelers,
        travelDate: new Date(),
        totalPrice: pkg.price * bookingData.numberOfTravelers
      };
  
      navigate('/invoice', { 
        state: { 
          booking: invoiceBooking
        } 
      });
    } catch (error) {
      // Handle server-side errors
      const errorMessage = error.response?.data?.message || 'Booking failed. Please try again.';
      showErrorToast(errorMessage);
      console.error(error);
    }
  };

  if (!pkg) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={pkg.imageUrl} 
            alt={pkg.title} 
            className="w-full rounded-lg shadow-lg"
          />
          <h1 className="text-3xl font-bold mt-4">{pkg.title}</h1>
          <p className="text-gray-600 mt-2">{pkg.description}</p>
          <div className="mt-4">
            <span className="text-green-600 font-semibold text-xl">
              ${pkg.price.toFixed(2)} per person
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Book this Package</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                name="customerName"
                placeholder="Full Name"
                value={bookingData.customerName}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded ${errors.customerName ? 'border-red-500' : ''}`}
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={bookingData.email}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number (10 digits)"
                value={bookingData.phoneNumber}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded ${errors.phoneNumber ? 'border-red-500' : ''}`}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            <div>
              <input
                type="number"
                name="numberOfTravelers"
                min="1"
                value={bookingData.numberOfTravelers}
                onChange={handleChange}
                required
                className={`w-full p-2 border rounded ${errors.numberOfTravelers ? 'border-red-500' : ''}`}
              />
              {errors.numberOfTravelers && (
                <p className="text-red-500 text-sm mt-1">{errors.numberOfTravelers}</p>
              )}
            </div>

            <textarea
              name="specialRequests"
              placeholder="Special Requests (Optional)"
              value={bookingData.specialRequests}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />

            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Book Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;