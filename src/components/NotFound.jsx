export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-[200px] font-extrabold text-red-600 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Oops! You took a wrong turn. 🧭
      </h2>
      <p className="text-gray-600 max-w-sm mb-6">
        Either this page doesn’t exist, or you tried sneaking into a
        **restricted area** without the right WiFi. <br />
        <span className="italic">Nice try though! 😏</span>
      </p>
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-gradient-to-r from-[#6D0C22] to-[#0E386B] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
      >
        ⬅️ Go Back Home
      </button>
    </div>
  );
}
