import React, { useState } from "react";
import api from "../../api/axios";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Loader2,
  Send,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Full Stack",
  "AI / Machine Learning",
  "DevOps",
  "Product Design",
  "Data Science",
  "Cybersecurity",
  "Product Management",
];

const InterviewPrepPanel = () => {
  const [roleInput, setRoleInput] = useState("Frontend");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      category: "Technical",
      question:
        "Explain the Virtual DOM and how React handles state updates under the hood.",
      difficulty: "Medium",
      answerGuide:
        "Mention reconciliation, fiber architecture, and batching state updates.",
      completed: false,
    },
    {
      id: 2,
      category: "Behavioral",
      question:
        "Describe a time when you had an architectural disagreement with a teammate. How did you handle it?",
      difficulty: "Hard",
      answerGuide:
        "Use the STAR method: Situation, Task, Action, and quantifiable Outcome.",
      completed: false,
    },
    {
      id: 3,
      category: "Technical",
      question:
        "What is the difference between client-side rendering (CSR) and server-side rendering (SSR)?",
      difficulty: "Medium",
      answerGuide:
        "Discuss initial load times, SEO impact, server burden, and hydration.",
      completed: false,
    },
    {
      id: 4,
      category: "System Design",
      question:
        "How would you design an asset pipeline to optimize image and font loading on a high-traffic web application?",
      difficulty: "Hard",
      answerGuide:
        "Address WebP/AVIF formats, lazy loading, CDN caching strategies, and font subsetting.",
      completed: false,
    },
    {
      id: 5,
      category: "Technical",
      question:
        "Explain JavaScript closures and provide a practical real-world use case.",
      difficulty: "Medium",
      answerGuide:
        "Define lexical scoping, private variables, and memory retention risks.",
      completed: false,
    },
    {
      id: 6,
      category: "Behavioral",
      question:
        "Tell me about a time you missed a project deadline or made a critical bug in production.",
      difficulty: "Hard",
      answerGuide:
        "Focus on accountability, immediate mitigation steps, and preventive measures implemented after.",
      completed: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  const handleToggleExpand = (q) => {
    if (selectedQuestion?.id === q.id) {
      setSelectedQuestion(null);
    } else {
      setSelectedQuestion(q);
      setUserAnswer("");
      setAiFeedback("");
    }
  };

  const generateQuestionsWithGrok = async () => {
    if (!roleInput.trim()) return;
    setLoading(true);
    setError("");
    setAiFeedback("");

    try {
      const res = await api.post("/ai/generate-questions", { role: roleInput });
      if (res.data.success && res.data.questions) {
        setQuestions(res.data.questions);
        setSelectedQuestion(null);
      }
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(
        err.response?.data?.message || "Failed to generate interview questions."
      );
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswerWithGrok = async () => {
    if (!userAnswer.trim() || !selectedQuestion) return;

    setEvaluating(true);
    setAiFeedback("");
    setError("");

    try {
      const res = await api.post("/ai/evaluate-answer", {
        question: selectedQuestion.question,
        userAnswer,
      });

      if (res.data.success) {
        setAiFeedback(res.data.feedback);
      }
    } catch (err) {
      console.error("Error evaluating answer:", err);
      setAiFeedback("Unable to evaluate answer right now. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const toggleComplete = (id, e) => {
    e.stopPropagation();
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
  };

  const filteredQuestions =
    activeTab === "all"
      ? questions
      : questions.filter(
          (q) => q.category.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-2xl transition-colors duration-200 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight">
              AI Interview Prep
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              AI-generated questions and instant feedback tailored to your target role.
            </p>
          </div>
        </div>

        {/* Dynamic Role Search Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <div className="relative">
            <select
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="appearance-none pr-8 pl-3.5 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold outline-none text-slate-800 dark:text-slate-200 cursor-pointer focus:border-indigo-500 transition-colors"
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                >
                  {category}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button
            onClick={generateQuestionsWithGrok}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Error Callout */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 dark:text-rose-300 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3 overflow-x-auto">
        {["all", "technical", "behavioral", "system design"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab
                ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.map((q, idx) => {
          const isOpen = selectedQuestion?.id === q.id;

          return (
            <div
              key={q.id ? `q-${q.id}` : `q-idx-${idx}`}
              onClick={() => handleToggleExpand(q)}
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 space-y-3 cursor-pointer ${
                isOpen
                  ? "border-indigo-500 dark:border-indigo-500 bg-slate-50/80 dark:bg-slate-950 shadow-sm"
                  : "bg-slate-50/60 dark:bg-slate-950/60 hover:bg-slate-100/80 dark:hover:bg-slate-950 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => toggleComplete(q.id, e)}
                    className="text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer shrink-0 mt-0.5"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        q.completed
                          ? "fill-emerald-500 text-white dark:text-slate-950"
                          : ""
                      }`}
                    />
                  </button>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
                        {q.category}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md border ${
                          q.difficulty === "Hard"
                            ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                            : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {q.question}
                    </p>
                  </div>
                </div>

                <div className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 shrink-0">
                  <span>{isOpen ? "Close" : "Practice"}</span>
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              {/* Opened State Details */}
              {isOpen && (
                <div
                  className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                >
                  {q.answerGuide && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      <strong className="font-semibold text-slate-700 dark:text-slate-300 not-italic">
                        Tip:{" "}
                      </strong>
                      {q.answerGuide}
                    </p>
                  )}

                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your practice response..."
                    rows={3}
                    className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  />

                  <div className="flex justify-end items-center">
                    <button
                      onClick={evaluateAnswerWithGrok}
                      disabled={evaluating || !userAnswer.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      {evaluating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit Answer</span>
                    </button>
                  </div>

                  {aiFeedback && (
                    <div className="p-4 bg-indigo-50/70 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-xl text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400 block">
                        AI Feedback:
                      </span>
                      <p className="leading-relaxed">{aiFeedback}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterviewPrepPanel;