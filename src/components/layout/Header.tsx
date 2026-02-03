// src/components/Layout/Header.tsx
import React from 'react';
import './header.css'

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "User Directory", 
  subtitle = "Manage and explore user data with advanced filtering, sorting, and search capabilities." 
}) => {
  return (
    <header className="bg-transparent pt-8 pb-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-500 text-lg">{subtitle}</p>
      </div>
    </header>
  );
};

export default Header;