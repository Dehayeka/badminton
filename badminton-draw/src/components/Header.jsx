import React from 'react';
import { Users } from 'lucide-react';

export default function Header() {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <Users className="text-blue-600" size={32} />
      <h1 className="text-3xl font-bold text-gray-800">
        Pengacak Bagan Badminton
      </h1>
    </div>
  );
}