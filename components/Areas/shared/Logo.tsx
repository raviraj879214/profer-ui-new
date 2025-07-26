


export function Logo({ isFooter = false }) {
  return (
    <div className={`flex items-center space-x-2 ${isFooter ? "text-white" : ""}`}>
     
      <img
        src="/images/logo.png"
        alt="Secondary Logo"
        className="h-18 w-auto object-contain"
      />
    </div>
  );
}
