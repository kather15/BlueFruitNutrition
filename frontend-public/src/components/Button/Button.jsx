const Button = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`bg-slate-800 hover:bg-slate-900 text-white py-3 px-6 rounded-lg font-medium transition-colors ${className}`}
  >
    {children}
  </button>
);

export default Button;
