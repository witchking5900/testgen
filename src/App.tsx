// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Trash2, Upload, FileText, Shuffle, Copy, Check, RefreshCw, X, Info, List, RotateCcw, Grid, Printer, Scissors, Settings, Award, AlertCircle, BarChart, Activity, Globe, Slash, Hash } from 'lucide-react';

// --- TRANSLATION DICTIONARY ---
const TRANSLATIONS = {
  en: {
    // Navigation
    nav_generator: "Test Generator",
    nav_answersheet: "Answer Sheet",
    nav_grader: "MCQ Grader",
    lang_toggle: "ქართული",
    
    // Test Generator
    gen_title: "Test Generator",
    gen_subtitle: "Combine questions from multiple sources.",
    gen_bases: "Source Files (Bases)",
    gen_reset: "Reset",
    gen_add: "Add Base",
    gen_amount: "Amount of qs:",
    gen_empty: "Click '+ Add Base' to start adding questions.",
    gen_upload: "Upload File",
    gen_paste: "Paste Text",
    gen_rand_order: "Randomize Order",
    gen_rand_choices: "Randomize Choices",
    gen_numbering: "Show Numbering",
    gen_btn: "Generate Test",
    gen_final: "Final Test",
    gen_total: "Total Questions:",
    gen_copy: "Copy Text",
    gen_paste_title: "Paste Questions",
    gen_paste_desc: "Paste your questions below.",
    gen_cancel: "Cancel",
    gen_save: "Save Questions",
    
    // Answer Sheet
    sheet_title: "Answer Sheet Constructor",
    sheet_subtitle: "Auto-optimized for A4 paper efficiency.",
    sheet_total: "Total Questions",
    sheet_choices: "Choices per Q",
    sheet_cols: "Columns",
    sheet_col_1: "1 Column",
    sheet_col_2: "2 Columns",
    sheet_col_3: "3 Columns",
    sheet_col_4: "4 Columns",
    sheet_fitting: "Fitting",
    sheet_tickets: "tickets",
    sheet_btn_copy: "Copy",
    sheet_btn_print: "Print",
    sheet_student: "Student:",
    sheet_group: "Group:",
    sheet_ans: "answer",
    
    // Grader & Analytics
    grad_title: "MCQ Grader & Analytics",
    grad_subtitle: "Multi-version grading and item difficulty analysis.",
    grad_report_btn: "View Statistical Report",
    grad_step1: "1. Answer Keys (Multi-Version)",
    grad_step2: "2. Student Responses",
    grad_step3: "3. Grading Results",
    grad_clear: "Clear",
    grad_empty_keys: "Enter at least one answer key to start grading.",
    grad_empty_stud: "Enter student results to see grades.",
    grad_perfect: "Perfect Score",
    grad_wrong: "Wrong:",
    grad_students: "Students",
    grad_avg: "Avg Score",
    grad_best: "Highest",
    
    // Report
    rep_title: "Statistical Analysis Report",
    rep_back: "Back to Grader",
    rep_print: "Print Report",
    rep_version: "Test Version:",
    rep_q: "Q#",
    rep_ans: "Correct Ans",
    rep_rate: "Difficulty (Success %)",
    rep_disc: "Discrimination (D)",
    rep_analysis: "Action Matrix Verdict",
    rep_toxic: "Toxic Trap (D < 0) - PURGE",
    rep_elite: "Elite (Hard but Fair) - KEEP",
    rep_workhorse: "Workhorse (Good D) - KEEP",
    rep_freebie: "Freebie (Too Easy) - REVIEW",
    rep_std: "Standard / Marginal",
    rep_nodata: "Not enough data",
    rep_void_badge: "VOIDED - Excluded from stats",
    tooltip_void: "Voided: +1 Free Point",
    tooltip_exp: "Exp:"
  },
  ka: {
    // Navigation
    nav_generator: "ტესტის გენერატორი",
    nav_answersheet: "პასუხების ფურცელი",
    nav_grader: "MCQ შემფასებელი",
    lang_toggle: "English",
    
    // Test Generator
    gen_title: "ტესტის გენერატორი",
    gen_subtitle: "შეაერთეთ კითხვები სხვადასხვა წყაროდან.",
    gen_bases: "წყაროს ფაილები (ბაზები)",
    gen_reset: "გადატვირთვა",
    gen_add: "ბაზის დამატება",
    gen_amount: "კითხვების რ-ბა:",
    gen_empty: "დააჭირეთ '+ ბაზის დამატება'-ს კითხვების დასამატებლად.",
    gen_upload: "ფაილის ატვირთვა",
    gen_paste: "ტექსტის ჩასმა",
    gen_rand_order: "რიგითობის არევა",
    gen_rand_choices: "პასუხების არევა",
    gen_numbering: "ნუმერაცია",
    gen_btn: "ტესტის გენერირება",
    gen_final: "საბოლოო ტესტი",
    gen_total: "სულ კითხვა:",
    gen_copy: "ტექსტის კოპირება",
    gen_paste_title: "კითხვების ჩასმა",
    gen_paste_desc: "ჩასვით თქვენი კითხვები ქვემოთ.",
    gen_cancel: "გაუქმება",
    gen_save: "შენახვა",
    
    // Answer Sheet
    sheet_title: "ფურცლის კონსტრუქტორი",
    sheet_subtitle: "ავტომატურად ოპტიმიზირებული A4 ფორმატისთვის.",
    sheet_total: "სულ კითხვა",
    sheet_choices: "პასუხი კითხვაზე",
    sheet_cols: "სვეტები",
    sheet_col_1: "1 სვეტი",
    sheet_col_2: "2 სვეტი",
    sheet_col_3: "3 სვეტი",
    sheet_col_4: "4 სვეტი",
    sheet_fitting: "ეტევა",
    sheet_tickets: "ბილეთი",
    sheet_btn_copy: "კოპირება",
    sheet_btn_print: "ბეჭდვა",
    sheet_student: "სტუდენტი:",
    sheet_group: "ჯგუფი:",
    sheet_ans: "პასუხი",
    
    // Grader & Analytics
    grad_title: "MCQ შემფასებელი და ანალიტიკა",
    grad_subtitle: "მრავალ-ვერსიიანი შეფასება და სირთულის ანალიზი.",
    grad_report_btn: "სტატისტიკური რეპორტი",
    grad_step1: "1. პასუხების გასაღები (მრავალ-ვერსიიანი)",
    grad_step2: "2. სტუდენტების პასუხები",
    grad_step3: "3. შეფასების შედეგები",
    grad_clear: "გასუფთავება",
    grad_empty_keys: "შეიყვანეთ მინიმუმ ერთი გასაღები შესაფასებლად.",
    grad_empty_stud: "შეიყვანეთ სტუდენტების შედეგები.",
    grad_perfect: "უმაღლესი ქულა",
    grad_wrong: "არასწორი:",
    grad_students: "სტუდენტი",
    grad_avg: "საშ. ქულა",
    grad_best: "უმაღლესი",
    
    // Report
    rep_title: "სტატისტიკური ანალიზის რეპორტი",
    rep_back: "უკან დაბრუნება",
    rep_print: "რეპორტის ბეჭდვა",
    rep_version: "ტესტის ვერსია:",
    rep_q: "კ#",
    rep_ans: "სწორი პასუხი",
    rep_rate: "სირთულე (წარმატების %)",
    rep_disc: "დისკრიმინაცია (D)",
    rep_analysis: "მატრიცის ვერდიქტი",
    rep_toxic: "ტოქსიკური ხაფანგი (D < 0) - წაშალეთ",
    rep_elite: "ელიტური (რთული მაგრამ სამართლიანი) - დატოვეთ",
    rep_workhorse: "იდეალური (კარგი D) - დატოვეთ",
    rep_freebie: "ზედმეტად მარტივი - გადახედეთ",
    rep_std: "სტანდარტული / ზღვრული",
    rep_nodata: "არასაკმარისი მონაცემი",
    rep_void_badge: "გაუქმებულია - სტატისტიკის გარეშე",
    tooltip_void: "გაუქმებულია: +1 ქულა",
    tooltip_exp: "სწორი:"
  }
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('generator');
  const [lang, setLang] = useState('en');

  const t = (key) => TRANSLATIONS[lang][key] || key;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8 overflow-x-auto">
              <button onClick={() => setActiveTab('generator')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'generator' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <FileText className="w-4 h-4" /> {t('nav_generator')}
              </button>
              <button onClick={() => setActiveTab('answersheet')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'answersheet' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Grid className="w-4 h-4" /> {t('nav_answersheet')}
              </button>
              <button onClick={() => setActiveTab('grader')} className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === 'grader' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Award className="w-4 h-4" /> {t('nav_grader')}
              </button>
            </div>
            
            <button onClick={() => setLang(lang === 'en' ? 'ka' : 'en')} className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors border border-transparent hover:border-gray-200">
              <Globe className="w-4 h-4" /> {t('lang_toggle')}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-5xl mx-auto print:p-0 print:m-0 print:w-full print:max-w-none">
        {activeTab === 'generator' && <TestGenerator t={t} />}
        {activeTab === 'answersheet' && <AnswerSheetConstructor t={t} />}
        {activeTab === 'grader' && <MCQGrader t={t} />}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 1: TEST GENERATOR ---
function TestGenerator({ t }) {
  const [bases, setBases] = useState([{ id: 1, name: 'Base 1', content: [], count: 0, type: 'file' }, { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }]);
  const [generatedTest, setGeneratedTest] = useState([]);
  const [isRandomized, setIsRandomized] = useState(true);
  const [isChoiceRandomized, setIsChoiceRandomized] = useState(true);
  const [showNumbering, setShowNumbering] = useState(true);
  const [showPasteModal, setShowPasteModal] = useState(null);
  const [pasteText, setPasteText] = useState('');

  useEffect(() => {
    if (!window.mammoth) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const resetApp = () => {
    if (window.confirm("Are you sure you want to clear all data and start over?")) {
      setBases([{ id: 1, name: 'Base 1', content: [], count: 0, type: 'file' }, { id: 2, name: 'Base 2', content: [], count: 0, type: 'file' }]);
      setGeneratedTest([]);
      setIsRandomized(true);
      setIsChoiceRandomized(true);
      setShowNumbering(true);
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
      let content = block.filter(line => line.trim() !== '').join('\n').trim();
      if (type === 'standard') content = content.replace(/([^\n])\s+([A-Ea-e][\.\)]\s)/g, '$1\n$2');
      return content;
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      const isNumStart = /^\s*\d+[\.\)]/.test(line);
      const isSlashStart = trimmed.startsWith('////');

      if (isNumStart || isSlashStart) {
        if (currentBlock.length > 0) questions.push(saveBlock(currentBlock, currentBlockType));
        if (isSlashStart) {
          currentBlockType = 'slash';
          currentBlock = [trimmed]; 
        } else {
          currentBlockType = 'standard';
          const cleanLine = line.replace(/^\s*\d+[\.\)]\s*/, '');
          currentBlock = [cleanLine];
        }
      } else {
        if (currentBlock.length > 0) {
          if (currentBlockType === 'slash') currentBlock.push(line);
          else {
             let processedLine = line;
             if (trimmed.startsWith('///')) processedLine = line.replace(/^\s*\/\/\/\s*/, 'choice. '); 
             else if (trimmed.startsWith('//')) processedLine = line.replace(/^\s*\/\/\s*/, 'choice. ') + ' *';
             currentBlock.push(processedLine);
          }
        }
      }
    });

    if (currentBlock.length > 0) questions.push(saveBlock(currentBlock, currentBlockType));
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
        if (trimmed.startsWith('////')) questionLines.push(line);
        else if (trimmed.startsWith('//')) choiceLines.push(line);
        else questionLines.push(line);
      });

      if (choiceLines.length === 0) return text;
      const shuffledChoices = shuffleArray(choiceLines);
      const cleanQuestion = questionLines.join('\n').trim();
      return [cleanQuestion, ...shuffledChoices].join('\n');

    } else {
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        if (/^[A-Ea-e][\.\)]\s/.test(line) || line.startsWith('choice.')) choiceLines.push(line);
        else questionLines.push(line);
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

  const copyToClipboard = () => {
    const text = generatedTest.map((q, i) => showNumbering ? `${i + 1}. ${q}` : q).join('\n\n');
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
      if (!window.mammoth) return alert("Word document parser is loading...");
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          window.mammoth.extractRawText({ arrayBuffer: e.target.result })
            .then((result) => processTextContent(result.value, file.name, id))
            .catch(() => alert("Error reading Word file."));
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') processTextContent(e.target.result, file.name, id);
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
    while (bases.some(base => base.name === `Base ${newNum}`)) newNum++;
    setBases([...bases, { id: Date.now(), name: `Base ${newNum}`, content: [], count: 0, type: 'file' }]);
  };

  return (
    <div className="space-y-8 print:hidden">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t('gen_title')}</h1>
        <p className="text-gray-500">{t('gen_subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-600" />{t('gen_bases')}</h2>
          <div className="flex gap-2">
            <button onClick={resetApp} className="flex items-center gap-1 text-sm bg-red-50 text-red-700 px-3 py-1.5 rounded-lg font-medium"><RotateCcw className="w-4 h-4" /> {t('gen_reset')}</button>
            <button onClick={addBase} className="flex items-center gap-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium"><Plus className="w-4 h-4" /> {t('gen_add')}</button>
          </div>
        </div>

        <div className="space-y-3">
          {bases.map((base, index) => (
            <div key={base.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50">
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex items-center gap-3">
                  <span className="bg-white text-gray-500 text-xs font-mono w-6 h-6 flex items-center justify-center rounded border border-gray-200">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{base.name}</p>
                    <div className="flex gap-2 text-xs text-gray-500 mt-1">
                      <span className={base.content.length > 0 ? "text-green-600" : "text-amber-600"}>{base.content.length} qs</span>
                      <span>•</span>
                      <div className="flex gap-2">
                        <label className="cursor-pointer hover:text-indigo-600 underline">
                          {t('gen_upload')}
                          <input type="file" accept=".txt,.docx" className="hidden" onChange={(e) => handleFileUpload(e, base.id)} />
                        </label>
                        <span>or</span>
                        <button onClick={() => { setShowPasteModal(base.id); setPasteText(base.content.join('\n\n')); }} className="hover:text-indigo-600 underline">{t('gen_paste')}</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">{t('gen_amount')}</label>
                  <input type="number" min="0" max={base.content.length} value={base.count} onChange={(e) => setBases(bases.map(b => b.id === base.id ? { ...b, count: parseInt(e.target.value) || 0 } : b))} className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-center" />
                </div>
                <button onClick={() => setBases(bases.filter(b => b.id !== base.id))} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
          {bases.length === 0 && <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">{t('gen_empty')}</div>}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isRandomized} onChange={() => setIsRandomized(!isRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><Shuffle className="w-4 h-4" /> {t('gen_rand_order')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${isChoiceRandomized ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${isChoiceRandomized ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={isChoiceRandomized} onChange={() => setIsChoiceRandomized(!isChoiceRandomized)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><List className="w-4 h-4" /> {t('gen_rand_choices')}</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-200 ${showNumbering ? 'bg-indigo-600' : 'bg-gray-300'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${showNumbering ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input type="checkbox" checked={showNumbering} onChange={() => setShowNumbering(!showNumbering)} className="hidden" />
            <span className="text-sm font-medium text-gray-700 uppercase tracking-wide flex items-center gap-2"><Hash className="w-4 h-4" /> {t('gen_numbering')}</span>
          </label>
        </div>
        <button onClick={generateTest} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg shadow-md font-semibold flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" /> {t('gen_btn')}</button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col min-h-[500px]">
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">{t('gen_final')}</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{t('gen_total')} <span className="font-semibold text-gray-900">{generatedTest.length}</span></span>
            {generatedTest.length > 0 && <button onClick={copyToClipboard} className="flex items-center gap-1.5 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded"><Copy className="w-3.5 h-3.5" /> {t('gen_copy')}</button>}
          </div>
        </div>
        <div className="p-8 flex-1 bg-white relative">
          {generatedTest.length > 0 ? (
            <div className="space-y-6 font-serif text-lg leading-relaxed text-gray-800">
              {generatedTest.map((question, idx) => (
                <div key={idx} className="flex gap-4">
                  {showNumbering && <span className="font-bold text-gray-400 select-none w-8 text-right flex-shrink-0">{idx + 1}.</span>}
                  <p className="whitespace-pre-wrap">{question}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none">
              <FileText className="w-24 h-24 mb-4 opacity-20" />
            </div>
          )}
        </div>
      </div>

      {showPasteModal !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">{t('gen_paste_title')}</h3>
              <button onClick={() => setShowPasteModal(null)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-2">
              <p className="text-sm text-gray-500">{t('gen_paste_desc')}</p>
              <textarea className="w-full flex-1 min-h-[300px] p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm" value={pasteText} onChange={(e) => setPasteText(e.target.value)} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
              <button onClick={() => setShowPasteModal(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">{t('gen_cancel')}</button>
              <button onClick={handlePasteSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> {t('gen_save')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT 2: ANSWER SHEET CONSTRUCTOR ---
function AnswerSheetConstructor({ t }) {
  const [numQuestions, setNumQuestions] = useState(20);
  const [numChoices, setNumChoices] = useState(4);
  const [columns, setColumns] = useState(2);
  const sheetRef = useRef(null);

  const choices = Array.from({ length: numChoices }, (_, i) => String.fromCharCode(97 + i));

  const layout = useMemo(() => {
    const PAGE_W = 210 - 10; 
    const PAGE_H = 297 - 10; 
    const HEADER_H = 22; 
    const ROW_H = 5.2; 
    const TICKET_PAD = 4; 
    const NUM_W = 8; 
    const CHOICE_W = 7; 
    const COL_GAP = 3; 

    const intCols = columns;
    const rowsPerCol = Math.ceil(numQuestions / intCols);
    
    const ticketW = (intCols * (NUM_W + (numChoices * CHOICE_W))) + ((intCols - 1) * COL_GAP) + TICKET_PAD;
    const ticketH = HEADER_H + (rowsPerCol * ROW_H) + TICKET_PAD;

    const fitsX = Math.max(1, Math.floor(PAGE_W / ticketW));
    const fitsY = Math.max(1, Math.floor(PAGE_H / ticketH));
    const total = fitsX * fitsY;

    return { ticketsPerSheet: total, rows: fitsY, cols: fitsX, internalCols: intCols };
  }, [numQuestions, numChoices, columns]);

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

  const copyForGoogleDocs = () => {
    if (!sheetRef.current) return;
    const range = document.createRange();
    range.selectNode(sheetRef.current);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    try { document.execCommand('copy'); alert('Copied!'); } catch (err) { alert('Failed to copy manually.'); }
    selection?.removeAllRanges();
  };

  const ticketStyle = { fontSize: '11px', headerPadding: '1px 4px', cellPadding: '1px', numWidth: '15px', choiceWidth: '14px', border: '1px dashed #ccc', margin: '2px' };

  const Ticket = () => (
    <div style={{ border: ticketStyle.border, padding: '5px', boxSizing: 'border-box', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <table style={{ width: '100%', marginBottom: '4px', borderCollapse: 'collapse', fontFamily: 'serif', fontSize: ticketStyle.fontSize }}>
        <tbody>
          <tr>
            <td style={{ padding: ticketStyle.headerPadding, width: '70%' }}><strong>{t('sheet_student')}</strong> ______________________</td>
            <td style={{ padding: ticketStyle.headerPadding, width: '30%' }}><strong>{t('sheet_group')}</strong> ________</td>
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
                  <th style={{ border: '1px solid #000', padding: ticketStyle.cellPadding, textAlign: 'center' }} colSpan={numChoices}>{t('sheet_ans')}</th>
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
      <style>{`@media print { @page { size: A4; margin: 0mm; } body { visibility: hidden; } #answer-sheet-container { visibility: visible !important; position: fixed; left: 0; top: 0; width: 210mm; height: 297mm; margin: 0; padding: 5mm; background: white; z-index: 9999; } #answer-sheet-container * { visibility: visible !important; } .print\\:hidden { display: none !important; } }`}</style>
      <div className="text-center space-y-2 print:hidden">
        <h1 className="text-3xl font-bold text-gray-900">{t('sheet_title')}</h1>
        <p className="text-gray-500">{t('sheet_subtitle')}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-wrap gap-6 items-end justify-center print:hidden">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('sheet_total')}</label>
          <input type="number" min="1" max="200" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('sheet_choices')}</label>
          <select value={numChoices} onChange={(e) => setNumChoices(Number(e.target.value))} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value={3}>3 (a-c)</option><option value={4}>4 (a-d)</option><option value={5}>5 (a-e)</option><option value={6}>6 (a-f)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('sheet_cols')}</label>
          <select value={columns} onChange={(e) => setColumns(Number(e.target.value))} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
            <option value={1}>{t('sheet_col_1')}</option><option value={2}>{t('sheet_col_2')}</option><option value={3}>{t('sheet_col_3')}</option><option value={4}>{t('sheet_col_4')}</option>
          </select>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span>{t('sheet_fitting')} {layout.ticketsPerSheet} {t('sheet_tickets')} ({layout.rows}x{layout.cols})</span>
        </div>
        <div className="flex gap-2">
          <button onClick={copyForGoogleDocs} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"><Copy className="w-4 h-4" /> {t('sheet_btn_copy')}</button>
          <button onClick={() => setTimeout(() => window.print(), 100)} className="bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-colors flex items-center gap-2"><Printer className="w-4 h-4" /> {t('sheet_btn_print')}</button>
        </div>
      </div>

      <div className="flex justify-center bg-gray-200 p-8 overflow-auto print:bg-white print:p-0">
        <div id="answer-sheet-container" ref={sheetRef} className="bg-white shadow-2xl mx-auto text-black" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box', padding: '5mm', display: 'block' }}>
          <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', border: 'none' }}>
            <tbody>
              {Array.from({ length: layout.rows }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  {Array.from({ length: layout.cols }).map((_, colIdx) => {
                    const ticketIndex = rowIdx * layout.cols + colIdx;
                    return (
                      <td key={colIdx} style={{ width: `${100 / layout.cols}%`, height: `${100 / layout.rows}%`, padding: '2mm', verticalAlign: 'top' }}>
                        {ticketIndex < layout.ticketsPerSheet && <Ticket />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ position: 'absolute', bottom: '2mm', width: '100%', textAlign: 'center', color: '#ccc', fontSize: '8px' }}>
            {layout.ticketsPerSheet} Tickets on A4 | 11px font | {numQuestions} Questions
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT 3: MCQ GRADER (REFACTORED WITH D-INDEX & VOIDED Qs) ---
function MCQGrader({ t }) {
  const [keysInput, setKeysInput] = useState('');
  const [studentsInput, setStudentsInput] = useState('');
  const [showReport, setShowReport] = useState(false);

  // Psychometric Thresholds
  const DIFFICULTY_TOO_HARD = 30; 
  const DIFFICULTY_TOO_EASY = 80;

  const parsedKeys = useMemo(() => {
    if (!keysInput.trim()) return {};
    const keys = {};
    keysInput.split('\n').forEach(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return;
      const parts = cleanLine.split(/\s+/);
      if (parts.length >= 2) {
        const version = parts[0].toUpperCase();
        // Allow V (for Voided) and X (for blank guesses) to pass through the regex.
        const answers = parts[parts.length - 1].toUpperCase().replace(/[^A-Z0-9]/g, '');
        keys[version] = answers;
      }
    });
    return keys;
  }, [keysInput]);

  const gradingResults = useMemo(() => {
    if (Object.keys(parsedKeys).length === 0 || !studentsInput.trim()) return [];

    return studentsInput.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((line, index) => {
        const parts = line.split(/\s+/);
        if (parts.length < 3) return { id: index, originalLine: line, error: "Invalid format. Use: [Name] [Version] [Answers]" };

        const answers = parts.pop().toUpperCase().replace(/[^A-Z0-9]/g, '');
        const version = parts.pop().toUpperCase();
        const name = parts.join(' ');

        const key = parsedKeys[version];
        if (!key) return { id: index, name, version, originalLine: line, error: `Key '${version}' not found` };

        let score = 0;
        const comparison = [];
        const wrongQuestionNumbers = [];

        for (let i = 0; i < key.length; i++) {
          const keyChar = key[i];
          const studentChar = answers[i] || '-';
          
          let isCorrect = false;
          let isVoid = keyChar === 'V'; // Trigger the voided state if the key is V

          if (isVoid) {
            isCorrect = true; // Auto-grant the point
            score++;
          } else if (keyChar === studentChar) {
            isCorrect = true;
            score++;
          } else {
            wrongQuestionNumbers.push(i + 1);
          }

          comparison.push({ index: i + 1, keyChar, studentChar, isCorrect, isVoid });
        }

        const percentage = key.length > 0 ? Math.round((score / key.length) * 100) : 0;
        return { id: index, name, version, originalLine: line, answers, score, percentage, comparison, wrongQuestionNumbers, totalQuestions: key.length, error: null };
      });
  }, [parsedKeys, studentsInput]);

  const statistics = useMemo(() => {
    const validResults = gradingResults.filter(r => !r.error);
    const statsByVersion = {};

    Object.keys(parsedKeys).forEach(version => {
      statsByVersion[version] = { 
        totalStudents: 0, 
        averageScore: 0, 
        highestScore: 0, 
        itemStats: Array.from({ length: parsedKeys[version].length }, (_, i) => ({ 
          questionIndex: i + 1, 
          correctCount: 0, 
          expectedAnswer: parsedKeys[version][i], 
          discrimination: null,
          isVoid: parsedKeys[version][i] === 'V'
        })) 
      };
    });

    validResults.forEach(student => {
      const vStats = statsByVersion[student.version];
      if (!vStats) return;
      vStats.totalStudents++;
      vStats.averageScore += student.score;
      if (student.score > vStats.highestScore) vStats.highestScore = student.score;
      student.comparison.forEach((comp, idx) => { 
        // Only count 'correctCount' for statistics if the item is NOT voided.
        if (comp.isCorrect && vStats.itemStats[idx] && !vStats.itemStats[idx].isVoid) {
          vStats.itemStats[idx].correctCount++; 
        }
      });
    });

    // Calculate Item Difficulty and Discrimination Index
    Object.keys(statsByVersion).forEach(version => {
      const vStats = statsByVersion[version];
      const studentsForVersion = validResults.filter(s => s.version === version).sort((a, b) => b.score - a.score);
      const n = studentsForVersion.length;
      
      const canCalculateD = n >= 3;
      const groupSize = Math.max(1, Math.floor(n * 0.33));
      const upperGroup = studentsForVersion.slice(0, groupSize);
      const lowerGroup = studentsForVersion.slice(n - groupSize);

      if (vStats.totalStudents > 0) {
        vStats.averageScore = (vStats.averageScore / vStats.totalStudents).toFixed(1);
        
        vStats.itemStats = vStats.itemStats.map((item, idx) => {
          // If the item is marked as voided ('V'), completely skip the math and flag it.
          if (item.isVoid) {
            return { ...item, percentCorrect: null, discrimination: null, flag: 'VOID' };
          }

          const pValue = Math.round((item.correctCount / vStats.totalStudents) * 100);
          
          let dIndex = null;
          let flag = null;

          if (canCalculateD) {
            const upperCorrect = upperGroup.filter(s => s.comparison[idx].isCorrect).length;
            const lowerCorrect = lowerGroup.filter(s => s.comparison[idx].isCorrect).length;
            const pUpper = upperCorrect / groupSize;
            const pLower = lowerCorrect / groupSize;
            dIndex = parseFloat((pUpper - pLower).toFixed(2));

            // Apply Action Matrix Logic
            if (dIndex < 0 && pValue < DIFFICULTY_TOO_HARD) flag = 'TOXIC';
            else if (dIndex >= 0.25 && pValue < DIFFICULTY_TOO_HARD) flag = 'ELITE';
            else if (dIndex >= 0.25 && pValue >= 40 && pValue <= 80) flag = 'WORKHORSE';
            else if (pValue > DIFFICULTY_TOO_EASY) flag = 'FREEBIE';
          } else {
             // Fallback if not enough students for D-Index
             if (pValue < DIFFICULTY_TOO_HARD) flag = 'HARD';
             if (pValue > DIFFICULTY_TOO_EASY) flag = 'FREEBIE';
          }

          return { ...item, percentCorrect: pValue, discrimination: dIndex, flag };
        });
      }
    });

    return statsByVersion;
  }, [gradingResults, parsedKeys]);

  if (showReport) {
    return (
      <div className="bg-white p-8 max-w-5xl mx-auto rounded-xl shadow-sm print:shadow-none print:p-0">
        <div className="flex justify-between items-center mb-8 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">{t('rep_title')}</h2>
          <div className="flex gap-4">
            <button onClick={() => setShowReport(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">{t('rep_back')}</button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"><Printer className="w-4 h-4" /> {t('rep_print')}</button>
          </div>
        </div>

        <div className="space-y-12">
          {Object.entries(statistics).map(([version, data]) => (
            <div key={version} className="border border-gray-200 rounded-lg overflow-hidden break-inside-avoid">
              <div className="bg-gray-50 border-b border-gray-200 p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{t('rep_version')} {version}</h3>
                <div className="flex gap-4 text-sm">
                  <span className="font-semibold text-gray-600">{t('grad_students')}: <span className="text-gray-900">{data.totalStudents}</span></span>
                  <span className="font-semibold text-gray-600">{t('grad_avg')}: <span className="text-indigo-600">{data.averageScore}</span></span>
                  <span className="font-semibold text-gray-600">{t('grad_best')}: <span className="text-green-600">{data.highestScore}</span></span>
                </div>
              </div>
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-gray-200 text-gray-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold w-16 text-center">{t('rep_q')}</th>
                    <th className="px-4 py-3 font-semibold w-24 text-center">{t('rep_ans')}</th>
                    <th className="px-4 py-3 font-semibold w-32 text-center">{t('rep_rate')}</th>
                    <th className="px-4 py-3 font-semibold w-32 text-center">{t('rep_disc')}</th>
                    <th className="px-4 py-3 font-semibold">{t('rep_analysis')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.itemStats.map((stat) => (
                    <tr key={stat.questionIndex} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-center font-medium text-gray-900">{stat.questionIndex}</td>
                      <td className="px-4 py-3 text-center font-mono">{stat.expectedAnswer}</td>
                      
                      {/* Difficulty Index */}
                      <td className="px-4 py-3 text-center">
                        {stat.isVoid ? (
                           <span className="font-bold text-gray-300">-</span>
                        ) : (
                           <span className={`font-bold ${stat.percentCorrect < 30 ? 'text-red-600' : stat.percentCorrect > 80 ? 'text-yellow-600' : 'text-gray-700'}`}>
                             {data.totalStudents > 0 ? stat.percentCorrect : 0}%
                           </span>
                        )}
                      </td>

                      {/* Discrimination Index */}
                      <td className="px-4 py-3 text-center">
                        {stat.discrimination !== null ? (
                          <span className={`font-bold ${stat.discrimination < 0 ? 'text-red-600' : stat.discrimination > 0.25 ? 'text-green-600' : 'text-gray-500'}`}>
                            {stat.discrimination > 0 ? '+' : ''}{stat.discrimination}
                          </span>
                        ) : <span className="font-bold text-gray-300">-</span>}
                      </td>

                      {/* The Matrix Verdict */}
                      <td className="px-4 py-3">
                        {stat.flag === 'VOID' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300"><Slash className="w-3.5 h-3.5" /> {t('rep_void_badge')}</span>}
                        {stat.flag === 'TOXIC' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 border border-red-200"><AlertCircle className="w-3.5 h-3.5" /> {t('rep_toxic')}</span>}
                        {stat.flag === 'ELITE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200"><Award className="w-3.5 h-3.5" /> {t('rep_elite')}</span>}
                        {stat.flag === 'WORKHORSE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 border border-green-200"><Check className="w-3.5 h-3.5" /> {t('rep_workhorse')}</span>}
                        {stat.flag === 'FREEBIE' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200"><Activity className="w-3.5 h-3.5" /> {t('rep_freebie')}</span>}
                        
                        {!['VOID', 'TOXIC', 'ELITE', 'WORKHORSE', 'FREEBIE'].includes(stat.flag) && data.totalStudents >= 3 && <span className="text-xs text-gray-500">{t('rep_std')}</span>}
                        {data.totalStudents > 0 && data.totalStudents < 3 && !stat.isVoid && <span className="text-xs text-gray-400">{t('rep_nodata')}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:hidden">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{t('grad_title')}</h1>
        <p className="text-gray-500">{t('grad_subtitle')}</p>
      </div>

      <div className="flex justify-end border-b border-gray-200 pb-4">
        {gradingResults.length > 0 && (
          <button onClick={() => setShowReport(true)} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
            <BarChart className="w-4 h-4" /> {t('grad_report_btn')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">{t('grad_step1')}</h2>
            </div>
            <div className="p-4">
              <textarea value={keysInput} onChange={(e) => setKeysInput(e.target.value.toUpperCase())} placeholder={`A AAACBCAD\nB BBBCBCAD\nC ABABABAB\n(Type 'V' for a voided question)`} className="w-full h-32 font-mono text-sm p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[500px]">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700">{t('grad_step2')}</h2>
              <button onClick={() => { setStudentsInput(''); setKeysInput(''); }} className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"><Trash2 className="w-3 h-3" /> {t('grad_clear')}</button>
            </div>
            <div className="flex-1 p-0 relative">
              <textarea value={studentsInput} onChange={(e) => setStudentsInput(e.target.value)} placeholder={`John Smith A AAACBCAD\nJane Doe B BBBCBCAD`} className="w-full h-full p-4 font-mono text-sm resize-none focus:ring-0 border-none outline-none" spellCheck={false} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 sticky top-0 z-10">
              <h2 className="font-semibold text-gray-700">{t('grad_step3')}</h2>
            </div>
            <div className="p-4 space-y-4">
              {Object.keys(parsedKeys).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400"><AlertCircle className="w-12 h-12 mb-2 opacity-20" /><p>{t('grad_empty_keys')}</p></div>
              ) : gradingResults.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-64 text-gray-400"><RefreshCw className="w-12 h-12 mb-2 opacity-20" /><p>{t('grad_empty_stud')}</p></div>
              ) : (
                <div className="space-y-4">
                  {gradingResults.map((result, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                      {result.error ? (
                        <div className="flex items-center gap-2 text-red-500"><AlertCircle className="w-4 h-4" /><span className="text-sm font-medium">{result.error}</span><span className="text-xs text-gray-400 ml-2 font-mono truncate">{result.originalLine}</span></div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-gray-800 flex items-center gap-2">{result.name}<span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-bold border border-gray-200">Ver {result.version}</span></h3>
                              <div className="text-xs text-gray-500 font-mono mt-1 tracking-wider opacity-70 truncate max-w-[200px]">{result.answers}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600">{result.score}<span className="text-sm text-gray-400 font-normal">/{result.totalQuestions}</span></div>
                              <div className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mt-1 ${result.percentage >= 80 ? 'bg-green-100 text-green-700' : result.percentage >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{result.percentage}%</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.comparison.map((item, i) => (
                              <div key={i} className="flex flex-col items-center group relative">
                                <div className={`w-6 h-8 flex items-center justify-center rounded text-xs font-bold select-none cursor-help 
                                  ${item.isVoid ? 'bg-indigo-500 text-white' : item.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'} 
                                  ${item.studentChar === '-' || item.studentChar === 'X' ? 'opacity-50' : ''}`}>
                                  {item.studentChar}
                                </div>
                                
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                  {item.isVoid ? t('tooltip_void') : !item.isCorrect ? `${t('tooltip_exp')} ${item.keyChar}` : ''}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            {result.wrongQuestionNumbers.length > 0 ? (
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-bold text-red-500 uppercase mt-1">{t('grad_wrong')}</span>
                                <div className="flex flex-wrap gap-1">
                                  {result.wrongQuestionNumbers.map(num => <span key={num} className="bg-red-50 text-red-700 border border-red-100 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold">#{num}</span>)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1"><Check className="w-3 h-3" /> {t('grad_perfect')}</span>
                            )}
                          </div>
                        </>
                      )}
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
