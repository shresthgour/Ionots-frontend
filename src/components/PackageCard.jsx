import React from 'react';
import { Link } from 'react-router-dom';

const PackageCard = ({ pkg }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <img 
        src={pkg.imageUrl} 
        alt={pkg.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{pkg.title}</h2>
        <p className="text-gray-600 mb-4">{pkg.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-600 font-semibold">
            ${pkg.price.toFixed(2)} per person
          </span>
          <Link 
            to={`/packages/${pkg._id}`} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;