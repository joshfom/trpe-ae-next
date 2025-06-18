import React from 'react';

const LuxeHero: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[calc(100vh-220px)]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40 sm:bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-center text-3xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight tracking-wide font-playfair">
          <span className="block">Let Your</span>
          <span className="block">Dream Fine</span>
        </h1>
      </div>
    </div>
  );
};

export default LuxeHero;

