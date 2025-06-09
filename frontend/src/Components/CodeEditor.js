import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = () => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleRun = () => {
    if (!language) {
      setOutput('Please select a programming language to run the code.');
      return;
    }
    if (code.includes('error')) {
      setOutput('Syntax Error: Invalid syntax detected.');
    } else {
      setOutput(`Running ${language} code...\nOutput:\n${code}`);
    }
  };

  const handleSave = () => {
    alert('Code saved successfully!');
    console.log({ title, tags, language, code });
  };

  const handleClear = () => {
    setCode('');
    setInput('');
    setOutput('');
  };

  return (
    <div className="code-editor-container">
     <h1 className="editor-title">Code Editor</h1>
  <form className="editor-form">
    <div className="form-group">
      <label>Title</label>
      <input
        type="text"
        placeholder="Snippet title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Tags</label>
      <input
        type="text"
        placeholder="Enter tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
    </div>
    <div className="form-group">
      <label>Language</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="">Select Language</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
        <option value="java">Java</option>
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>
    </div>
  </form>
      <div className="editor-section">
        <Editor
          height="400px"
          language={language || 'javascript'} // Default to JavaScript if no language is selected
          value={code}
          theme="vs-dark" // Monaco default dark theme
          onChange={(value) => setCode(value || '')}
          options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
            minimap: { enabled: true },
          }}
        />
      </div>
      <div className="input-output-section">
        <div className="input-section">
          <h3>Input</h3>
          <textarea
            placeholder="Enter input here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="output-section">
          <h3>Output</h3>
          <textarea readOnly value={output} />
        </div>
      </div>
      <div className="button-group">
        <button className="run-btn" onClick={handleRun}>
          Run
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;
