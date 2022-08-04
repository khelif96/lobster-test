import React, { useState } from "react";

// These text inputs exist in their own contained components and manage their own state.
// This is an important distinction since we don't need to recalculate the entire react tree for the entire page.

export const Input: React.VFC<{ onChange: (input: string) => void }> = ({
  onChange
}) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    onChange(input);
    setInput("");
  };
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleChange}>Add Filter</button>
    </div>
  );
};

export const JumpToLine: React.VFC<{ jump: (line: number) => void }> = ({
  jump
}) => {
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    e.preventDefault();
    setInput("");
    console.log(jump);
    jump?.(Number.parseInt(input, 10));
  };
  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleChange}>Jump To Line</button>
    </div>
  );
};


export const Search: React.VFC<{ onChange: (input: string) => void }> = ({
    onChange
    }) => {
    const [input, setInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        onChange(input);
        setInput("");
    };
    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={handleChange}>Search</button>
        </div>
    );
}
