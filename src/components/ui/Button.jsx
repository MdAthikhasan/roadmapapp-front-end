export function Button({
  children,
  size = "md",
  variant = "solid",
  ...props
}) {
  const base = "rounded px-4 py-2 font-medium focus:outline-none";
  const sizes = {
    sm: "text-sm px-2 py-1",
    md: "text-base",
  };
  const variants = {
    solid: "bg-blue-600 text-white hover:bg-blue-700",
    link: "bg-transparent text-blue-600 hover:underline",
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
