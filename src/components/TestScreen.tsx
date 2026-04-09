import React, { useMemo } from 'react';
import { useTestStore } from '../store/useTestStore';
import { specialQuestions, dimensionMeta } from '../data/sbti';

export const TestScreen: React.FC = () => {
  const { 
    shuffledQuestions, 
    answers, 
    previewMode, 
    currentQuestionIndex, 
    setAnswer, 
    setScreen,
    nextQuestion,
    prevQuestion
  } = useTestStore();

  const visibleQuestions = useMemo(() => {
    const visible = [...shuffledQuestions];
    const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
    if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
      visible.splice(gateIndex + 1, 0, specialQuestions[1]);
    }
    return visible;
  }, [shuffledQuestions, answers]);

  const total = visibleQuestions.length;
  const done = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const percent = total ? (done / total) * 100 : 0;
  const complete = done === total && total > 0;
  const isLastQuestion = currentQuestionIndex === total - 1;

  const currentQ = visibleQuestions[currentQuestionIndex];
  const metaLabel = currentQ?.special ? '补充题' : (previewMode ? (dimensionMeta as any)[currentQ?.dim]?.name : '维度已隐藏');
  const hasAnsweredCurrent = answers[currentQ?.id] !== undefined;

  const handleOptionClick = (questionId: string, value: number) => {
    // Determine if this is currently the last question BEFORE setting the answer
    // because setting the answer might change the total number of questions.
    const currentlyLast = isLastQuestion;
    
    setAnswer(questionId, value);
    // 稍微延迟一下，给用户看清选中状态的时间，然后自动滑到下一题
    if (!currentlyLast) {
      setTimeout(() => {
        nextQuestion();
      }, 350);
    }
  };

  if (!currentQ) return null;

  return (
    <section className="screen active w-full flex justify-center">
      <div className="test-wrap card bg-white border border-[#dbe8dd] rounded-[32px] shadow-[0_16px_40px_rgba(47,73,55,0.08)] mt-[22px] p-5 sm:p-[28px] w-full max-w-[480px] min-h-[75vh] flex flex-col relative overflow-hidden">
        
        {/* 顶部进度条区域 */}
        <div className="topbar flex justify-between items-center gap-4 mb-8 flex-wrap shrink-0">
          <div className="progress flex-1 min-w-[200px] h-[8px] bg-[#edf3ee] rounded-full overflow-hidden relative">
            <span 
              className="block h-full bg-gradient-to-r from-[#97b59c] to-[#5b7a62] transition-all duration-300 ease-out rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="progress-text text-[#6a786f] text-[13px] whitespace-nowrap font-bold">
            {done} / {total}
          </div>
        </div>

        {/* 题目卡片容器，使用相对定位和 overflow-hidden 实现滑动视口 */}
        <div className="relative flex-1 w-full overflow-hidden flex flex-col">
          {/* 滑动容器 */}
          <div 
            className="flex w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${currentQuestionIndex * 100}%)` }}
          >
            {visibleQuestions.map((q, index) => {
              const qMetaLabel = q.special ? '补充题' : (previewMode ? (dimensionMeta as any)[q.dim]?.name : '维度已隐藏');
              
              return (
                <div key={q.id} className="w-full shrink-0 px-1 pb-4 flex flex-col">
                  <article className="question flex-1 flex flex-col border border-[#dbe8dd] rounded-[24px] p-5 sm:p-[24px] bg-gradient-to-b from-white to-[#fbfdfb] shadow-[0_4px_20px_rgba(47,73,55,0.03)]">
                    <div className="question-meta flex justify-between items-center gap-3 mb-4 text-[#6a786f] text-[13px] font-bold shrink-0">
                      <div className="badge inline-flex items-center gap-[6px] rounded-full px-[12px] py-[6px] bg-[#edf6ef] border border-[#dbe8dd] text-[#4d6a53]">
                        第 {index + 1} 题
                      </div>
                      <div>{qMetaLabel}</div>
                    </div>
                    
                    <div className="question-title text-[18px] leading-[1.6] whitespace-pre-wrap text-[#1e2a22] font-bold mb-6 shrink-0">
                      {q.text}
                    </div>
                    
                    {/* mt-0 并且使用 flex-none 让其紧贴在题目下方，不自动拉伸填充 */}
                    <div className="options flex-none grid gap-[12px] mt-0">
                      {q.options.map((opt: any, i: number) => {
                        const code = ['A', 'B', 'C', 'D'][i] || String(i + 1);
                        const checked = answers[q.id] === opt.value;

                        return (
                          <label 
                            key={opt.value} 
                            className={`option flex items-center gap-3 p-[16px] rounded-[16px] border transition-all duration-200 ease-out cursor-pointer ${
                              checked 
                                ? 'border-[#bcd0c1] bg-[#f8fcf9] shadow-[0_4px_12px_rgba(77,106,83,0.06)] -translate-y-px' 
                                : 'border-[#dbe8dd] bg-white hover:border-[#bcd0c1] hover:bg-[#f8fcf9] hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(77,106,83,0.04)]'
                            }`}
                          >
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt.value} 
                              checked={checked}
                              onChange={() => handleOptionClick(q.id, opt.value)}
                              className="scale-125 shrink-0 cursor-pointer accent-[#4d6a53] m-0 mr-1"
                            />
                            <div className="option-code font-extrabold text-[#4d6a53] min-w-[24px] text-[16px]">
                              {code}
                            </div>
                            <div className="text-[#1e2a22] text-[15px] font-medium leading-[1.4]">{opt.label}</div>
                          </label>
                        );
                      })}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* 底部操作区 */}
        <div className="actions-bottom flex justify-between items-center mt-4 pt-4 border-t border-[#edf3ee] shrink-0">
          <button 
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`text-[#6a786f] px-4 py-2 font-bold text-[14px] transition-colors ${currentQuestionIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#4d6a53]'}`}
          >
            上一题
          </button>
          
          <div className="flex gap-3">
            {isLastQuestion ? (
              <button 
                disabled={!complete}
                onClick={() => setScreen('result')}
                className={`btn-primary bg-[#4d6a53] text-white px-6 py-[14px] rounded-[16px] font-bold shadow-[0_8px_20px_rgba(77,106,83,0.18)] transition-all duration-200 ${
                  !complete ? 'opacity-50 cursor-not-allowed shadow-none' : 'hover:-translate-y-px hover:shadow-[0_12px_24px_rgba(77,106,83,0.22)] active:scale-[0.98]'
                }`}
              >
                查看结果
              </button>
            ) : (
              <button 
                onClick={nextQuestion}
                disabled={!hasAnsweredCurrent}
                className={`bg-[#edf6ef] text-[#4d6a53] px-6 py-[12px] rounded-[16px] font-bold transition-all duration-200 border border-[#dbe8dd] ${
                  !hasAnsweredCurrent ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e4efe6] hover:-translate-y-px active:scale-[0.98]'
                }`}
              >
                下一题
              </button>
            )}
          </div>
        </div>
        
      </div>
    </section>
  );
};
