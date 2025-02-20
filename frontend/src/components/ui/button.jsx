export const Button = ({ children, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
};
