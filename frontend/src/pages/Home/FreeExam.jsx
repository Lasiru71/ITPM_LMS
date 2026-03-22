import React, { useState, useEffect } from 'react';
import { BookOpen, Zap, CheckCircle, XCircle, RefreshCcw, Send, ChevronRight, Clock, AlertCircle } from 'lucide-react';

const DATA_SCIENCE_QUESTIONS = [
  { q: "What is the main goal of Data Science?", options: ["Store data", "Extract insights", "Data cleaning only", "Hardware repair"], a: "Extract insights" },
  { q: "Which language is most used in Data Science?", options: ["HTML", "Python", "CSS", "C++"], a: "Python" },
  { q: "What does SQL stand for?", options: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Standard Query Level"], a: "Structured Query Language" },
  { q: "What is 'Supervised Learning'?", options: ["Learning with a teacher", "Learning from labeled data", "Unstructured learning", "Manual data entry"], a: "Learning from labeled data" },
  { q: "In Data Science, what is a 'Pandas'?", options: ["A bear", "An animal", "A Python library for data manipulation", "A file format"], a: "A Python library for data manipulation" },
  { q: "What is an 'Outlier'?", options: ["A normal data point", "An extreme data point", "A data entry error only", "A missing value"], a: "An extreme data point" },
  { q: "Which tool is commonly used for Data Visualization?", options: ["Word", "Tableau", "Photoshop", "Notepad"], a: "Tableau" },
  { q: "What is 'Overfitting'?", options: ["Fitting a model well", "Model learns noise as patterns", "Model is too simple", "Data is missing"], a: "Model learns noise as patterns" },
  { q: "What is the purpose of 'A/B Testing'?", options: ["Alpha/Beta test", "Compare two versions", "Fix bugs", "Delete old data"], a: "Compare two versions" },
  { q: "What is 'Big Data'?", options: ["Large excel sheets", "Extremely large datasets", "A single large file", "Data with high resolution"], a: "Extremely large datasets" },
  { q: "Which is a classification algorithm?", options: ["K-Means", "Random Forest", "Linear Regression", "T-test"], a: "Random Forest" },
  { q: "What is 'Data Wrangling'?", options: ["Data storage", "Cleaning and transforming raw data", "Fighting with data", "Sending data"], a: "Cleaning and transforming raw data" },
  { q: "What is the median of [1, 3, 3, 6, 7, 8, 9]?", options: ["3", "6", "5", "7"], a: "6" },
  { q: "What is a 'Correlation'?", options: ["Direct cause", "Relationship between variables", "Variable error", "Negative data"], a: "Relationship between variables" },
  { q: "What is 'NLP'?", options: ["Natural Language Processing", "Normal Large Processing", "Node Link Program", "New Life Project"], a: "Natural Language Processing" },
  { q: "What is a 'Neuron' in neural networks?", options: ["A brain cell", "A computational unit", "A software bug", "A cable"], a: "A computational unit" },
  { q: "Which library is for Deep Learning?", options: ["Requests", "TensorFlow", "Pandas", "Matplotlib"], a: "TensorFlow" },
  { q: "What is a 'Confusion Matrix'?", options: ["A puzzle", "A table to evaluate performance", "An error code", "A data messy file"], a: "A table to evaluate performance" },
  { q: "What is 'Standard Deviation'?", options: ["A mistake", "Measure of data spread", "The mean value", "A constant number"], a: "Measure of data spread" },
  { q: "What is 'K-means' used for?", options: ["Classification", "Clustering", "Regression", "Sort data"], a: "Clustering" }
];

const GENERIC_QUESTIONS = [
  { q: "What is the primary purpose of an LMS?", options: ["Gaming", "Learning Management", "Social Media", "Video Editing"], a: "Learning Management" },
  { q: "What does MCQ stand for?", options: ["Multi Choice Question", "Multiple Choice Question", "Most Common Question", "Main Choice Quality"], a: "Multiple Choice Question" },
  { q: "Which is key for effective online learning?", options: ["High volume", "Self-discipline", "Gaming PC", "Paper handouts"], a: "Self-discipline" },
  { q: "What is 'E-Learning'?", options: ["Electric learning", "Electronic learning", "Easy learning", "Emergency learning"], a: "Electronic learning" },
  { q: "What is a 'MOOC'?", options: ["Massive Open Online Course", "Main Online Office Center", "Major Open Office Class", "Module Open Online Course"], a: "Massive Open Online Course" },
  { q: "What is 'Blended Learning'?", options: ["Mixing subjects", "Mixing online and face-to-face", "Reading multiple books", "Learning from TV"], a: "Mixing online and face-to-face" },
  { q: "What is a 'Rubric'?", options: ["A rubric cube", "A scoring guide", "A textbook", "A student ID"], a: "A scoring guide" },
  { q: "What is 'Formative Assessment'?", options: ["Final exam", "Ongoing assessment", "Initial test", "IQ test"], a: "Ongoing assessment" },
  { q: "What is 'Synchronous Learning'?", options: ["Offline learning", "Real-time learning", "Self-paced study", "Video gaming"], a: "Real-time learning" },
  { q: "What is 'Asynchronous Learning'?", options: ["Group work", "Self-paced learning", "Live lecture", "Classroom talk"], a: "Self-paced learning" },
  { q: "What is the 'Cloud' in education?", options: ["A weather term", "Online storage and services", "A whiteboard", "A soft pillow"], a: "Online storage and services" },
  { q: "What is 'Gamification'?", options: ["Playing games only", "Applying game elements to learning", "Buying new games", "Making a video game"], a: "Applying game elements to learning" },
  { q: "What is 'Digital Literacy'?", options: ["Reading ebooks only", "Ability to find and use digital info", "Typing fast", "Buying gadgets"], a: "Ability to find and use digital info" },
  { q: "What is 'Pedagogy'?", options: ["Foot doctor", "Method of teaching", "Study of maps", "A musical instrument"], a: "Method of teaching" },
  { q: "What is 'Andragogy'?", options: ["Study of men", "Adult education", "Teaching kids", "Drawing"], a: "Adult education" },
  { q: "What is 'Collaborative Learning'?", options: ["Learning alone", "Learning in groups", "Learning from videos", "Learning from scripts"], a: "Learning in groups" },
  { q: "What is a 'Digital Footprint'?", options: ["Online search history", "Impact of digital usage", "Trail of online interactions", "A shoe mark"], a: "Trail of online interactions" },
  { q: "What is 'STEM'?", options: ["A flower part", "Science, Tech, Engineering, Math", "Standard Testing Example", "Student Teacher Entry Model"], a: "Science, Tech, Engineering, Math" },
  { q: "What is 'VLE'?", options: ["Virtual Learning Environment", "Video Link Entry", "Visual Life Example", "Variable Logic Engine"], a: "Virtual Learning Environment" },
  { q: "Which is an example of an LMS?", options: ["EduVault", "Minecraft", "Spotify", "Instagram"], a: "EduVault" }
];

export default function FreeExam() {
  const [subject, setSubject] = useState('');
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds

  useEffect(() => {
    let timer;
    if (examStarted && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !showResults) {
      setShowResults(true);
    }
    return () => clearInterval(timer);
  }, [examStarted, showResults, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateExam = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    let selectedSet = GENERIC_QUESTIONS;
    if (subject.toLowerCase().includes('data science') || subject.toLowerCase().includes('data')) {
      selectedSet = DATA_SCIENCE_QUESTIONS;
    }
    
    const shuffled = [...selectedSet].sort(() => 0.5 - Math.random());
    setQuestions(shuffled);
    setExamStarted(true);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(1800); // Reset timer to 30 mins
  };

  const handleSelect = (questionIndex, option) => {
    if (showResults) return;
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const getResultIcon = (index) => {
    const isCorrect = answers[index] === questions[index].a;
    return isCorrect ? <CheckCircle size={16} color="#10b981" /> : <XCircle size={16} color="#ef4444" />;
  };

  const getScore = () => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.a) score++;
    });
    return score;
  };

  return (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '4rem 2rem', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {!examStarted ? (
          <div style={{ textAlign: 'center', backgroundColor: '#fff', padding: '4rem', borderRadius: '2rem', boxShadow: '0 10px 30px rgba(15,23,42,0.1)', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, background: '#d1fae5', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap style={{ color: '#10b981', width: 32, height: 32 }} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Generate Your <span style={{ color: '#10b981' }}>Free Exam</span></h1>
            <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '3rem' }}>Type any subject and our AI will generate MCQ questions for you to test your knowledge.</p>
            
            <form onSubmit={generateExam} style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              <input 
                type="text" 
                placeholder="e.g. Data Science, Business Management" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                style={{ flex: 1, padding: '1rem 1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', fontSize: '1rem', outline: 'none' }} 
              />
              <button 
                type="submit" 
                style={{ padding: '1rem 2rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                Generate <ChevronRight size={18} />
              </button>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem', alignItems: 'start' }}>
            
            {/* Sidebar / Timer */}
            <div style={{ position: 'sticky', top: '2rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: timeLeft < 300 ? '#ef4444' : '#10b981', marginBottom: '1rem' }}>
                    <Clock size={24} />
                    <span style={{ fontSize: '2rem', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>TIME REMAINING</p>
                  {timeLeft < 300 && timeLeft > 0 && (
                    <div style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                      <AlertCircle size={14} /> Hurrying up! Less than 5 mins left.
                    </div>
                  )}
                  {timeLeft === 0 && (
                    <div style={{ marginTop: '1rem', color: '#ef4444', fontSize: '0.875rem', fontWeight: 700 }}>
                      TIME EXPIRED!
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Progress</p>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{Object.keys(answers).length} / 20</div>
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
                      <div style={{ width: `${(Object.keys(answers).length / 20) * 100}%`, height: '100%', background: '#10b981', transition: 'width 0.3s ease' }} />
                    </div>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm('Reset and start over?')) setExamStarted(false); }}
                    style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: '0.75rem', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer' }}
                  >
                    <RefreshCcw size={14} /> New Subject
                  </button>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div>
              <div style={{ marginBottom: '3rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Subject: {subject}</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>MCQ Questions</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {questions.map((q, i) => (
                  <div key={i} style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                      <span style={{ minWidth: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem' }}>{i + 1}</span>
                      {q.q}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSelect(i, opt)}
                          style={{
                            textAlign: 'left',
                            padding: '1rem',
                            borderRadius: '0.75rem',
                            border: '2px solid',
                            borderColor: answers[i] === opt ? '#10b981' : '#f1f5f9',
                            backgroundColor: answers[i] === opt ? '#f0fdf4' : '#fff',
                            cursor: showResults ? 'default' : 'pointer',
                            fontSize: '0.9375rem',
                            transition: 'all 0.15s ease',
                            color: '#374151'
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {showResults && (
                      <div style={{ marginTop: '1.5rem', padding: '1rem', borderRadius: '0.75rem', backgroundColor: answers[i] === q.a ? '#f0fdf4' : '#fef2f2', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {getResultIcon(i)}
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: answers[i] === q.a ? '#059669' : '#ef4444' }}>
                          {answers[i] === q.a ? 'Correct!' : `Wrong. Correct answer: ${q.a}`}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                {!showResults ? (
                  <button
                    onClick={() => {
                      if (Object.keys(answers).length < 20) {
                        if (!window.confirm(`You've only answered ${Object.keys(answers).length}/20 questions. Submit anyway?`)) return;
                      }
                      setShowResults(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ 
                      padding: '1rem 3rem', 
                      backgroundColor: '#111827', 
                      color: '#fff', 
                      border: 'none', 
                      borderRadius: '1.25rem', 
                      fontWeight: 800, 
                      fontSize: '1.125rem', 
                      cursor: 'pointer', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Send size={20} /> Submit & Check Marks
                  </button>
                ) : (
                  <div style={{ backgroundColor: '#fff', padding: '2rem 3rem', borderRadius: '2rem', boxShadow: '0 20px 40px rgba(16,185,129,0.2)', border: '2px solid #10b981', display: 'inline-flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Your Result</p>
                      <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>{getScore()} / 20</p>
                    </div>
                    <button 
                      onClick={() => { setExamStarted(false); setSubject(''); }}
                      style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Try Another Subject
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
