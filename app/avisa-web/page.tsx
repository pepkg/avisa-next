export default function AvisaWeb() {
  return (
    <div>
      <h1>Welcome to Avisa Web</h1>
      <label htmlFor="country-select">A qué país vas:</label>
      <select id="country-select">
        <option value="eua">EUA</option>
        <option value="españa">España</option>
        <option value="francia">Francia</option>
      </select>
    </div>
  );
}
