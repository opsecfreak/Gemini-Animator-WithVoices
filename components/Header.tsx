
import React from 'react';
import { FilmIcon } from './icons/FilmIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mb-8">
      <div className="flex items-center justify-center space-x-3">
        <FilmIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          AI Video Animator
        </h1>
      </div>
      <p className="text-center text-gray-400 mt-2">
        Turn your ideas into captivating animations with the power of AI.
      </p>
    </header>
  );
};

export default Header;
