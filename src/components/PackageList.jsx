import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../api/axiosConfig';
import PackageCard from './PackageCard';
import { useToast } from '../context/ToastContext';

const PackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showErrorToast } = useToast();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axiosInstance.get('/packages');
        setPackages(response.data);
        setLoading(false);
      } catch (error) {
        showErrorToast('Failed to fetch packages');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Available Tour Packages
      </h1>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {packages.map(pkg => (
          <PackageCard key={pkg._id} pkg={pkg} />
        ))}
      </div>
    </div>
  );
};

export default PackageList;