

'use client';
import styles from '../../public/BouncingLoader.module.css';

export  function BouncingLoader() {

  return (
   <div className="flex flex-col items-center gap-4">
      <div className="">
      {/* Animated Profer Text */}
      <h1 className="text-6xl font-extrabold flex space-x-2">
        <span className="letter text-[#211E36]" style={{ animationDelay: "0s" }}>P</span>
        <span className="letter text-[#211E36]" style={{ animationDelay: "0.1s" }}>r</span>
        <span className="letter text-[#211E36]" style={{ animationDelay: "0.2s" }}>o</span>
        <span className="letter text-[#211E36]" style={{ animationDelay: "0.3s" }}>f</span>
        <span className="letter text-[#211E36]" style={{ animationDelay: "0.4s" }}>e</span>
        <span className="letter text-[#E74C3C]" style={{ animationDelay: "0.5s" }}>r</span>
      </h1>

      {/* Subtitle: Authenticating... */}
      <p className="mt-6 text-lg font-medium text-gray-600 tracking-wide animate-pulse">
        Authenticating<span className="dots">...</span>
      </p>

      <style jsx>{`
        /* Wave animation for letters */
        @keyframes wave {
          0% { transform: translateY(0) scale(1); text-shadow: 0 0 0px rgba(0,0,0,0); }
          25% { transform: translateY(-20px) scale(1.2); text-shadow: 0 8px 15px rgba(0,0,0,0.2); }
          50% { transform: translateY(0) scale(1); text-shadow: 0 0 10px rgba(231,76,60,0.4); }
          75% { transform: translateY(5px) scale(0.95); text-shadow: 0 2px 6px rgba(0,0,0,0.1); }
          100% { transform: translateY(0) scale(1); text-shadow: 0 0 0px rgba(0,0,0,0); }
        }
        .letter {
          display: inline-block;
          animation: wave 1.2s ease-in-out infinite;
        }

        /* Dots animation for Authenticating... */
        @keyframes dots {
          0%, 20% { content: ""; }
          40% { content: "."; }
          60% { content: ".."; }
          80%, 100% { content: "..."; }
        }
        .dots::after {
          display: inline-block;
          animation: dots 1.5s steps(1, end) infinite;
          content: "...";
        }
      `}</style>
    </div>
    </div>
  );
}
