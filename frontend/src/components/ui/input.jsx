export const Input = ({
  name,
  value,
  onChange,
  placeholder,
  className = "",
}) => {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 px-3 py-2 rounded-md w-full ${className}`}
    />
  );
};
