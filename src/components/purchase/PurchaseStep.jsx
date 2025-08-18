import React from 'react';

export default function PurchaseStep({ title, subtitle, children }) {
  return (
    <div className="neumorphic p-8 rounded-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        {subtitle && (
          <p className="text-gray-600">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}