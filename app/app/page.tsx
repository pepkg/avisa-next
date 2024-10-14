export default function AvisaApp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Bienvenido a la app Avisa</h1>
        <form>
          <label
            htmlFor="login"
            className="block text-lg font-medium text-gray-700"
          >
            Login:
          </label>
          <input
            type="text"
            id="login"
            name="login"
            placeholder="Escribe tu usuario"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </form>
      </div>
    </div>
  );
}
