// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Upload, FileText, Shuffle, Copy, Check, RefreshCw, X, Info, List, RotateCcw, Grid, Printer, Scissors, Settings, Award, AlertCircle } from 'lucide-react';

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('generator');

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      {/* Navigation Tabs - Hidden when printing */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('generator')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'generator'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Test Generator
            </button>
            <button
              onClick={() => setActiveTab('answersheet')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'answersheet'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              Answer Sheet
            </button>
            <button
              onClick={() => setActiveTab('grader')}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${
                activeTab === 'grader'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4" />
              MCQ Grader
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto print:p-0 print:m-0 print:w-full print:max-w-none">
        {activeTab === 'generator' && <TestGenerator />}
        {activeTab === 'answersheet' && <AnswerSheetConstructor />}
        {activeTab === 'grader' && <MCQGrader />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 1: TEST GENERATOR ---
function TestGenerator() {
  const [bases, setBases] = useState([
    { id: 1, name: 'Base 1', content: [], count: 0, type: 'file' },
    { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }
  ]);
  const [generatedTest, setGeneratedTest] = useState([]);
  const [isRandomized, setIsRandomized] = useState(true);
  const [isChoiceRandomized, setIsChoiceRandomized] = useState(true);
  const [showPasteModal, setShowPasteModal] = useState(null);
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    // Check for mammoth library on window object
    if (!window.mammoth) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const resetApp = () => {
    if (window.confirm("Are you sure you want to clear all data and start over?")) {
      setBases([
        { id: 1, name: 'Base 1', content: [], count: 0, type: 'file' },
        { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }
      ]);
      setGeneratedTest([]);
      setIsRandomized(true);
      setIsChoiceRandomized(true);
    }
  };

  const shuffleArray = (array) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const parseQuestions = (text) => {
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const questions = [];
    let currentBlock = [];
    let currentBlockType = 'standard';

    const saveBlock = (block, type) => {
      // Filter empty lines to remove gaps
      let content = block.filter(line => line.trim() !== '').join('\n').trim();
      if (type === 'standard') {
        content = content.replace(/([^\n])\s+([A-Ea-e][\.\)]\s)/g, '$1\n$2');
      }
      return content;
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      const isNumStart = /^\s*\d+[\.\)]/.test(line);
      const isSlashStart = trimmed.startsWith('////');

      if (isNumStart || isSlashStart) {
        if (currentBlock.length > 0) {
          questions.push(saveBlock(currentBlock, currentBlockType));
        }
        if (isSlashStart) {
          currentBlockType = 'slash';
          currentBlock = [trimmed]; 
        } else {
          currentBlockType = 'standard';
          // More robust regex to strip numbering like "1.", "1)", "12."
          const cleanLine = line.replace(/^\s*\d+[\.\)]\s*/, '');
          currentBlock = [cleanLine];
        }
      } else {
        if (currentBlock.length > 0) {
          if (currentBlockType === 'slash') {
             currentBlock.push(line);
          } else {
             let processedLine = line;
             if (trimmed.startsWith('///')) {
                processedLine = line.replace(/^\s*\/\/\/\s*/, 'choice. '); 
             } else if (trimmed.startsWith('//')) {
                processedLine = line.replace(/^\s*\/\/\s*/, 'choice. ') + ' *';
             }
             currentBlock.push(processedLine);
          }
        }
      }
    });

    if (currentBlock.length > 0) {
      questions.push(saveBlock(currentBlock, currentBlockType));
    }
    return questions;
  };

  const processTextContent = (text, fileName, id) => {
    const questions = parseQuestions(text);
    setBases(prev => prev.map(base => base.id === id ? { ...base, name: fileName, content: questions } : base));
  };

  const shuffleChoicesInQuestion = (text) => {
    const isSlashQuestion = text.trim().startsWith('////');
    const lines = text.split('\n');
    const questionLines = [];
    const choiceLines = [];

    if (isSlashQuestion) {
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return; 
        if (trimmed.startsWith('////')) {
           questionLines.push(line);
        } else if (trimmed.startsWith('//')) {
           choiceLines.push(line);
        } else {
           questionLines.push(line);
        }
      });

      if (choiceLines.length === 0) return text;
      const shuffledChoices = shuffleArray(choiceLines);
      const cleanQuestion = questionLines.join('\n').trim();
      return [cleanQuestion, ...shuffledChoices].join('\n');

    } else {
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (/^[A-Ea-e][\.\)]\s/.test(line) || line.startsWith('choice.')) {
          choiceLines.push(line);
        } else {
          questionLines.push(line);
        }
      });

      if (choiceLines.length === 0) return text;

      const choicesData = choiceLines.map(line => {
        const isCorrect = line.includes('*');
        const cleanContent = line.replace(/^[A-Ea-e][\.\)]\s+|^choice\.\s+/, '').replace(/\*$/, '').trim();
        return { content: cleanContent, isCorrect };
      });

      const shuffledData = shuffleArray(choicesData);
      const newChoiceLines = shuffledData.map((item, idx) => {
        const prefix = `${String.fromCharCode(65 + idx)}.`;
        return `${prefix} ${item.content}${item.isCorrect ? ' *' : ''}`;
      });

      const cleanQuestion = questionLines.join('\n').trim();
      return [cleanQuestion, ...newChoiceLines].join('\n');
    }
  };

  const generateTest = () => {
    let finalQuestions = [];
    bases.forEach(base => {
      if (base.content.length > 0 && base.count > 0) {
        const shuffledContent = shuffleArray(base.content);
        const selected = shuffledContent.slice(0, base.count);
        finalQuestions = [...finalQuestions, ...selected];
      }
    });

    if (isRandomized) finalQuestions = shuffleArray(finalQuestions);
    if (isChoiceRandomized) finalQuestions = finalQuestions.map(q => shuffleChoicesInQuestion(q));
    setGeneratedTest(finalQuestions);
  };

  const formatOutput = (q, i) => {
    // Always prepend number
    return `${i + 1}. ${q}`;
  };

  const copyToClipboard = () => {
    const text = generatedTest.map((q, i) => formatOutput(q, i)).join('\n\n');
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  const handleFileUpload = (event, id) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.docx')) {
      if (!window.mammoth) {
        alert("Word document parser is loading... please try again in 2 seconds.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          window.mammoth.extractRawText({ arrayBuffer })
            .then((result) => processTextContent(result.value, file.name, id))
            .catch((err) => alert("Error reading Word file."));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          processTextContent(result, file.name, id);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePasteSave = () => {
    if (showPasteModal === null) return;
    const questions = parseQuestions(pasteText);
    setBases(prev => prev.map(base => base.id === showPasteModal ? { ...base, content: questions } : base));
    setShowPasteModal(null);
    setPasteText('');
  };

  const addBase = () => {
    let newNum = bases.length + 1;
    while (bases.some(base => base.name === `Base ${newNum}`)) {
      newNum++;
    }
    setBases([...bases, { id: Date.now(), name: `Base ${newNum}`, content: [], count: 0, type: 'file' }]);
  };

  const removeBase = (id) => setBases(bases.filter(base => base.id !== id));
  
  const updateCount = (id, newCount) => {
    setBases(bases.map(base => base.id === id ? { ...base, count: parseInt(newCount) || 0 } : base));
  };

  return (
    <div className="space-y-8 print:hidden">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Test Generator</h1>
        <p className="text-gray-500">Combine questions from multiple sources.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Source Files (Bases)
          </h2>
          <div className="flex gap-2">
            <button onClick={resetApp} className="flex items-center gap-1 text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors font-medium">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={addBase} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors font-medium">
              <Plus className="w-4 h-4" /> Add Base
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {bases.map((base, index) => (
            <div key={base.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:border-indigo-200 transition-all">
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className="bg-white text-gray-500 text-xs font-mono w-6 h-6 flex items-center justify-center rounded border border-gray-200">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{base.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <span className={base.content.length > 0 ? "text-green-600" : "text-amber-600"}>{base.content.length} qs available</span>
                      <span>•</span>
                      <div className="flex gap-2">
                        <label className="cursor-pointer hover:text-indigo-600 underline">
                          Upload File
                          <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, base.id)} />
                        </label>
                        <span>or</span>
                        <button onClick={() => { setShowPasteModal(base.id); setPasteText(base.content.join('\n\n')); }} className="hover:text-indigo-600 underline">Paste Text</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Amount of qs:</label>
                  <input type="number" min="0" max={base.content.length} value={base.count} onChange={(e) => updateCount(base.id, e.target.value)} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-center" />
                </div>
                <button onClick={() => removeBase(base.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}

          {bases.length === 0 && <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">Click "+ Add Base" to start adding questions.</div>}
          
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg flex items-start gap-2">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p><strong>Supported Formats:</strong></p>
              <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
                <li>Standard: <code>1. Question</code> (Converts to 1, 2, 3...)</li>
                <li>Slash: <code>//// Question</code> (Preserves exact format)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isRandomized} onChange={() => setIsRandomized(!isRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><Shuffle className="w-4 h-4" /> Randomize Order</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm hover:border-indigo-300">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${isChoiceRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${isChoiceRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isChoiceRandomized} onChange={() => setIsChoiceRandomized(!isChoiceRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><List className="w-4 h-4" /> Randomize Choices</span>
          </label>
        </div>

        <button onClick={generateTest} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-indigo-700 active:scale-95 transition-all font-semibold flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5" /> Generate Test
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">Final Test</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Total Questions: <span className="font-semibold text-gray-900">{generatedTest.length}</span></span>
            {generatedTest.length > 0 && (
              <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"><Copy className="w-3.5 h-3.5" /> Copy Text</button>
            )}
          </div>
        </div>
        
        <div className="p-8 flex-1 bg-white relative">
          {generatedTest.length > 0 ? (
            <div className="space-y-6 font-serif text-lg leading-relaxed text-gray-800">
              {generatedTest.map((question, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-bold text-gray-400 select-none w-8 text-right flex-shrink-0">{idx + 1}.</span>
                  <p className="whitespace-pre-wrap">{question}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
              <FileText className="w-24 h-24 mb-4 opacity-20" />
              <p className="text-xl font-medium opacity-40">Your generated test will appear here</p>
              <p className="text-sm opacity-40 mt-2">Add bases and click Generate</p>
            </div>
          )}
        </div>
      </div>

      {showPasteModal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Paste Questions</h3>
              <button onClick={() => setShowPasteModal(null)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-500">Paste your questions below.<br/><span className="text-indigo-600 font-medium">Standard:</span> <code>1. Question</code><br/><span className="text-indigo-600 font-medium">Slash:</span> <code>//// Question</code></p>
              <textarea className="w-full flex-1 min-h-[300px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm" placeholder={`//// Slash Format Question\n// Correct Answer\n/// Incorrect Answer\n\n1. Standard Format Question\nA. Choice 1\nB. Choice 2 *`} value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setShowPasteModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handlePasteSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> Save Questions</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT 2: ANSWER SHEET CONSTRUCTOR ---
function AnswerSheetConstructor() {
  const [numQuestions, setNumQuestions] = useState(20);
  const [numChoices, setNumChoices] = useState(4);
  const [columns, setColumns] = useState(2);
  const sheetRef = useRef(null);

  const choices = Array.from({ length: numChoices }, (_, i) => String.fromCharCode(97 + i));

  // --- SMART LAYOUT CALCULATION ---
  const layout = useMemo(() => {
    // A4 dimensions in mm (minus margins)
    const PAGE_W = 210 - 10; 
    const PAGE_H = 297 - 10; 
    
    // Height estimates (mm)
    const HEADER_H = 22; 
    const ROW_H = 5.2; 
    const TICKET_PAD = 4; 
    
    // Width estimates (mm)
    const NUM_W = 8; 
    const CHOICE_W = 7; 
    const COL_GAP = 3; 

    // Use the explicit column count chosen by the user
    const intCols = columns;

    const rowsPerCol = Math.ceil(numQuestions / intCols);
    
    const ticketW = (intCols * (NUM_W + (numChoices * CHOICE_W))) + ((intCols - 1) * COL_GAP) + TICKET_PAD;
    const ticketH = HEADER_H + (rowsPerCol * ROW_H) + TICKET_PAD;

    // Check if even one ticket fits
    const fitsX = Math.max(1, Math.floor(PAGE_W / ticketW));
    const fitsY = Math.max(1, Math.floor(PAGE_H / ticketH));
    const total = fitsX * fitsY;

    return {
      ticketsPerSheet: total,
      rows: fitsY,
      cols: fitsX,
      internalCols: intCols
    };
  }, [numQuestions, numChoices, columns]);

  // Generate column data for inside the ticket
  const internalColumnData = useMemo(() => {
    const questionsPerColumn = Math.ceil(numQuestions / layout.internalCols);
    return Array.from({ length: layout.internalCols }, (_, colIndex) => {
      const start = colIndex * questionsPerColumn + 1;
      const end = Math.min((colIndex + 1) * questionsPerColumn, numQuestions);
      const numbers = [];
      for (let i = start; i <= end; i++) numbers.push(i);
      return numbers;
    });
  }, [numQuestions, layout.internalCols]);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const copyForGoogleDocs = () => {
    if (!sheetRef.current) return;
    const range = document.createRange();
    range.selectNode(sheetRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    try {
      document.execCommand('copy');
      alert('Answer sheet copied! Paste into Google Docs (Ctrl+V).');
    } catch (err) {
      alert('Failed to copy manually.');
    }
    selection?.removeAllRanges();
  };

  // Styles for the individual ticket
  const ticketStyle = {
    fontSize: '11px',
    headerPadding: '1px 4px',
    cellPadding: '1px',
    numWidth: '15px',
    choiceWidth: '14px',
    border: '1px dashed #ccc',
    margin: '2px'
  };

  // Sub-component for a single answer ticket
  const Ticket = () => (
    <div style={{ border: ticketStyle.border, padding: '5px', boxSizing: 'border-box', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', fontFamily: 'serif', fontSize: ticketStyle.fontSize }}>
        <tbody>
          <tr>
            <td style={{ padding: ticketStyle.headerPadding, width: '70%' }}><strong>Student:</strong> ______________________</td>
            <td style={{ padding: ticketStyle.headerPadding, width: '30%' }}><strong>Group:</strong> ________</td>
          </tr>
        </tbody>
      </table>

      <div style={{ flex: 1, display: 'flex' }}>
        {internalColumnData.map((nums, colIdx) => (
          <div key={colIdx} style={{ flex: 1, padding: '0 2px', borderRight: colIdx < layout.internalCols - 1 ? '1px dashed #ccc' : 'none' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: ticketStyle.fontSize, fontFamily: 'serif' }}>
              <thead>
                <tr style={{ backgroundColor: '#222', color: 'white' }}>
                  <th style={{ border: '1px solid #000', padding: ticketStyle.cellPadding, textAlign: 'center', width: ticketStyle.numWidth }}>#</th>
                  <th style={{ border: '1px solid #000', padding: ticketStyle.cellPadding, textAlign: 'center' }} colSpan={numChoices}>answer</th>
                </tr>
              </thead>
              <tbody>
                {nums.map(num => (
                  <tr key={num}>
                    <td style={{ border: '1px solid #000', padding: ticketStyle.cellPadding, fontWeight: 'bold', textAlign: 'center' }}>{num}.</td>
                    {choices.map(choice => (
                      <td key={choice} style={{ border: '1px solid #000', padding: ticketStyle.cellPadding, textAlign: 'center', width: ticketStyle.choiceWidth }}>{choice}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <style>
        {`
          @media print {
            @page { 
              size: A4; 
              margin: 0mm; 
            }
            body {
              visibility: hidden;
            }
            #answer-sheet-container {
              visibility: visible !important;
              position: fixed;
              left: 0;
              top: 0;
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 5mm;
              background: white;
              z-index: 9999;
            }
            #answer-sheet-container * {
              visibility: visible !important;
            }
            .print\\:hidden { 
              display: none !important; 
            }
          }
        `}
      </style>

      {/* Header (Hidden on Print) */}
      <div className="text-center space-y-2 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900">Answer Sheet Constructor</h1>
        <p className="text-gray-500">Auto-optimized for A4 paper efficiency.</p>
      </div>

      {/* Control Panel (Hidden on Print) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-wrap gap-6 items-end justify-center print:hidden">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Questions</label>
          <input 
            type="number" min="1" max="200"
            value={numQuestions} 
            onChange={(e) => setNumQuestions(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Choices per Q</label>
          <select 
            value={numChoices} 
            onChange={(e) => setNumChoices(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={3}>3 (a-c)</option>
            <option value={4}>4 (a-d)</option>
            <option value={5}>5 (a-e)</option>
            <option value={6}>6 (a-f)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Columns</label>
          <select 
            value={columns} 
            onChange={(e) => setColumns(Number(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value={1}>1 Column</option>
            <option value={2}>2 Columns</option>
            <option value={3}>3 Columns</option>
            <option value={4}>4 Columns</option>
          </select>
        </div>

        {/* Layout Info */}
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>Fitting {layout.ticketsPerSheet} tickets ({layout.rows}x{layout.cols})</span>
        </div>

        <div className="flex gap-2">
          <button onClick={copyForGoogleDocs} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button onClick={handlePrint} className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>
      </div>

      {/* Preview Area / Print Target */}
      <div className="flex justify-center bg-gray-200 p-8 overflow-auto print:bg-white print:p-0">
        <div 
          id="answer-sheet-container"
          ref={sheetRef}
          className="bg-white shadow-2xl mx-auto text-black"
          style={{ 
            width: '210mm', 
            minHeight: '297mm',
            boxSizing: 'border-box',
            padding: '5mm',
            display: 'block'
          }}
        >
          {/* Master Grid Table - Using tables for better copy/paste compatibility */}
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', border: 'none' }}>
            <tbody>
              {Array.from({ length: layout.rows }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: layout.cols }).map((_, colIdx) => {
                    const ticketIndex = rowIdx * layout.cols + colIdx;
                    return (
                      <td key={colIdx} style={{ 
                        width: `${100 / layout.cols}%`, 
                        height: `${100 / layout.rows}%`, 
                        padding: '2mm', 
                        verticalAlign: 'top',
                      }}>
                        {ticketIndex < layout.ticketsPerSheet && <Ticket />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: '2mm', width: '100%', textAlign: 'center', color: '#ccc', fontSize: '8px' }}>
            {layout.ticketsPerSheet} Tickets on A4 | 11px font | {numQuestions} Questions
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 3: MCQ GRADER ---
function MCQGrader() {
  const [answerKey, setAnswerKey] = useState('');
  const [studentInput, setStudentInput] = useState('');
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({ average: 0, highest: 0, total: 0 });

  useEffect(() => {
    if (!answerKey) {
      setResults([]);
      setStats({ average: 0, highest: 0, total: 0 });
      return;
    }

    const cleanKey = answerKey.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const lines = studentInput.split('\n');
    
    const processedResults = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        const parts = line.split(/\s+/);
        let answersRaw = parts[parts.length - 1];
        let name = parts.length > 1 ? parts.slice(0, -1).join(' ') : `Student ${index + 1}`;
        
        const answers = answersRaw.toUpperCase().replace(/[^A-Z0-9]/g, '');
        
        let score = 0;
        const comparison = [];
        
        for (let i = 0; i < cleanKey.length; i++) {
          const keyChar = cleanKey[i];
          const studentChar = answers[i] || '-';
          const isCorrect = keyChar === studentChar;
          
          if (isCorrect) score++;
          
          comparison.push({
            index: i + 1,
            keyChar,
            studentChar,
            isCorrect
          });
        }

        const percentage = cleanKey.length > 0 ? Math.round((score / cleanKey.length) * 100) : 0;

        return {
          id: index,
          name,
          originalLine: line,
          answers,
          score,
          percentage,
          comparison,
          totalQuestions: cleanKey.length
        };
      });

    setResults(processedResults);

    if (processedResults.length > 0) {
      const totalScore = processedResults.reduce((acc, curr) => acc + curr.score, 0);
      const maxScore = Math.max(...processedResults.map(r => r.score));
      setStats({
        average: (totalScore / processedResults.length).toFixed(1),
        highest: maxScore,
        total: processedResults.length
      });
    }

  }, [answerKey, studentInput]);

  const handleClear = () => {
    setStudentInput('');
    setAnswerKey('');
  };

  const copyResults = () => {
    const text = results.map(r => `${r.name}\t${r.score}/${r.totalQuestions}\t${r.percentage}%`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">MCQ Grader</h1>
        <p className="text-gray-500">Manual entry quick-grading tool.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
        <div></div>
        {results.length > 0 && (
          <div className="flex gap-4 text-sm font-medium bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Students</span>
              <span className="text-lg">{stats.total}</span>
            </div>
            <div className="w-px bg-gray-200 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Avg Score</span>
              <span className="text-lg text-indigo-600">{stats.average}</span>
            </div>
            <div className="w-px bg-gray-200 mx-2"></div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase tracking-wider">Best</span>
              <span className="text-lg text-green-600">{stats.highest}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Step 1: Answer Key */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">1. Answer Key</h2>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600">
                {answerKey ? answerKey.length : 0} Questions
              </span>
            </div>
            <div className="p-4">
              <input 
                type="text" 
                value={answerKey}
                onChange={(e) => setAnswerKey(e.target.value.toUpperCase())}
                placeholder="e.g. AAACBCAD"
                className="w-full text-2xl font-mono tracking-widest p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none uppercase placeholder:tracking-normal placeholder:text-base placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the correct sequence of answers.
              </p>
            </div>
          </div>

          {/* Step 2: Student Data */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">2. Student Responses</h2>
              <button onClick={handleClear} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex-1 p-0 relative">
              <textarea 
                value={studentInput}
                onChange={(e) => setStudentInput(e.target.value)}
                placeholder={`Format examples:\nAAACBCAD\nJohn AAACBCAD\nSmith A A A C B C A D`}
                className="w-full h-full p-4 font-mono text-sm resize-none focus:ring-0 border-none outline-none"
                spellCheck={false}
              />
            </div>
          </div>

        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
              <h2 className="font-semibold text-gray-700">3. Results</h2>
              {results.length > 0 && (
                <button onClick={copyResults} className="text-xs flex items-center gap-1 bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50 transition-colors">
                  <Copy className="w-3 h-3" /> Copy Summary
                </button>
              )}
            </div>

            <div className="p-4 space-y-4">
              {!answerKey ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <AlertCircle className="w-12 h-12 mb-2 opacity-20" />
                  <p>Enter an answer key to start grading.</p>
                </div>
              ) : results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <RefreshCw className="w-12 h-12 mb-2 opacity-20" />
                  <p>Enter student results to see grades.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            {/* ADDED: Test Number Indicator */}
                            <span className="text-gray-400 font-normal mr-2">#{result.id + 1}</span>
                            {result.name}
                          </h3>
                          <div className="text-xs text-gray-500 font-mono mt-1 tracking-wider opacity-70 truncate max-w-[200px]">
                            {result.answers}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-indigo-600">
                            {result.score}<span className="text-sm text-gray-400 font-normal">/{result.totalQuestions}</span>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${
                            result.percentage >= 80 ? 'bg-green-100 text-green-700' :
                            result.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {result.percentage}%
                          </div>
                        </div>
                      </div>

                      {/* Visual Strip */}
                      <div className="flex flex-wrap gap-1">
                        {result.comparison.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center group relative">
                            <div 
                              className={`
                                w-6 h-8 flex items-center justify-center rounded text-xs font-bold select-none cursor-help
                                ${item.isCorrect 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-red-500 text-white'
                                }
                                ${item.studentChar === '-' ? 'opacity-50' : ''}
                              `}
                            >
                              {item.studentChar}
                            </div>
                            
                            {/* Tooltip on hover showing expected answer */}
                            {!item.isCorrect && (
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                Exp: {item.keyChar}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}