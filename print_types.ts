import { TYPE_LIBRARY } from './src/data/sbti';
Object.values(TYPE_LIBRARY).forEach(t => {
  console.log(`- **${t.code}（${t.cn}）**\n  *宣言*: ${t.intro}\n  *解读*: ${t.desc}\n`);
});
