// 历史记录问题诊断脚本
// 在浏览器控制台中粘贴并运行此代码

function diagnoseHistoryIssues() {
    console.log('🔍 开始诊断历史记录问题...');
    console.log('='.repeat(50));
    
    // 1. 检查DOM元素
    console.log('\n1. 检查DOM元素:');
    const requiredElements = [
        'historyModal',
        'historyList', 
        'historyCount',
        'saveRecordModal',
        'recordName',
        'parameterPreview'
    ];
    
    let missingElements = [];
    requiredElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id} 存在`);
        } else {
            console.error(`❌ ${id} 不存在`);
            missingElements.push(id);
        }
    });
    
    // 2. 检查全局变量
    console.log('\n2. 检查全局变量:');
    if (typeof window.historyManager !== 'undefined') {
        console.log('✅ historyManager 已初始化');
        console.log('   - 历史记录数量:', window.historyManager.history.length);
    } else {
        console.error('❌ historyManager 未初始化');
    }
    
    if (typeof window.openHistoryModal !== 'undefined') {
        console.log('✅ openHistoryModal 函数存在');
    } else {
        console.error('❌ openHistoryModal 函数不存在');
    }
    
    // 3. 检查localStorage
    console.log('\n3. 检查localStorage:');
    const historyData = localStorage.getItem('damageCalculatorHistory');
    if (historyData) {
        try {
            const history = JSON.parse(historyData);
            console.log(`✅ localStorage中有 ${history.length} 条历史记录`);
            if (history.length > 0) {
                console.log('   - 示例记录:', history[0]);
            }
        } catch (e) {
            console.error('❌ localStorage数据格式错误:', e.message);
        }
    } else {
        console.log('⚠️ localStorage中没有历史记录数据');
    }
    
    // 4. 尝试手动调用历史记录弹窗
    console.log('\n4. 测试历史记录弹窗:');
    if (window.historyManager && missingElements.length === 0) {
        try {
            console.log('🔄 尝试手动打开历史记录弹窗...');
            window.openHistoryModal();
            console.log('✅ 弹窗打开成功');
        } catch (e) {
            console.error('❌ 打开弹窗失败:', e.message);
            console.error('   错误堆栈:', e.stack);
        }
    } else {
        console.error('❌ 无法测试弹窗（historyManager未初始化或DOM元素缺失）');
    }
    
    // 5. 生成问题报告
    console.log('\n' + '='.repeat(50));
    console.log('📋 问题报告:');
    
    if (missingElements.length > 0) {
        console.error(`❌ 缺失DOM元素: ${missingElements.join(', ')}`);
        console.log('💡 建议: 检查HTML文件是否完整，确保所有必要的弹窗结构都存在');
    }
    
    if (typeof window.historyManager === 'undefined') {
        console.error('❌ historyManager未初始化');
        console.log('💡 建议: 检查script.js是否正确加载，确保页面加载完成后再操作');
    }
    
    if (!historyData) {
        console.log('⚠️ 没有历史记录数据');
        console.log('💡 建议: 先进行一些伤害计算或手动保存记录');
    }
    
    if (missingElements.length === 0 && window.historyManager) {
        console.log('✅ 基本检查通过，历史记录功能应该正常工作');
    }
    
    console.log('\n🏁 诊断完成');
}

// 创建测试历史记录的函数
function createTestHistoryRecord() {
    console.log('🔧 创建测试历史记录...');
    
    if (!window.historyManager) {
        console.error('❌ historyManager未初始化，无法创建测试记录');
        return;
    }
    
    const testRecord = {
        attack: 1000,
        multiplier: 1.5,
        damageReduction: 1.0,
        refineAttack: 200,
        elementAttack: 300,
        fixedValue: 100,
        coefficientM: 1.0,
        coefficientN: 1.0,
        damageIncrease: 1.2,
        elementDamage: 1.3,
        versatility: 1.1,
        vulnerability: 1.15,
        expectedCrit: 1.4,
        baseDamage: 1000
    };
    
    const finalDamage = 12345;
    
    try {
        window.historyManager.addRecord(testRecord, finalDamage, null, '测试记录', true, {});
        console.log('✅ 测试记录创建成功');
        console.log('🔄 尝试打开历史记录查看...');
        window.openHistoryModal();
    } catch (e) {
        console.error('❌ 创建测试记录失败:', e.message);
    }
}

console.log('🚀 历史记录诊断工具已加载');
console.log('📝 使用方法:');
console.log('   - 运行 diagnoseHistoryIssues() 进行完整诊断');
console.log('   - 运行 createTestHistoryRecord() 创建测试记录'); 