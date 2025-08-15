export function Button({ children, size = "md", variant = "solid", ...props }) {
  const base =
    "rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:button-hover disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
  };
  const variants = {
    solid:
      "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md",
    link: "bg-transparent text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3",
  };
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} `}
      {...props}
    >
      {children}
    </button>
  );
}
