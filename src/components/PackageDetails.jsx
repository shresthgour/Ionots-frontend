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

  const handleChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        _id: response.data._id || response.data.booking._id, // Handle different possible response structures
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
      showErrorToast('Booking failed. Please try again.');
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
            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={bookingData.customerName}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={bookingData.email}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={bookingData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              name="numberOfTravelers"
              min="1"
              value={bookingData.numberOfTravelers}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded"
            />
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