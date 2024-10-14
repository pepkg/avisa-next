export default function AvisaWeb() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Avisa Web</h1>
        <label
          htmlFor="country-select"
          className="block text-lg font-medium text-gray-700"
        >
          A qué país vas:
        </label>
        <select
          id="country-select"
          className="mt-2 p-2 border border-gray-300 rounded"
        >
          <option value="eua">EUA</option>
          <option value="españa">España</option>
          <option value="francia">Francia</option>
        </select>
      </div>
    </div>
  );
}
