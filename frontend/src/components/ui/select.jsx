export const Select = ({ name, onValueChange, children, className = "" }) => {
  return (
    <select
      name={name}
      onChange={(e) => onValueChange(e.target.value)}
      className={`border border-gray-300 px-3 py-2 rounded-md w-full ${className}`}
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
