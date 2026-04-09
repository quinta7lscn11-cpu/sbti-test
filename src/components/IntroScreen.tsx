import React from 'react';
import { useTestStore } from '../store/useTestStore';

export const IntroScreen: React.FC = () => {
  const startTest = useTestStore(state => state.startTest);

  return (
    <section className="screen active w-full flex justify-center">
      <div className="card hero-minimal bg-white border border-[#dbe8dd] rounded-[32px] shadow-[0_16px_40px_rgba(47,73,55,0.08)] min-h-[80vh] w-full max-w-[400px] flex flex-col justify-center items-center text-center p-[42px_24px] mt-2 relative overflow-hidden">
        
        <div className="flex-1 flex flex-col justify-center items-center w-full">
          <h1 className="text-[36px] leading-[1.15] tracking-[-0.03em] max-w-none m-0 text-[#1e2a22] font-extrabold">
            MBTI已经过时，<br />SBTI来了。
          </h1>
          
          <div className="flex flex-col w-full gap-3 mt-[50px] justify-center relative z-10">
            <button 
              onClick={() => startTest(false)}
              className="btn-primary w-full bg-[#4d6a53] text-white px-5 py-[16px] rounded-[18px] shadow-[0_12px_30px_rgba(77,106,83,0.18)] text-[18px] font-bold hover:-translate-y-px transition-transform cursor-pointer"
            >
              开始测试
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col text-[#6a786f] text-[13px] gap-1 pb-2">
          <span>原作者：<a href="https://space.bilibili.com/417038183" target="_blank" rel="noreferrer" className="text-[#4d6a53] hover:underline font-bold">B站@蛆肉儿串儿</a></span>
        </div>
      </div>
    </section>
  );
};
