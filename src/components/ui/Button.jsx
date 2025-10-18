export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button' }) {
  let baseClasses = "px-4 py-2 rounded-lg transition font-medium";
  
  switch (variant) {
    case 'primary': 
      baseClasses += " bg-blue-600 text-white hover:bg-blue-700 shadow-sm";
      break;
    case 'secondary': 
      baseClasses += " border border-gray-300 text-gray-700 hover:bg-gray-50";
      break;
    case 'danger':
      baseClasses += " bg-red-600 text-white hover:bg-red-700 shadow-sm";
      break;
    case 'outline-danger': 
      baseClasses += " border border-red-500 text-red-700 hover:bg-red-50";
      break;
    case 'link':
      baseClasses = "text-sm text-blue-600 hover:text-blue-700 font-medium";
      break;
    default:
      baseClasses += " bg-blue-600 text-white hover:bg-blue-700";
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
}