import { useState } from "react";

function LookupSearchBar({ onSearch }) {
  const [value, setValue] = useState("");

  function handleChange(e) {
    const inputValue = e.target.value;
    setValue(inputValue);

    if (inputValue.toLowerCase().includes("token")) {
      const match = inputValue.match(/token[^A-Za-z0-9]*([A-Za-z0-9]{6})/i);

      if (match) {
        const token = match[1];
        setValue(token);
        onSearch(token);
        return;
      }
    }

    onSearch(inputValue);
  }

  return (
    <div className="lookup-searchbar">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by name, company, email, or token"
        className="lookup-input"
      />
    </div>
  );
}

export default LookupSearchBar;