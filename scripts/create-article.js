#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_DIR = path.join(__dirname, '../src/data/articles');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

const formatDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const toSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateTemplate = (data) => {
  return `---
title: ${data.title}
date: ${data.date}
tags: [${data.tags.join(', ')}]
category: ${data.category}
description: ${data.description}
---

# ${data.title}

在这里开始写你的文章内容...

## 小标题

正文内容...

## 另一个小标题

更多内容...
`;
};

async function main() {
  console.log('\n📝 文章模板生成器\n');
  console.log('='.repeat(40));

  const title = await question('文章标题: ');
  if (!title.trim()) {
    console.log('❌ 标题不能为空');
    rl.close();
    return;
  }

  const tagsStr = await question('标签 (用逗号分隔，如: Vue,JavaScript): ');
  const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

  const category = await question('分类 (如: 前端开发): ');
  if (!category.trim()) {
    console.log('❌ 分类不能为空');
    rl.close();
    return;
  }

  const description = await question('文章描述: ');

  const date = formatDate();
  const slug = toSlug(title);
  const filename = `${slug}.md`;
  const filepath = path.join(ARTICLES_DIR, filename);

  if (fs.existsSync(filepath)) {
    console.log(`\n⚠️  文件已存在: ${filename}`);
    const overwrite = await question('是否覆盖? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ 已取消');
      rl.close();
      return;
    }
  }

  const template = generateTemplate({
    title,
    date,
    tags,
    category,
    description
  });

  fs.writeFileSync(filepath, template, 'utf-8');

  console.log('\n' + '='.repeat(40));
  console.log('✅ 文章创建成功!');
  console.log(`📄 文件位置: ${filepath}`);
  console.log(`🏷️  标签: ${tags.join(', ')}`);
  console.log(`📂 分类: ${category}`);
  console.log('\n开始写作吧! 🚀\n');

  rl.close();
}

main();
