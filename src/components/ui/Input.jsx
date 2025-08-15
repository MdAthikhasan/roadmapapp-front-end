export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 bg-white/50 backdrop-blur-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
        placeholder:text-gray-400 transition-all duration-300
        hover:border-gray-300 ${props.className || ""}`}
    />
  );
}
