import { questions, specialQuestions } from './src/data/sbti';
import { computeResult } from './src/utils/calculator';

const answers: Record<string, number> = {};

// 随机回答常规题目
questions.forEach(q => {
  const randomOption = q.options[Math.floor(Math.random() * q.options.length)];
  answers[q.id] = randomOption.value;
});

// 随机回答特殊门槛题（这里故意选个不是饮酒的，或者随机）
const gateQ = specialQuestions[0];
answers[gateQ.id] = gateQ.options[0].value; // 选第一个，不触发酒鬼

const result = computeResult(answers);

console.log(JSON.stringify({
  typeCode: result.finalType.code,
  typeName: result.finalType.cn,
  intro: result.finalType.intro,
  badge: result.badge,
  desc: result.finalType.desc,
  levels: result.levels
}, null, 2));
