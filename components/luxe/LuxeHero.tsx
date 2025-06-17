import React from 'react';

const LuxeHero: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="text-center text-6xl md:text-8xl lg:text-9xl font-bold text-white leading-tight tracking-wide font-playfair">
          Let Your<br />
          Dream Fine
        </h1>
      </div>
    </div>
  );
};

export default LuxeHero;

