import React, { useMemo } from 'react';
import { useTestStore } from '../store/useTestStore';
import { computeResult } from '../utils/calculator';
import { TYPE_IMAGES, dimensionOrder, dimensionMeta, DIM_EXPLANATIONS } from '../data/sbti';

export const ResultScreen: React.FC = () => {
  const { answers, setScreen, startTest } = useTestStore();

  const result = useMemo(() => computeResult(answers), [answers]);
  const type = result.finalType;

  const imageSrc = (TYPE_IMAGES as any)[type.code];
  const funNote = result.special
    ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
    : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。';

  return (
    <section className="screen active w-full">
      <div className="result-wrap card bg-white border border-[#dbe8dd] rounded-[22px] shadow-[0_16px_40px_rgba(47,73,55,0.08)] mt-[22px] p-[22px]">
        <div className="result-layout grid gap-[18px]">
          <div className="result-top grid lg:grid-cols-[0.9fr_1.1fr] grid-cols-1 gap-[18px] items-stretch">
            
            <div className={`poster-box border border-[#dbe8dd] rounded-[18px] p-[18px] bg-gradient-to-b from-white to-[#fbfdfb] relative overflow-hidden min-h-[280px] flex flex-col ${!imageSrc ? 'no-image' : ''}`}>
              <div className="absolute -right-[46px] -bottom-[46px] w-[140px] h-[140px] rounded-full bg-gradient-to-b from-[rgba(127,165,134,0.12)] to-[rgba(127,165,134,0.01)] pointer-events-none" />
              {imageSrc && (
                <img 
                  src={imageSrc} 
                  alt={`${type.code}（${type.cn}）`} 
                  className="w-full min-h-[220px] max-h-[460px] object-contain rounded-[18px] bg-[rgba(255,255,255,0.75)] relative z-10" 
                />
              )}
              <div className="poster-caption mt-auto pt-[14px] text-[#6a786f] text-sm leading-[1.8] relative z-10">
                {type.intro}
              </div>
            </div>

            <div className="type-box border border-[#dbe8dd] rounded-[18px] p-[18px] bg-gradient-to-b from-white to-[#fbfdfb]">
              <div className="type-kicker text-[12px] text-[#4d6a53] mb-2 tracking-[.06em]">
                {result.modeKicker}
              </div>
              <div className="type-name text-[clamp(30px,5vw,48px)] leading-[1.08] tracking-[-0.03em] font-bold text-[#1e2a22]">
                {type.code}（{type.cn}）
              </div>
              <div className="match mt-[18px] inline-flex items-center gap-2 rounded-full px-[14px] py-[10px] bg-[#edf6ef] border border-[#dbe8dd] text-[#4d6a53] font-bold text-sm leading-[1.4]">
                {result.badge}
              </div>
              <div className="type-subname mt-[10px] text-[#6a786f] text-sm leading-[1.8]">
                {result.sub}
              </div>
            </div>
          </div>

          <div className="analysis-box border border-[#dbe8dd] rounded-[18px] p-[18px] bg-gradient-to-b from-white to-[#fbfdfb]">
            <h3 className="text-base mb-3 font-bold text-[#1e2a22]">该人格的简单解读</h3>
            <p className="m-0 text-[#304034] text-[15px] leading-[1.9] whitespace-pre-wrap">
              {type.desc}
            </p>
          </div>

          <div className="dim-box border border-[#dbe8dd] rounded-[18px] p-[18px] bg-gradient-to-b from-white to-[#fbfdfb]">
            <h3 className="text-base mb-3 font-bold text-[#1e2a22]">十五维度评分</h3>
            <div className="dim-list grid grid-cols-1 md:grid-cols-2 gap-3">
              {dimensionOrder.map(dim => {
                const level = result.levels[dim];
                const explanation = (DIM_EXPLANATIONS as any)[dim][level];
                return (
                  <div key={dim} className="dim-item border border-[#dbe8dd] rounded-[16px] p-[14px] bg-white">
                    <div className="dim-item-top flex justify-between items-baseline gap-[10px] mb-2 flex-wrap">
                      <div className="dim-item-name text-sm font-bold text-[#1e2a22]">
                        {(dimensionMeta as any)[dim].name}
                      </div>
                      <div className="dim-item-score text-[#4d6a53] font-extrabold text-sm whitespace-nowrap">
                        {level} / {result.rawScores[dim]}分
                      </div>
                    </div>
                    <p className="m-0 text-[#6a786f] text-[13px] leading-[1.8]">
                      {explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="note-box border border-[#dbe8dd] rounded-[18px] p-[18px] bg-gradient-to-b from-white to-[#fbfdfb]">
            <h3 className="text-base mb-3 font-bold text-[#1e2a22]">友情提示</h3>
            <p className="m-0 text-[#6a786f] text-[13px] leading-[1.8]">
              {funNote}
            </p>
          </div>

        </div>

        <div className="result-actions flex justify-between items-center gap-3 flex-wrap mt-[22px]">
          <div className="flex gap-3 flex-wrap ml-auto">
            <button 
              onClick={() => startTest(false)}
              className="btn-secondary bg-white text-[#4d6a53] px-5 py-[14px] rounded-[14px] border border-[#dbe8dd] font-bold hover:-translate-y-px transition-transform cursor-pointer"
            >
              重新测试
            </button>
            <button 
              onClick={() => setScreen('intro')}
              className="btn-primary bg-[#4d6a53] text-white px-5 py-[14px] rounded-[14px] font-bold shadow-[0_12px_30px_rgba(77,106,83,0.18)] hover:-translate-y-px transition-transform cursor-pointer"
            >
              回到首页
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
