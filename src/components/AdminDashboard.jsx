import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [packageForm, setPackageForm] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    availableDates: [],
    maxTravelers: 50
  });
  const [dateInput, setDateInput] = useState('');

  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { showSuccessToast, showErrorToast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axiosInstance.get('/packages');
      setPackages(response.data);
    } catch (error) {
      showErrorToast('Failed to fetch packages');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPackageForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'maxTravelers'
        ? Number(value)
        : value
    }));
  };

  const handleDateChange = (e) => {
    const inputValue = e.target.value;
    setDateInput(inputValue); // Store the raw input

    // Parse dates
    const dates = inputValue
      .split(/[,\s]+/)
      .filter(date => date.trim() !== '')
      .map(date => {
        const parsedDate = new Date(date.trim());
        return isNaN(parsedDate) ? null : parsedDate;
      })
      .filter(date => date !== null);

    setPackageForm(prev => ({
      ...prev,
      availableDates: dates
    }));
  };

  const openCreateModal = () => {
    setSelectedPackage(null);
    setDateInput('');
    setPackageForm({
      title: '',
      description: '',
      price: '',
      imageUrl: '',
      availableDates: [],
      maxTravelers: 50
    });
    setIsModalOpen(true);
  };

  const openEditModal = (pkg) => {
    setSelectedPackage(pkg);
    // Convert dates to a string for input
    setDateInput(
      pkg.availableDates
        .map(date => new Date(date).toISOString().split('T')[0])
        .join(' ')
    );
    setPackageForm({
      title: pkg.title,
      description: pkg.description,
      price: pkg.price,
      imageUrl: pkg.imageUrl,
      availableDates: pkg.availableDates,
      maxTravelers: pkg.maxTravelers
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPackage) {
        // Update existing package
        await axiosInstance.put(`/admin/packages/${selectedPackage._id}`, packageForm);
        showSuccessToast('Package updated successfully');
      } else {
        // Create new package
        await axiosInstance.post('/admin/packages', packageForm);
        showSuccessToast('Package created successfully');
      }
      fetchPackages();
      setIsModalOpen(false);
    } catch (error) {
      showErrorToast('Failed to save package');
    }
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axiosInstance.delete(`/admin/packages/${packageId}`);
        showSuccessToast('Package deleted successfully');
        fetchPackages();
      } catch (error) {
        showErrorToast('Failed to delete package');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div>
          <button
            onClick={openCreateModal}
            className="bg-green-500 text-white px-4 py-2 rounded mr-4 hover:bg-green-600"
          >
            Create New Package
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <div key={pkg._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={pkg.imageUrl}
              alt={pkg.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
              <p className="text-gray-600 mb-4 truncate">{pkg.description}</p>
              <div className="flex justify-between">
                <span className="text-green-600">${pkg.price.toFixed(2)}</span>
                <div>
                  <button
                    onClick={() => openEditModal(pkg)}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pkg._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {selectedPackage ? 'Edit Package' : 'Create Package'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Package Title"
                value={packageForm.title}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <textarea
                name="description"
                placeholder="Package Description"
                value={packageForm.description}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={packageForm.price}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Image URL"
                value={packageForm.imageUrl}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Available Dates (space or comma-separated, e.g. 2024-07-15 2024-08-20)"
                onChange={handleDateChange}
                value={dateInput}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="maxTravelers"
                placeholder="Max Travelers"
                value={packageForm.maxTravelers}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {selectedPackage ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;