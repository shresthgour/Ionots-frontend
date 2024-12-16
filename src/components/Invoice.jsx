import React from 'react';
import jsPDF from 'jspdf';

const Invoice = ({ booking }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Company Details
    doc.setFontSize(18);
    doc.text('Travel Adventure Co.', 105, 30, { align: 'center' });
    doc.setFontSize(10);
    doc.text('123 Travel Street, Adventure City', 105, 37, { align: 'center' });
    doc.text('Contact: (123) 123-4567 | travel@example.com', 105, 44, { align: 'center' });
    
    // Invoice Header
    doc.setLineWidth(0.5);
    doc.line(20, 55, 190, 55);
    doc.setFontSize(16);
    doc.text('BOOKING INVOICE', 105, 65, { align: 'center' });
    
    // Booking Details
    doc.setFontSize(10);
    doc.text(`Invoice Number: INV-${booking._id ? booking._id.slice(-8) : 'N/A'}`, 20, 80);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 87);
    
    // Customer Details
    doc.text('Customer Details:', 20, 100);
    doc.text(`Name: ${booking.customerName}`, 20, 107);
    doc.text(`Email: ${booking.customerEmail}`, 20, 114);
    
    // Package Details
    doc.text('Booking Details:', 20, 127);
    doc.text(`Package: ${booking.package.title}`, 20, 134);
    doc.text(`Travelers: ${booking.travelers}`, 20, 141);
    doc.text(`Travel Date: ${new Date().toLocaleDateString()}`, 20, 148);
    
    // Financial Details
    doc.text('Financial Summary:', 20, 161);
    doc.text(`Package Price: $${booking.package.price.toFixed(2)}`, 20, 168);
    doc.text(`Total Travelers: ${booking.travelers}`, 20, 175);
    const subtotal = booking.package.price * booking.travelers;
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 20, 182);
    
    // Total
    doc.setFontSize(12);
    doc.text(`Total Amount: $${subtotal.toFixed(2)}`, 20, 200);
    
    // Footer
    doc.setFontSize(8);
    doc.text('Thank you for choosing Travel Adventure Co.', 105, 280, { align: 'center' });
    
    // Save the PDF
    doc.save(`Invoice-${booking._id ? booking._id.slice(-8) : 'N/A'}.pdf`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Travel Adventure Co.</h1>
        <div>
          <p className="text-sm">
            Invoice Number: INV-{booking._id ? booking._id.slice(-8) : 'N/A'}
          </p>
          <p className="text-sm">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h2 className="font-bold">Customer Details</h2>
          <p>{booking.customerName}</p>
          <p>{booking.customerEmail}</p>
        </div>
        <div className="text-right">
          <h2 className="font-bold">Booking Details</h2>
          <p>{booking.package.title}</p>
          <p>Travelers: {booking.travelers}</p>
          <p>Travel Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <table className="w-full border-collapse mb-6">
        <thead>
          <tr className="bg-blue-100">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2 text-right">Price</th>
            <th className="border p-2 text-right">Quantity</th>
            <th className="border p-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{booking.package.title}</td>
            <td className="border p-2 text-right">${booking.package.price.toFixed(2)}</td>
            <td className="border p-2 text-right">{booking.travelers}</td>
            <td className="border p-2 text-right">
              ${(booking.package.price * booking.travelers).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <button 
          onClick={generatePDF}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Download PDF Invoice
        </button>
        <div className="text-right">
          <p className="text-xl font-bold">
            Total: ${(booking.package.price * booking.travelers).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;