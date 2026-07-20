const fs = require('fs');
const path = require('path');

// 1. 定义文件路径
const filePath = path.join(__dirname, 'src', 'npc_services.cpp');

// 2. 定义中英文映射字典
const translations = {
    'Restore HP and MP': '恢复生命和法力',
    'Reset Instances': '重置副本冷却',
    'Reset Cooldowns': '重置技能冷却',
    'Reset Combat': '清除战斗状态',
    'Remove Sickness': '移除复活虚弱',
    'Repair Items': '修理装备',
    'Reset Talents': '重置天赋',
    'Bank': '打开银行',
    'Mail': '打开邮箱',
    'Learn Dual Talents': '学习双天赋'
};

try {
    // 3. 读取文件内容
    let content = fs.readFileSync(filePath, 'utf8');
    let totalReplacements = 0;

    // 4. 遍历字典，安全替换
    for (const [english, chinese] of Object.entries(translations)) {
        // 转义英文文本中的正则特殊字符
        const escapedEnglish = english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        /**
         * 🔍 精准正则表达式解释: /(\|t\s*)(英文文本)/gi
         * - (\|t\s*) : 捕获组1，匹配 |t 以及后面任意数量的空格（支持 |tBank 或 |t Bank）
         * - (英文文本) : 捕获组2，匹配我们要替换的短语
         * - 'g' : 全局匹配
         * - 'i' : 忽略大小写（防止源码中出现大写 |T 或 小写 |t）
         */
        const regex = new RegExp(`(\\|t\\s*)${escapedEnglish}`, 'gi');

        // 在替换时，保留捕获组1（即之前的图标控制符 $1），只把英文部分替换为中文
        content = content.replace(regex, `$1${chinese}`);
    }

    // 5. 写回文件
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ 安全替换完成！已自动绑定前置的 |t 图标控制符。');

} catch (error) {
    console.error('❌ 执行替换时发生错误:', error.message);
}
