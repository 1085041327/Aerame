// 主要计算逻辑
class DamageCalculator {
    constructor() {
        // 初始化输入框映射
        const inputIds = {
            attack: 'attack',
            multiplier: 'multiplier',
            damageReduction: 'damageReduction',
            refineAttack: 'refineAttack',
            elementAttack: 'elementAttack',
            fixedValue: 'fixedValue',
            luckProbability: 'luckProbability',
            luckMultiplier: 'luckMultiplier',
            coefficientM: 'coefficientM',
            coefficientN: 'coefficientN',
            damageIncrease: 'damageIncrease',
            elementDamage: 'elementDamage',
            versatility: 'versatility',
            vulnerability: 'vulnerability',
            expectedCrit: 'expectedCrit',
            baseDamage: 'baseDamage'
        };

        this.inputs = {};
        Object.keys(inputIds).forEach(key => {
            const element = document.getElementById(inputIds[key]);
            if (element) {
                this.inputs[key] = element;
            } else {
                console.error(`找不到输入框: ${inputIds[key]}`);
            }
        });

        this.results = {
            finalDamage: document.getElementById('finalDamage'),
            formulaDisplay: document.getElementById('formulaDisplay'),
            newDamage: document.getElementById('newDamage'),
            percentageIncrease: document.getElementById('percentageIncrease')
        };

        // 存储键名，用于localStorage
        this.storageKey = 'damageCalculatorValues';
        
        // 先加载保存的值，再初始化事件监听器
        this.loadSavedValues();
        this.initEventListeners();
        this.calculateDamage();
    }

    initEventListeners() {
        // 为所有输入框添加事件监听器
        Object.keys(this.inputs).forEach(key => {
            const input = this.inputs[key];
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateDamage();
                    this.saveValues(); // 自动保存输入值
                });
            } else {
                console.warn(`输入框不存在: ${key}`);
            }
        });
        
        // 输出调试信息并验证所有输入框
        console.log('初始化的输入框:', this.inputs);
        
        // 验证所有输入框是否存在
        const missingInputs = [];
        Object.keys(this.inputs).forEach(key => {
            if (!this.inputs[key]) {
                missingInputs.push(key);
            }
        });
        
        if (missingInputs.length > 0) {
            console.warn('缺失的输入框:', missingInputs);
        } else {
            console.log('✅ 所有输入框初始化成功');
        }
    }

    calculateDamage() {
        const values = this.getInputValues();
        const finalDamage = this.calculateCurrentDamage();

        // 计算公式: 【攻击力×倍率×(M)×减伤区+(精炼攻击+元素攻击)×倍率×(N)+（攻击力+精炼攻击+元素攻击）×幸运概率×幸运倍率+固定值】×增伤×元素伤害×全能×易伤×期望爆伤
        const basePart = values.attack * values.multiplier * values.coefficientM * values.damageReduction;
        const additionalPart = (values.refineAttack + values.elementAttack) * values.multiplier * values.coefficientN;
        const luckPart = (values.attack + values.refineAttack + values.elementAttack) * values.luckProbability * values.luckMultiplier;
        const coreDamage = basePart + additionalPart + luckPart + values.fixedValue;

        this.updateResults(values, basePart, additionalPart, luckPart, coreDamage, finalDamage);
    }

    // 计算当前伤害值（不触发历史记录保存）
    calculateCurrentDamage() {
        const values = this.getInputValues();

        const basePart = values.attack * values.multiplier * values.coefficientM * values.damageReduction;
        const additionalPart = (values.refineAttack + values.elementAttack) * values.multiplier * values.coefficientN;
        const luckPart = (values.attack + values.refineAttack + values.elementAttack) * values.luckProbability * values.luckMultiplier;
        const coreDamage = basePart + additionalPart + luckPart + values.fixedValue;
        
        return coreDamage * values.damageIncrease * values.elementDamage * 
               values.versatility * values.vulnerability * values.expectedCrit;
    }

    getInputValues() {
        const values = {};
        Object.keys(this.inputs).forEach(key => {
            values[key] = parseFloat(this.inputs[key].value) || 0;
        });
        return values;
    }

    updateResults(values, basePart, additionalPart, luckPart, coreDamage, finalDamage) {
        // 更新最终伤害显示
        this.results.finalDamage.textContent = Math.round(finalDamage).toLocaleString();
        this.results.newDamage.value = Math.round(finalDamage);

        // 更新公式显示
        this.updateFormulaDisplay(values, basePart, additionalPart, luckPart, coreDamage, finalDamage);

        // 计算提升百分比
        this.calculatePercentageIncrease(finalDamage, values.baseDamage);

        // 移除自动保存功能，只保留手动保存
    }

    updateFormulaDisplay(values, basePart, additionalPart, luckPart, coreDamage, finalDamage) {
        const formula = `【${values.attack} × ${values.multiplier} × ${values.coefficientM} × ${values.damageReduction} + (${values.refineAttack} + ${values.elementAttack}) × ${values.multiplier} × ${values.coefficientN} + (${values.attack} + ${values.refineAttack} + ${values.elementAttack}) × ${values.luckProbability} × ${values.luckMultiplier} + ${values.fixedValue}】× ${values.damageIncrease} × ${values.elementDamage} × ${values.versatility} × ${values.vulnerability} × ${values.expectedCrit}

= 【${basePart.toFixed(2)} + ${additionalPart.toFixed(2)} + ${luckPart.toFixed(2)} + ${values.fixedValue}】× ${(values.damageIncrease * values.elementDamage * values.versatility * values.vulnerability * values.expectedCrit).toFixed(4)}

= ${coreDamage.toFixed(2)} × ${(values.damageIncrease * values.elementDamage * values.versatility * values.vulnerability * values.expectedCrit).toFixed(4)}

= ${finalDamage.toFixed(2)}`;
        
        this.results.formulaDisplay.textContent = formula;
    }

    calculatePercentageIncrease(newDamage, baseDamage) {
        if (baseDamage === 0) {
            this.results.percentageIncrease.textContent = '提升百分比: 基准伤害不能为0';
            return;
        }

        const percentage = ((newDamage - baseDamage) / baseDamage * 100);
        const sign = percentage >= 0 ? '+' : '';
        this.results.percentageIncrease.textContent = `提升百分比: ${sign}${percentage.toFixed(2)}%`;
        
        // 根据提升情况改变颜色
        if (percentage > 0) {
            this.results.percentageIncrease.style.background = 'linear-gradient(45deg, #56ab2f, #a8e6cf)';
        } else if (percentage < 0) {
            this.results.percentageIncrease.style.background = 'linear-gradient(45deg, #ff6b6b, #ffa8a8)';
        } else {
            this.results.percentageIncrease.style.background = 'linear-gradient(45deg, #95a5a6, #bdc3c7)';
        }
    }

    // 设置系数值
    setCoefficients(m, n) {
        this.inputs.coefficientM.value = m.toFixed(4);
        this.inputs.coefficientN.value = n.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置全能值
    setVersatility(value) {
        this.inputs.versatility.value = value.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置增伤值
    setDamageIncrease(value) {
        this.inputs.damageIncrease.value = value.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置减伤区值
    setDamageReduction(value) {
        this.inputs.damageReduction.value = value.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置元素伤害值
    setElementDamage(value) {
        this.inputs.elementDamage.value = value.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置攻击力值
    setAttack(value) {
        this.inputs.attack.value = value.toFixed(0);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 设置暴击期望值
    setExpectedCrit(value) {
        this.inputs.expectedCrit.value = value.toFixed(4);
        this.calculateDamage();
        this.saveValues(); // 保存新值
    }

    // 保存当前输入值到localStorage
    saveValues() {
        try {
            const values = {};
            Object.keys(this.inputs).forEach(key => {
                if (this.inputs[key]) {
                    values[key] = this.inputs[key].value;
                }
            });
            localStorage.setItem(this.storageKey, JSON.stringify(values));
            console.log('输入值已自动保存');
        } catch (error) {
            console.error('保存输入值失败:', error);
        }
    }

    // 从localStorage加载保存的值
    loadSavedValues() {
        try {
            const savedValues = localStorage.getItem(this.storageKey);
            if (savedValues) {
                const values = JSON.parse(savedValues);
                Object.keys(values).forEach(key => {
                    if (this.inputs[key]) {
                        this.inputs[key].value = values[key];
                    }
                });
                console.log('已加载保存的输入值');
            } else {
                console.log('未找到保存的输入值，使用默认值');
            }
        } catch (error) {
            console.error('加载保存的输入值失败:', error);
        }
    }
}

// 预设配置管理
class PresetManager {
    constructor(calculator) {
        this.calculator = calculator;
        this.presets = {
            'low': {
                attack: 800,
                multiplier: 1.0,
                damageReduction: 1.0,
                refineAttack: 150,
                elementAttack: 200,
                fixedValue: 50,
                coefficientM: 1.0,
                coefficientN: 1.0,
                damageIncrease: 1.0,
                elementDamage: 1.0,
                versatility: 1.0,
                vulnerability: 1.0,
                expectedCrit: 1.0
            },
            'medium': {
                attack: 1500,
                multiplier: 1.8,
                damageReduction: 1.0,
                refineAttack: 300,
                elementAttack: 400,
                fixedValue: 150,
                coefficientM: 1.2,
                coefficientN: 1.1,
                damageIncrease: 1.3,
                elementDamage: 1.4,
                versatility: 1.15,
                vulnerability: 1.2,
                expectedCrit: 1.5
            },
            'high': {
                attack: 2500,
                multiplier: 2.5,
                damageReduction: 1.1,
                refineAttack: 500,
                elementAttack: 600,
                fixedValue: 300,
                coefficientM: 1.5,
                coefficientN: 1.3,
                damageIncrease: 1.6,
                elementDamage: 1.7,
                versatility: 1.3,
                vulnerability: 1.4,
                expectedCrit: 1.8
            }
        };
    }

    loadPreset(presetName) {
        const preset = this.presets[presetName];
        if (preset) {
            Object.keys(preset).forEach(key => {
                if (this.calculator.inputs[key]) {
                    this.calculator.inputs[key].value = preset[key];
                }
            });
            this.calculator.calculateDamage();
            this.calculator.saveValues(); // 保存预设值
        }
    }
}

// 历史记录管理
class HistoryManager {
    constructor() {
        this.maxHistorySize = 50; // 最多保存50条记录
        this.loadHistory();
        this.initElements();
    }

    initElements() {
        this.historyModal = document.getElementById('historyModal');
        this.historyList = document.getElementById('historyList');
        this.historyCount = document.getElementById('historyCount');
        this.saveRecordModal = document.getElementById('saveRecordModal');
        this.recordNameInput = document.getElementById('recordName');
        this.parameterPreview = document.getElementById('parameterPreview');
        
        // 调试：检查所有元素是否存在
        const elements = {
            historyModal: this.historyModal,
            historyList: this.historyList,
            historyCount: this.historyCount,
            saveRecordModal: this.saveRecordModal,
            recordNameInput: this.recordNameInput,
            parameterPreview: this.parameterPreview
        };
        
        console.log('=== 历史记录DOM元素检查 ===');
        let allElementsFound = true;
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                console.log(`✅ ${key} 元素找到`);
            } else {
                console.error(`❌ ${key} 元素未找到！`);
                allElementsFound = false;
            }
        });
        
        if (allElementsFound) {
            console.log('✅ 所有历史记录DOM元素初始化成功');
        } else {
            console.error('❌ 部分历史记录DOM元素初始化失败，历史记录功能可能无法正常工作');
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('damageCalculatorHistory');
            if (saved) {
                const parsedHistory = JSON.parse(saved);
                // 验证数据格式
                if (Array.isArray(parsedHistory)) {
                    this.history = parsedHistory;
                    console.log(`✅ 成功加载 ${this.history.length} 条历史记录`);
                } else {
                    console.warn('历史记录数据格式错误，重置为空数组');
                    this.history = [];
                    localStorage.removeItem('damageCalculatorHistory');
                }
            } else {
                this.history = [];
            }
        } catch (error) {
            console.error('加载历史记录失败:', error);
            console.warn('清除损坏的历史记录数据');
            this.history = [];
            localStorage.removeItem('damageCalculatorHistory');
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('damageCalculatorHistory', JSON.stringify(this.history));
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }

    addRecord(values, finalDamage, timestamp = null, name = null, isManual = false, modalData = null) {
        const record = {
            id: String(Date.now() + Math.random()), // 确保ID是字符串类型
            timestamp: timestamp || new Date().toISOString(),
            finalDamage: Math.round(finalDamage),
            parameters: { ...values },
            name: name,
            isManual: isManual,
            modalData: modalData || {} // 保存弹窗数据
        };

        this.history.unshift(record);
        
        // 限制历史记录数量
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(0, this.maxHistorySize);
        }

        this.saveHistory();
    }

    // 收集当前所有弹窗数据
    collectModalData() {
        const modalData = {};
        
        if (!window.modalManager) {
            console.log('modalManager未初始化，无法收集弹窗数据');
            return modalData;
        }

        // 改进的收集策略：
        // 1. 首先从localStorage读取保存的数据
        // 2. 如果DOM元素存在且有值，则用DOM值覆盖localStorage值
        // 3. 这样确保即使没有打开过弹窗也能收集到数据
        
        try {
            // 定义所有弹窗数据的映射关系
            const modalConfigs = {
                crit: {
                    storageKey: 'crit',
                    domElements: {
                        critRate: 'critRateInput',
                        critDamage: 'critDamageInput'
                    }
                },
                versatility: {
                    storageKey: 'versatility',
                    domElements: {
                        versatilityFixed: 'versatilityFixedInput',
                        versatilityAcquired: 'versatilityAcquiredInput',
                        versatilityQ: 'versatilityQInput'
                    }
                },
                thunderMark: {
                    storageKey: 'thunderMark',
                    domElements: {
                        thunderMarkCount: 'thunderMarkCountInput',
                        thunderMarkPercent: 'thunderMarkPercentInput'
                    }
                },
                mastery: {
                    storageKey: 'mastery',
                    domElements: {
                        masteryModalFixed: 'masteryModalFixedInput',
                        masteryModalAcquired: 'masteryModalAcquiredInput',
                        masteryModalJ: 'masteryModalJInput'
                    }
                },
                coefficient: {
                    storageKey: 'coefficient',
                    domElements: {
                        thunderMark: 'thunderMarkInput',
                        mastery: 'masteryInput',
                        coefficientMLocal: 'coefficientMLocal',
                        coefficientNLocal: 'coefficientNLocal'
                    }
                },
                damageIncrease: {
                    storageKey: 'damageIncrease',
                    domElements: {
                        bossIncrease: 'bossIncreaseInput',
                        distanceIncrease: 'distanceIncreaseInput'
                    },
                    specialHandler: 'collectDamageIncreaseData'
                },
                damageReduction: {
                    storageKey: 'damageReduction',
                    domElements: {
                        defenseValue: 'defenseValueInput',
                        damageReductionF: 'damageReductionFInput'
                    }
                },
                elementDamage: {
                    storageKey: 'elementDamage',
                    domElements: {
                        elementDamageFixed: 'elementDamageFixedInput',
                        elementDamageAcquired: 'elementDamageAcquiredInput',
                        elementDamageY: 'elementDamageYInput'
                    },
                    specialHandler: 'collectElementDamageData'
                },
                attack: {
                    storageKey: 'attack',
                    domElements: {
                        attackFixed: 'attackFixedInput',
                        attackMainStatTransform: 'attackMainStatTransformInput'
                    }
                },
                mainStatTransform: {
                    storageKey: 'mainStatTransform',
                    domElements: {
                        mainStatValue: 'mainStatValueInput',
                        gCoefficient: 'gCoefficientInput'
                    }
                },
                masteryTransform: {
                    storageKey: 'masteryTransform',
                    domElements: {
                        masteryTransformFixed: 'masteryTransformFixedInput',
                        masteryTransformAcquired: 'masteryTransformAcquiredInput',
                        masteryTransformY: 'masteryTransformYInput',
                        masteryTransformT: 'masteryTransformTInput',
                        masteryTransformBoostEnabled: 'masteryTransformBoostEnabledInput'
                    }
                },
                luckProbability: {
                    storageKey: 'luckProbability',
                    domElements: {
                        fixed: 'luckProbabilityFixedInput',
                        acquired: 'luckProbabilityAcquiredInput'
                    }
                },
                luckMultiplier: {
                    storageKey: 'luckMultiplier',
                    domElements: {
                        base: 'luckMultiplierBaseInput',
                        probability: 'luckMultiplierProbabilityInput',
                        x: 'luckMultiplierXInput'
                    }
                }
            };

            // 处理每个弹窗类型
            Object.keys(modalConfigs).forEach(modalType => {
                const config = modalConfigs[modalType];
                
                // 首先从localStorage读取
                let modalTypeData = {};
                const storageData = window.modalManager.loadModalValues(config.storageKey);
                if (storageData && typeof storageData === 'object') {
                    modalTypeData = { ...storageData };
                }
                
                // 然后检查DOM元素，如果存在且有值则覆盖
                let hasAnyDomData = false;
                Object.keys(config.domElements).forEach(field => {
                    const elementName = config.domElements[field];
                    const element = window.modalManager[elementName];
                    if (!element) return;
                    if (element.type === 'checkbox') {
                        modalTypeData[field] = element.checked;
                        hasAnyDomData = true;
                    } else if (element.value !== undefined && element.value !== '') {
                        modalTypeData[field] = element.value;
                        hasAnyDomData = true;
                    }
                });
                
                // 特殊处理动态数据（如增伤的自定义项目）
                if (config.specialHandler && this[config.specialHandler]) {
                    const specialData = this[config.specialHandler](modalTypeData);
                    if (specialData) {
                        modalTypeData = { ...modalTypeData, ...specialData };
                        hasAnyDomData = true;
                    }
                }
                
                // 如果有任何数据（localStorage或DOM），则添加到结果中
                if (Object.keys(modalTypeData).length > 0 && 
                    Object.values(modalTypeData).some(value => value !== '' && value !== undefined)) {
                    modalData[modalType] = modalTypeData;
                    console.log(`收集到${modalType}数据:`, modalTypeData);
                }
            });
            
            console.log('最终收集的弹窗数据:', modalData);
            
        } catch (error) {
            console.error('收集弹窗数据时出错:', error);
        }
        
        return modalData;
    }

    // 特殊处理增伤计算器的动态项目数据
    collectDamageIncreaseData(baseData) {
        if (!window.modalManager.dynamicDamageIncreases) {
            return null;
        }
        
        const dynamicIncreases = [];
        const items = window.modalManager.dynamicDamageIncreases.querySelectorAll('.damage-increase-item');
        items.forEach(item => {
            const input = item.querySelector('input[type="number"]');
            const label = item.querySelector('label');
            if (input && label) {
                dynamicIncreases.push({
                    name: label.textContent,
                    value: input.value || '0'
                });
            }
        });
        
        if (dynamicIncreases.length > 0) {
            return { dynamicIncreases };
        }
        
        return null;
    }

    // 特殊处理元素伤害计算器的动态项目数据
    collectElementDamageData(baseData) {
        if (!window.modalManager) {
            return null;
        }
        
        const data = {};
        
        // 收集固定值和精通转化值
        if (window.modalManager.elementDamageFixedInput) {
            data.elementDamageFixed = window.modalManager.elementDamageFixedInput.value || '0';
        }
        if (window.modalManager.elementDamageMasteryTransformInput) {
            data.elementDamageMasteryTransform = window.modalManager.elementDamageMasteryTransformInput.value || '0';
        }
        
        // 收集动态项目
        if (window.modalManager.dynamicElementDamageItems) {
            const elementDamageItems = [];
            const items = window.modalManager.dynamicElementDamageItems.querySelectorAll('.damage-increase-item');
            items.forEach(item => {
                const input = item.querySelector('input[type="number"]');
                const label = item.querySelector('label');
                if (input && label) {
                    elementDamageItems.push({
                        name: label.textContent,
                        value: input.value || '0'
                    });
                }
            });
            data.elementDamageItems = elementDamageItems;
        }
        
        // 如果有任何数据，返回数据对象
        if (Object.keys(data).length > 0) {
            return data;
        }
        
        return null;
    }

    // 通用的弹窗数据恢复方法
    applyModalDataForParameter(record, paramKey) {
        if (!record.modalData || !window.modalManager) {
            console.log('无弹窗数据或modalManager未初始化，跳过弹窗数据恢复');
            return [];
        }

        const appliedModalData = [];

        try {
            // 根据参数类型决定要恢复哪些弹窗数据
            const modalTypesToRestore = this.getModalTypesForParameter(paramKey);
            
            modalTypesToRestore.forEach(modalType => {
                if (record.modalData[modalType]) {
                    const success = this.restoreModalData(modalType, record.modalData[modalType]);
                    if (success) {
                        appliedModalData.push(modalType);
                    }
                }
            });

            console.log(`参数${paramKey}已应用并恢复了弹窗数据:`, appliedModalData);
            
        } catch (error) {
            console.error('恢复弹窗数据时出错:', error);
        }

        return appliedModalData;
    }

    // 获取参数对应的弹窗类型
    getModalTypesForParameter(paramKey) {
        const paramModalMap = {
            'coefficientM': ['coefficient'],
            'coefficientN': ['coefficient'],
            'damageIncrease': ['damageIncrease'],
            'versatility': ['versatility'],
            'expectedCrit': ['crit'],
            'damageReduction': ['damageReduction'],
            'elementDamage': ['elementDamage', 'masteryTransform'],
            'attack': ['attack', 'mainStatTransform'],
            'luckProbability': ['luckProbability'],
            'luckMultiplier': ['luckMultiplier'],
            // 可以根据需要添加更多映射
        };

        return paramModalMap[paramKey] || [];
    }

    // 恢复特定弹窗的数据到DOM元素
    restoreModalData(modalType, data) {
        if (!window.modalManager) return false;

        try {
            switch (modalType) {
                case 'coefficient':
                    return this.restoreCoefficientData(data);
                case 'damageIncrease':
                    return this.restoreDamageIncreaseData(data);
                case 'versatility':
                    return this.restoreVersatilityData(data);
                case 'crit':
                    return this.restoreCritData(data);
                case 'thunderMark':
                    return this.restoreThunderMarkData(data);
                case 'mastery':
                    return this.restoreMasteryData(data);
                case 'damageReduction':
                    return this.restoreDamageReductionData(data);
                case 'elementDamage':
                    return this.restoreElementDamageData(data);
                case 'masteryTransform':
                    return this.restoreMasteryTransformData(data);
                case 'attack':
                    return this.restoreAttackData(data);
                case 'mainStatTransform':
                    return this.restoreMainStatTransformData(data);
                case 'luckProbability':
                    return this.restoreLuckProbabilityData(data);
                case 'luckMultiplier':
                    return this.restoreLuckMultiplierData(data);
                default:
                    console.warn('未知的弹窗类型:', modalType);
                    return false;
            }
        } catch (error) {
            console.error(`恢复${modalType}弹窗数据失败:`, error);
            return false;
        }
    }

    // 恢复系数计算器数据
    restoreCoefficientData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.thunderMarkInput && data.thunderMark !== undefined) {
            manager.thunderMarkInput.value = data.thunderMark;
            restored = true;
        }
        if (manager.masteryInput && data.mastery !== undefined) {
            manager.masteryInput.value = data.mastery;
            restored = true;
        }
        if (manager.coefficientMLocal && data.coefficientMLocal !== undefined) {
            manager.coefficientMLocal.value = data.coefficientMLocal;
            restored = true;
        }
        if (manager.coefficientNLocal && data.coefficientNLocal !== undefined) {
            manager.coefficientNLocal.value = data.coefficientNLocal;
            restored = true;
        }

        // 保存到localStorage
        if (restored) {
            manager.saveModalValues('coefficient', data);
            // 触发系数计算更新
            if (manager.updateCoefficientCalculation) {
                manager.updateCoefficientCalculation();
            }
        }

        return restored;
    }

    // 恢复增伤计算器数据
    restoreDamageIncreaseData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.bossIncreaseInput && data.bossIncrease !== undefined) {
            manager.bossIncreaseInput.value = data.bossIncrease;
            restored = true;
        }
        if (manager.distanceIncreaseInput && data.distanceIncrease !== undefined) {
            manager.distanceIncreaseInput.value = data.distanceIncrease;
            restored = true;
        }

        // 恢复动态增伤项目
        if (data.dynamicIncreases && Array.isArray(data.dynamicIncreases) && manager.dynamicDamageIncreases) {
            // 清除现有的动态项目
            const existingItems = manager.dynamicDamageIncreases.querySelectorAll('.damage-increase-item');
            existingItems.forEach(item => item.remove());

            // 重新创建动态项目
            data.dynamicIncreases.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : `增伤项目${Date.now()}`;
                const itemValue = typeof item === 'object' ? item.value : item;
                
                if (manager.createDamageIncreaseItem) {
                    manager.createDamageIncreaseItem(itemName, itemValue);
                    restored = true;
                }
            });
        }

        // 保存到localStorage
        if (restored) {
            manager.saveModalValues('damageIncrease', data);
            // 触发增伤计算更新
            if (manager.calculateDamageIncrease) {
                manager.calculateDamageIncrease();
            }
        }

        return restored;
    }

    // 恢复全能增幅计算器数据
    restoreVersatilityData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.versatilityFixedInput && data.versatilityFixed !== undefined) {
            manager.versatilityFixedInput.value = data.versatilityFixed;
            restored = true;
        }
        if (manager.versatilityAcquiredInput && data.versatilityAcquired !== undefined) {
            manager.versatilityAcquiredInput.value = data.versatilityAcquired;
            restored = true;
        }
        if (manager.versatilityQInput && data.versatilityQ !== undefined) {
            manager.versatilityQInput.value = data.versatilityQ;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('versatility', data);
            if (manager.calculateVersatility) {
                manager.calculateVersatility();
            }
        }

        return restored;
    }

    // 恢复暴击计算器数据
    restoreCritData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.critRateInput && data.critRate !== undefined) {
            manager.critRateInput.value = data.critRate;
            restored = true;
        }
        if (manager.critDamageInput && data.critDamage !== undefined) {
            manager.critDamageInput.value = data.critDamage;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('crit', data);
            if (manager.calculateCritExpected) {
                manager.calculateCritExpected();
            }
        }

        return restored;
    }

    // 恢复雷印计算器数据
    restoreThunderMarkData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.thunderMarkCountInput && data.thunderMarkCount !== undefined) {
            manager.thunderMarkCountInput.value = data.thunderMarkCount;
            restored = true;
        }
        if (manager.thunderMarkPercentInput && data.thunderMarkPercent !== undefined) {
            manager.thunderMarkPercentInput.value = data.thunderMarkPercent;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('thunderMark', data);
            if (manager.calculateThunderMark) {
                manager.calculateThunderMark();
            }
        }

        return restored;
    }

    // 恢复精通增幅计算器数据
    restoreMasteryData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.masteryModalFixedInput && data.masteryModalFixed !== undefined) {
            manager.masteryModalFixedInput.value = data.masteryModalFixed;
            restored = true;
        }
        if (manager.masteryModalAcquiredInput && data.masteryModalAcquired !== undefined) {
            manager.masteryModalAcquiredInput.value = data.masteryModalAcquired;
            restored = true;
        }
        if (manager.masteryModalJInput && data.masteryModalJ !== undefined) {
            manager.masteryModalJInput.value = data.masteryModalJ;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('mastery', data);
            if (manager.calculateMasteryModal) {
                manager.calculateMasteryModal();
            }
        }

        return restored;
    }

    // 恢复减伤区计算器数据
    restoreDamageReductionData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.defenseValueInput && data.defenseValue !== undefined) {
            manager.defenseValueInput.value = data.defenseValue;
            restored = true;
        }
        if (manager.damageReductionFInput && data.damageReductionF !== undefined) {
            manager.damageReductionFInput.value = data.damageReductionF;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('damageReduction', data);
            if (manager.calculateDamageReduction) {
                manager.calculateDamageReduction();
            }
        }

        return restored;
    }

    // 恢复元素伤害计算器数据
    restoreElementDamageData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.elementDamageFixedInput && data.elementDamageFixed !== undefined) {
            manager.elementDamageFixedInput.value = data.elementDamageFixed;
            restored = true;
        }
        if (manager.elementDamageMasteryTransformInput && data.elementDamageMasteryTransform !== undefined) {
            manager.elementDamageMasteryTransformInput.value = data.elementDamageMasteryTransform;
            restored = true;
        }

        // 恢复动态元素伤害项目
        if (data.elementDamageItems && Array.isArray(data.elementDamageItems) && manager.dynamicElementDamageItems) {
            // 清除现有的动态项目
            const existingItems = manager.dynamicElementDamageItems.querySelectorAll('.damage-increase-item');
            existingItems.forEach(item => item.remove());

            // 重新创建动态项目
            data.elementDamageItems.forEach(item => {
                const itemName = typeof item === 'object' ? item.name : `元素伤害项目${Date.now()}`;
                const itemValue = typeof item === 'object' ? item.value : item;
                
                if (manager.createElementDamageItem) {
                    manager.createElementDamageItem(itemName, itemValue);
                    restored = true;
                }
            });
        }

        if (restored) {
            manager.saveModalValues('elementDamage', data);
            if (manager.calculateElementDamage) {
                manager.calculateElementDamage();
            }
        }

        return restored;
    }

            // 恢复精通转化数据
    restoreMasteryTransformData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.masteryTransformFixedInput && data.masteryTransformFixed !== undefined) {
            manager.masteryTransformFixedInput.value = data.masteryTransformFixed;
            restored = true;
        }
        if (manager.masteryTransformAcquiredInput && data.masteryTransformAcquired !== undefined) {
            manager.masteryTransformAcquiredInput.value = data.masteryTransformAcquired;
            restored = true;
        }
        if (manager.masteryTransformYInput && data.masteryTransformY !== undefined) {
            manager.masteryTransformYInput.value = data.masteryTransformY;
            restored = true;
        }
        if (manager.masteryTransformTInput && data.masteryTransformT !== undefined) {
            manager.masteryTransformTInput.value = data.masteryTransformT;
            restored = true;
        }
        if (manager.masteryTransformBoostEnabledInput && data.masteryTransformBoostEnabled !== undefined) {
            manager.masteryTransformBoostEnabledInput.checked = data.masteryTransformBoostEnabled;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('masteryTransform', data);
            if (manager.calculateMasteryTransform) {
                manager.calculateMasteryTransform();
            }
        }

        return restored;
    }

    // 恢复攻击力计算器数据
    restoreAttackData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.attackFixedInput && data.attackFixed !== undefined) {
            manager.attackFixedInput.value = data.attackFixed;
            restored = true;
        }
        if (manager.attackMainStatTransformInput && data.attackMainStatTransform !== undefined) {
            manager.attackMainStatTransformInput.value = data.attackMainStatTransform;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('attack', data);
            if (manager.calculateAttack) {
                manager.calculateAttack();
            }
        }

        return restored;
    }

    // 恢复主属性转化计算器数据
    restoreMainStatTransformData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.mainStatValueInput && data.mainStatValue !== undefined) {
            manager.mainStatValueInput.value = data.mainStatValue;
            restored = true;
        }
        if (manager.gCoefficientInput && data.gCoefficient !== undefined) {
            manager.gCoefficientInput.value = data.gCoefficient;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('mainStatTransform', data);
            if (manager.calculateMainStatTransform) {
                manager.calculateMainStatTransform();
            }
        }

        return restored;
    }

    // 恢复幸运概率计算器数据
    restoreLuckProbabilityData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.luckProbabilityFixedInput && data.fixed !== undefined) {
            manager.luckProbabilityFixedInput.value = data.fixed;
            restored = true;
        }
        if (manager.luckProbabilityAcquiredInput && data.acquired !== undefined) {
            manager.luckProbabilityAcquiredInput.value = data.acquired;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('luckProbability', data);
            if (manager.calculateLuckProbability) {
                manager.calculateLuckProbability();
            }
        }

        return restored;
    }

    // 恢复幸运倍率计算器数据
    restoreLuckMultiplierData(data) {
        const manager = window.modalManager;
        let restored = false;

        if (manager.luckMultiplierBaseInput && data.base !== undefined) {
            manager.luckMultiplierBaseInput.value = data.base;
            restored = true;
        }
        if (manager.luckMultiplierProbabilityInput && data.probability !== undefined) {
            manager.luckMultiplierProbabilityInput.value = data.probability;
            restored = true;
        }
        if (manager.luckMultiplierXInput && data.x !== undefined) {
            manager.luckMultiplierXInput.value = data.x;
            restored = true;
        }

        if (restored) {
            manager.saveModalValues('luckMultiplier', data);
            if (manager.calculateLuckMultiplier) {
                manager.calculateLuckMultiplier();
            }
        }

        return restored;
    }

    // 手动保存当前记录
    saveCurrentRecord(name) {
        if (!window.damageCalculator) {
            console.error('damageCalculator未初始化');
            alert('计算器未初始化，无法保存记录');
            return;
        }
        
        try {
            const values = window.damageCalculator.getInputValues();
            const finalDamage = window.damageCalculator.calculateCurrentDamage();
            const modalData = this.collectModalData();
            
            console.log('保存记录:', name, '参数:', values, '伤害:', finalDamage, '弹窗数据:', modalData);
            
            this.addRecord(values, finalDamage, null, name, true, modalData);
            this.closeSaveRecordModal();
            
            alert(`记录"${name}"已保存成功！`);
        } catch (error) {
            console.error('保存记录时出错:', error);
            alert('保存记录失败，请检查控制台错误信息');
        }
    }

    // 预览当前参数
    previewCurrentParameters() {
        if (!window.damageCalculator) return;
        
        const values = window.damageCalculator.getInputValues();
        const finalDamage = window.damageCalculator.calculateCurrentDamage();
        
        const parameterCategories = {
            '基础属性': {
                '攻击力': values.attack,
                '倍率': values.multiplier,
                '减伤区': values.damageReduction,
                '固定值': values.fixedValue,
                '幸运概率': values.luckProbability,
                '幸运倍率': values.luckMultiplier
            },
            '攻击加成': {
                '精炼攻击': values.refineAttack,
                '元素攻击': values.elementAttack
            },
            '系数设置': {
                '系数 M': values.coefficientM,
                '系数 N': values.coefficientN
            },
            '乘区设置': {
                '增伤': values.damageIncrease,
                '元素伤害': values.elementDamage,
                '全能增幅': values.versatility,
                '易伤': values.vulnerability,
                '爆伤期望': values.expectedCrit
            },
            '计算结果': {
                '最终伤害': Math.round(finalDamage).toLocaleString()
            }
        };

        let html = '';
        Object.keys(parameterCategories).forEach(category => {
            html += `<div class="preview-category">
                <h4>${category}</h4>
                <div class="preview-params">`;
            
            Object.keys(parameterCategories[category]).forEach(param => {
                const value = parameterCategories[category][param];
                html += `<span class="preview-param">${param}: ${value}</span>`;
            });
            
            html += `</div></div>`;
        });

        this.parameterPreview.innerHTML = html;
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    deleteRecord(recordId) {
        console.log('deleteRecord 被调用，参数类型:', typeof recordId, '值:', recordId);
        console.log('现有记录数量:', this.history.length);
        console.log('现有记录ID列表:', this.history.map(r => `${r.id} (${typeof r.id})`));
        
        // 确保recordId是字符串类型
        const targetId = String(recordId);
        console.log('目标ID (转换后):', targetId, '类型:', typeof targetId);
        
        const recordToDelete = this.history.find(record => String(record.id) === targetId);
        if (!recordToDelete) {
            console.error('找不到要删除的记录:', targetId);
            console.error('搜索失败，所有记录信息:');
            this.history.forEach((record, index) => {
                console.error(`记录${index}:`, {
                    id: record.id,
                    idType: typeof record.id,
                    name: record.name,
                    isMatch: String(record.id) === targetId
                });
            });
            alert('找不到要删除的记录');
            return false;
        }

        console.log('找到要删除的记录:', recordToDelete.name || '无名记录');
        this.history = this.history.filter(record => String(record.id) !== targetId);
        this.saveHistory();
        this.renderHistory();
        
        const recordName = recordToDelete.name ? `"${recordToDelete.name}"` : '该条记录';
        console.log(`已删除历史记录: ${recordName} (ID: ${targetId})`);
        return true;
    }

    applyRecord(recordId) {
        console.log('尝试应用记录:', recordId, '类型:', typeof recordId);
        const targetId = String(recordId);
        const record = this.history.find(r => String(r.id) === targetId);
        if (!record) {
            console.error('找不到记录:', targetId);
            console.error('现有记录ID列表:', this.history.map(r => `${r.id} (${typeof r.id})`));
            alert('找不到指定记录');
            return;
        }
        
        if (!window.damageCalculator) {
            console.error('计算器未初始化');
            alert('计算器未初始化，无法应用参数');
            return;
        }
        
        try {
            console.log('应用记录参数:', record.parameters);
            console.log('当前计算器输入框:', window.damageCalculator.inputs);
            
            // 应用参数到界面
            let appliedCount = 0;
            Object.keys(record.parameters).forEach(key => {
                const inputElement = window.damageCalculator.inputs[key];
                if (inputElement && record.parameters[key] !== undefined) {
                    const oldValue = inputElement.value;
                    inputElement.value = record.parameters[key];
                    
                    // 触发input事件确保界面更新
                    const event = new Event('input', { bubbles: true, cancelable: true });
                    inputElement.dispatchEvent(event);
                    
                    appliedCount++;
                    console.log(`应用参数 ${key}: ${oldValue} -> ${record.parameters[key]}`);
                } else {
                    console.warn(`跳过参数 ${key}: 输入框${inputElement ? '存在' : '不存在'}，值${record.parameters[key] !== undefined ? '已定义' : '未定义'}`);
                }
            });
            
            // 恢复所有可用的弹窗数据
            let restoredModalTypes = [];
            if (record.modalData && Object.keys(record.modalData).length > 0) {
                console.log('恢复所有弹窗数据:', record.modalData);
                
                // 恢复所有弹窗类型的数据
                Object.keys(record.modalData).forEach(modalType => {
                    const success = this.restoreModalData(modalType, record.modalData[modalType]);
                    if (success) {
                        restoredModalTypes.push(modalType);
                    }
                });
            }
            
            // 延时触发重新计算，确保所有值都已更新
            setTimeout(() => {
                window.damageCalculator.calculateDamage();
            }, 100);
            
            // 关闭相关弹窗
            this.closeModal();
            if (window.closeParameterSelectModal) {
                window.closeParameterSelectModal();
            }
            
            // 生成详细提示信息
            const recordName = record.name ? `"${record.name}"` : '该记录';
            let alertMessage = `${recordName}的全部参数已应用到计算器（共应用${appliedCount}个参数）`;
            
            if (restoredModalTypes.length > 0) {
                alertMessage += '\n同时恢复了以下计算器数据：';
                
                restoredModalTypes.forEach(modalType => {
                    const modalData = record.modalData[modalType];
                    switch (modalType) {
                        case 'attack':
                            alertMessage += `\n• 攻击力: 固定值=${modalData.attackFixed || '0'}, 主属性转化=${modalData.attackMainStatTransform || '0'}`;
                            break;
                        case 'mainStatTransform':
                            alertMessage += `\n• 主属性转化: 主属性=${modalData.mainStatValue || '0'}, G系数=${modalData.gCoefficient || '0'}`;
                            break;
                        case 'damageReduction':
                            alertMessage += `\n• 减伤区: 防御值=${modalData.defenseValue || '0'}, F系数=${modalData.damageReductionF || '0'}`;
                            break;
                        case 'coefficient':
                            alertMessage += `\n• 系数: 雷印=${modalData.thunderMark || '0'}, 精通=${modalData.mastery || '0'}`;
                            break;
                        case 'thunderMark':
                            alertMessage += `\n• 雷印: 个数=${modalData.thunderMarkCount || '0'}, 百分比=${modalData.thunderMarkPercent || '0'}%`;
                            break;
                        case 'mastery':
                            alertMessage += `\n• 精通增幅: 固定值=${modalData.masteryModalFixed || '0'}, 获取量=${modalData.masteryModalAcquired || '0'}`;
                            break;
                        case 'masteryTransform':
                            alertMessage += `\n• 精通转化: 固定值=${modalData.masteryTransformFixed || '0'}, 获取量=${modalData.masteryTransformAcquired || '0'}, Y系数=${modalData.masteryTransformY || '0'}, T系数=${modalData.masteryTransformT || '1.0'}, 精通增效=${modalData.masteryTransformBoostEnabled === false ? '关闭' : '开启'}`;
                            break;
                        case 'damageIncrease':
                            const dynamicCount = modalData.dynamicIncreases ? modalData.dynamicIncreases.length : 0;
                            alertMessage += `\n• 增伤: 首领增伤=${modalData.bossIncrease || '0'}%, 距离加成=${modalData.distanceIncrease || '0'}%`;
                            if (dynamicCount > 0) {
                                alertMessage += `, 自定义项目=${dynamicCount}个`;
                            }
                            break;
                        case 'elementDamage':
                            const elementDamageItemsCount = modalData.elementDamageItems ? modalData.elementDamageItems.length : 0;
                            alertMessage += `\n• 元素伤害: 固定值=${modalData.elementDamageFixed || '0'}, 精通转化=${modalData.elementDamageMasteryTransform || '0'}`;
                            if (elementDamageItemsCount > 0) {
                                alertMessage += `, 其他项目=${elementDamageItemsCount}个`;
                            }
                            break;
                        case 'versatility':
                            alertMessage += `\n• 全能增幅: 固定值=${modalData.versatilityFixed || '0'}, 获取量=${modalData.versatilityAcquired || '0'}`;
                            break;
                        case 'crit':
                            alertMessage += `\n• 爆伤期望: 暴击率=${modalData.critRate || '0'}%, 暴击伤害=${modalData.critDamage || '0'}%`;
                            break;
                        case 'luckProbability':
                            alertMessage += `\n• 幸运概率: 固定值=${modalData.fixed || '0'}, 获取量=${modalData.acquired || '0'}`;
                            break;
                        case 'luckMultiplier':
                            alertMessage += `\n• 幸运倍率: 基础40%=${modalData.base || '0.4'}, 幸运概率=${modalData.probability || '0'}, X系数=${modalData.x || '1.0'}`;
                            break;
                    }
                });
            } else if (record.modalData && Object.keys(record.modalData).length > 0) {
                alertMessage += '\n（部分计算器数据恢复失败，请检查控制台）';
            } else {
                alertMessage += '\n（该记录未包含计算器数据）';
            }
            
            // 使用自定义弹窗显示应用结果  
            openApplyDataModal(recordName, appliedCount, restoredModalTypes, record.modalData || {});
        } catch (error) {
            console.error('应用记录时出错:', error);
            alert('应用记录失败，请检查控制台错误信息');
        }
    }

    // 应用单个参数
    applySingleParameter(recordId, paramKey) {
        console.log('尝试应用单个参数:', recordId, paramKey, '类型:', typeof recordId);
        
        const targetId = String(recordId);
        const record = this.history.find(r => String(r.id) === targetId);
        if (!record) {
            console.error('找不到记录:', targetId);
            console.error('现有记录ID列表:', this.history.map(r => `${r.id} (${typeof r.id})`));
            alert('找不到指定记录');
            return;
        }
        
        if (!window.damageCalculator) {
            console.error('计算器未初始化');
            alert('计算器未初始化，无法应用参数');
            return;
        }
        
        if (record.parameters[paramKey] === undefined) {
            console.error('记录中没有该参数:', paramKey);
            alert(`记录中没有参数: ${paramKey}`);
            return;
        }
        
        const inputElement = window.damageCalculator.inputs[paramKey];
        if (!inputElement) {
            console.error('找不到参数输入框:', paramKey);
            console.log('可用的输入框:', Object.keys(window.damageCalculator.inputs));
            alert(`找不到参数输入框: ${paramKey}`);
            return;
        }
        
        try {
            const oldValue = inputElement.value;
            inputElement.value = record.parameters[paramKey];
            
            // 触发input事件以确保计算更新
            const event = new Event('input', { bubbles: true, cancelable: true });
            inputElement.dispatchEvent(event);
            
            const paramNames = {
                'attack': '攻击力',
                'multiplier': '倍率',
                'damageReduction': '减伤区',
                'refineAttack': '精炼攻击',
                'elementAttack': '元素攻击',
                'fixedValue': '固定值',
                'coefficientM': '系数M',
                'coefficientN': '系数N',
                'damageIncrease': '增伤',
                'elementDamage': '元素伤害',
                'versatility': '全能增幅',
                'vulnerability': '易伤',
                'expectedCrit': '爆伤期望',
                'luckProbability': '幸运概率',
                'luckMultiplier': '幸运倍率'
            };
            
            // 尝试恢复相关弹窗数据（通用处理，适用于所有参数）
            let appliedModalTypes = [];
            if (record.modalData && Object.keys(record.modalData).length > 0) {
                appliedModalTypes = this.applyModalDataForParameter(record, paramKey);
            } else {
                console.log('该记录未包含弹窗数据（可能是旧版本记录）');
            }
            
            const paramName = paramNames[paramKey] || paramKey;
            console.log(`成功应用参数 ${paramName}: ${oldValue} -> ${record.parameters[paramKey]}`);
            
            // 生成提示信息
            let alertMessage = `已应用${paramName}: ${record.parameters[paramKey]}`;
            
            if (appliedModalTypes.length > 0) {
                alertMessage += '\n\n同时恢复了以下计算器数据：';
                
                appliedModalTypes.forEach(modalType => {
                    const modalData = record.modalData[modalType];
                    switch (modalType) {
                        case 'attack':
                            alertMessage += `\n• 攻击力: 固定值=${modalData.attackFixed || '0'}, 主属性转化=${modalData.attackMainStatTransform || '0'}`;
                            break;
                        case 'mainStatTransform':
                            alertMessage += `\n• 主属性转化: 主属性=${modalData.mainStatValue || '0'}, G系数=${modalData.gCoefficient || '0'}`;
                            break;
                        case 'damageReduction':
                            alertMessage += `\n• 减伤区: 防御值=${modalData.defenseValue || '0'}, F系数=${modalData.damageReductionF || '0'}`;
                            break;
                        case 'coefficient':
                            alertMessage += `\n• 系数: 雷印=${modalData.thunderMark || '0'}, 精通=${modalData.mastery || '0'}`;
                            break;
                        case 'thunderMark':
                            alertMessage += `\n• 雷印: 个数=${modalData.thunderMarkCount || '0'}, 百分比=${modalData.thunderMarkPercent || '0'}%`;
                            break;
                        case 'mastery':
                            alertMessage += `\n• 精通增幅: 固定值=${modalData.masteryModalFixed || '0'}, 获取量=${modalData.masteryModalAcquired || '0'}`;
                            break;
                        case 'masteryTransform':
                            alertMessage += `\n• 精通转化: 固定值=${modalData.masteryTransformFixed || '0'}, 获取量=${modalData.masteryTransformAcquired || '0'}, Y系数=${modalData.masteryTransformY || '0'}, T系数=${modalData.masteryTransformT || '1.0'}, 精通增效=${modalData.masteryTransformBoostEnabled === false ? '关闭' : '开启'}`;
                            break;
                        case 'damageIncrease':
                            const dynamicCount = modalData.dynamicIncreases ? modalData.dynamicIncreases.length : 0;
                            alertMessage += `\n• 增伤: 首领增伤=${modalData.bossIncrease || '0'}%, 距离加成=${modalData.distanceIncrease || '0'}%`;
                            if (dynamicCount > 0) {
                                alertMessage += `, 自定义项目=${dynamicCount}个`;
                            }
                            break;
                        case 'elementDamage':
                            const elementDamageItemsCount = modalData.elementDamageItems ? modalData.elementDamageItems.length : 0;
                            alertMessage += `\n• 元素伤害: 固定值=${modalData.elementDamageFixed || '0'}, 精通转化=${modalData.elementDamageMasteryTransform || '0'}`;
                            if (elementDamageItemsCount > 0) {
                                alertMessage += `, 其他项目=${elementDamageItemsCount}个`;
                            }
                            break;
                        case 'versatility':
                            alertMessage += `\n• 全能增幅: 固定值=${modalData.versatilityFixed || '0'}, 获取量=${modalData.versatilityAcquired || '0'}`;
                            break;
                        case 'crit':
                            alertMessage += `\n• 爆伤期望: 暴击率=${modalData.critRate || '0'}%, 暴击伤害=${modalData.critDamage || '0'}%`;
                            break;
                        case 'luckProbability':
                            alertMessage += `\n• 幸运概率: 固定值=${modalData.fixed || '0'}, 获取量=${modalData.acquired || '0'}`;
                            break;
                        case 'luckMultiplier':
                            alertMessage += `\n• 幸运倍率: 基础40%=${modalData.base || '0.4'}, 幸运概率=${modalData.probability || '0'}, X系数=${modalData.x || '1.0'}`;
                            break;
                    }
                });
            } else if (record.modalData && Object.keys(record.modalData).length > 0) {
                alertMessage += '\n（该参数未关联特定计算器数据）';
            } else {
                alertMessage += '\n（该记录未包含计算器数据）';
            }
            
            alert(alertMessage);
            
            // 延时触发重新计算
            setTimeout(() => {
                window.damageCalculator.calculateDamage();
            }, 50);
            
            // 不自动关闭参数选择弹窗，让用户可以继续选择其他参数
        } catch (error) {
            console.error('应用单个参数时出错:', error);
            alert('应用参数失败，请检查控制台错误信息');
        }
    }

    // 打开参数选择弹窗
    openParameterSelectModal(recordId) {
        console.log('打开参数选择弹窗，记录ID:', recordId, '类型:', typeof recordId);
        const targetId = String(recordId);
        const record = this.history.find(r => String(r.id) === targetId);
        if (!record) {
            console.error('找不到记录:', targetId);
            console.error('现有记录ID列表:', this.history.map(r => `${r.id} (${typeof r.id})`));
            alert('找不到指定记录');
            return;
        }

        const parameterCategories = {
            '基础属性': ['attack', 'multiplier', 'damageReduction', 'fixedValue', 'luckProbability', 'luckMultiplier'],
            '攻击加成': ['refineAttack', 'elementAttack'],
            '系数设置': ['coefficientM', 'coefficientN'],
            '乘区设置': ['damageIncrease', 'elementDamage', 'versatility', 'vulnerability', 'expectedCrit']
        };

        const paramNames = {
            'attack': '攻击力',
            'multiplier': '倍率',
            'damageReduction': '减伤区',
            'refineAttack': '精炼攻击',
            'elementAttack': '元素攻击',
            'fixedValue': '固定值',
            'coefficientM': '系数M',
            'coefficientN': '系数N',
            'damageIncrease': '增伤',
            'elementDamage': '元素伤害',
            'versatility': '全能增幅',
            'vulnerability': '易伤',
            'expectedCrit': '爆伤期望',
            'luckProbability': '幸运概率',
            'luckMultiplier': '幸运倍率'
        };

        let html = `
            <div class="parameter-select-modal">
                <h3>选择要应用的参数</h3>
                <div class="record-name">${record.name ? `记录: ${record.name}` : '自动保存记录'}</div>
        `;

        Object.keys(parameterCategories).forEach(category => {
            html += `<div class="param-select-category">
                <h4>${category}</h4>
                <div class="param-select-list">`;
            
            parameterCategories[category].forEach(paramKey => {
                const value = record.parameters[paramKey];
                const paramName = paramNames[paramKey];
                html += `
                    <div class="param-select-item">
                        <span class="param-info">${paramName}: ${value}</span>
                        <button class="btn btn-small" onclick="window.historyManager.applySingleParameter('${recordId}', '${paramKey}')">应用</button>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        });

        html += `
                <div class="param-select-actions">
                    <button class="btn" onclick="window.historyManager.applyRecord('${recordId}')">📋 应用全部参数</button>
                    <button class="btn btn-secondary" onclick="closeParameterSelectModal()">取消</button>
                </div>
            </div>
        `;

        // 创建临时弹窗
        const modalHtml = `
            <div id="parameterSelectModal" class="modal" style="display: block;">
                <div class="modal-content parameter-select-modal-content">
                    <span class="close" onclick="closeParameterSelectModal()">&times;</span>
                    ${html}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // 添加点击空白处关闭功能
        const modal = document.getElementById('parameterSelectModal');
        
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(modal);
        }
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                closeParameterSelectModal();
            }
        };
    }

    renderHistory() {
        console.log('=== 开始渲染历史记录 ===');
        console.log('历史记录数量:', this.history.length);
        console.log('historyList元素:', this.historyList);
        console.log('historyCount元素:', this.historyCount);
        
        if (!this.historyList) {
            console.error('❌ historyList 元素不存在');
            return;
        }
        
        if (!this.historyCount) {
            console.error('❌ historyCount 元素不存在');
            return;
        }
        
        if (this.history.length === 0) {
            console.log('📝 显示空状态');
            this.historyList.innerHTML = `
                <div class="history-empty">
                    <p>暂无计算历史记录</p>
                    <p>进行伤害计算或手动保存记录后，记录将显示在这里</p>
                </div>
            `;
            this.historyCount.textContent = '0';
            return;
        }

        let html = '';
        this.history.forEach((record, index) => {
            try {
                // 数据安全检查
                if (!record || !record.parameters) {
                    console.warn(`跳过记录 ${index}: 数据不完整`, record);
                    return;
                }
                
            const date = new Date(record.timestamp);
            const formattedDate = date.toLocaleString('zh-CN');
            const recordType = record.isManual ? '手动保存' : '自动保存';
            const recordTypeClass = record.isManual ? 'manual-record' : 'auto-record';
                
                // 确保所有必要的参数都存在，如果不存在则使用默认值
                const safeParams = {
                    attack: record.parameters.attack || 0,
                    multiplier: record.parameters.multiplier || 1,
                    damageReduction: record.parameters.damageReduction || 1,
                    fixedValue: record.parameters.fixedValue || 0,
                    luckProbability: record.parameters.luckProbability || 0,
                    luckMultiplier: record.parameters.luckMultiplier || 0.4,
                    refineAttack: record.parameters.refineAttack || 0,
                    elementAttack: record.parameters.elementAttack || 0,
                    coefficientM: record.parameters.coefficientM || 1,
                    coefficientN: record.parameters.coefficientN || 1,
                    damageIncrease: record.parameters.damageIncrease || 1,
                    elementDamage: record.parameters.elementDamage || 1,
                    versatility: record.parameters.versatility || 1,
                    vulnerability: record.parameters.vulnerability || 1,
                    expectedCrit: record.parameters.expectedCrit || 1
                };
                
                const safeFinalDamage = (record.finalDamage && typeof record.finalDamage === 'number') 
                    ? record.finalDamage 
                    : 0;
            
            html += `
                <div class="history-item ${recordTypeClass}" data-id="${record.id || 'unknown'}">
                    <div class="history-header">
                        <div class="history-title">
                            <div class="history-damage">${safeFinalDamage.toLocaleString()} 伤害</div>
                            ${record.name ? `<div class="record-name">${record.name}</div>` : ''}
                            <div class="record-type">${recordType}</div>
                        </div>
                        <div class="history-time">${formattedDate}</div>
                    </div>
                    <div class="history-parameters">
                        <div class="param-section">
                            <div class="param-category">基础属性</div>
                            <div class="param-row">
                                <span>攻击力: ${safeParams.attack}</span>
                                <span>倍率: ${safeParams.multiplier}</span>
                                <span>减伤区: ${safeParams.damageReduction}</span>
                                <span>固定值: ${safeParams.fixedValue}</span>
                            </div>
                            <div class="param-row">
                                <span>幸运概率: ${safeParams.luckProbability}</span>
                                <span>幸运倍率: ${safeParams.luckMultiplier}</span>
                            </div>
                        </div>
                        <div class="param-section">
                            <div class="param-category">攻击加成</div>
                            <div class="param-row">
                                <span>精炼: ${safeParams.refineAttack}</span>
                                <span>元素: ${safeParams.elementAttack}</span>
                            </div>
                        </div>
                        <div class="param-section">
                            <div class="param-category">系数设置</div>
                            <div class="param-row">
                                <span>系数M: ${safeParams.coefficientM}</span>
                                <span>系数N: ${safeParams.coefficientN}</span>
                            </div>
                        </div>
                        <div class="param-section">
                            <div class="param-category">乘区设置</div>
                            <div class="param-row">
                                <span>增伤: ${safeParams.damageIncrease}</span>
                                <span>元素伤害: ${safeParams.elementDamage}</span>
                                <span>全能: ${safeParams.versatility}</span>
                                <span>易伤: ${safeParams.vulnerability}</span>
                                <span>爆伤: ${safeParams.expectedCrit}</span>
                            </div>
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn-small" onclick="window.historyManager.applyRecord('${record.id || 'unknown'}')">📋 应用全部</button>
                        <button class="btn btn-small" onclick="window.historyManager.openParameterSelectModal('${record.id || 'unknown'}')">🎯 选择应用</button>
                        <button class="btn btn-small btn-warning" onclick="window.deleteHistoryRecord('${record.id || 'unknown'}')">🗑️ 删除</button>
                    </div>
                </div>
            `;
            } catch (error) {
                console.error(`渲染记录 ${index} 时出错:`, error, record);
                // 如果单个记录渲染失败，跳过该记录继续处理其他记录
            }
        });

        console.log('📝 准备设置HTML内容，长度:', html.length);
        console.log('HTML预览（前200字符）:', html.substring(0, 200));

        this.historyList.innerHTML = html;
        this.historyCount.textContent = this.history.length.toString();
        
        console.log('✅ 历史记录渲染完成');
        console.log('historyList.innerHTML设置完成，当前子元素数量:', this.historyList.children.length);
    }

    exportHistory() {
        if (this.history.length === 0) {
            alert('没有历史记录可以导出');
            return;
        }

        let exportText = 'STAR伤害计算器历史记录\n\n';
        exportText += '=' .repeat(36) + '\n\n';

        this.history.forEach((record, index) => {
            const date = new Date(record.timestamp);
            const recordType = record.isManual ? '手动保存' : '自动保存';
            
            exportText += `记录 ${index + 1}:\n`;
            if (record.name) {
                exportText += `记录名称: ${record.name}\n`;
            }
            //exportText += `记录类型: ${recordType}\n`;
            //exportText += `保存时间: ${date.toLocaleString('zh-CN')}\n`;
            exportText += `最终伤害: ${record.finalDamage.toLocaleString()}\n`;
            
            /* ========================================
             * 📍 历史记录导出格式位置
             * 这里是历史记录导出为文本文件的格式定义
             * 采用分板块显示，用【】标记分组
             * 相关参数在同一行，用|分隔
             * ======================================== */
            
            // 详细参数 - 分板块显示
            exportText += `详细参数配置:\n`;
            
            // 基础属性板块
            exportText += `【基础属性】\n`;
            exportText += `攻击力: ${record.parameters.attack}  |  `;
            exportText += `倍率: ${record.parameters.multiplier}  |  `;
            exportText += `减伤区: ${record.parameters.damageReduction}  |  `;
            exportText += `固定值: ${record.parameters.fixedValue}\n`;
            exportText += `幸运概率: ${record.parameters.luckProbability || 0}  |  `;
            exportText += `幸运倍率: ${record.parameters.luckMultiplier || 0.4}\n`;
            
            // 攻击加成板块
            exportText += `【攻击加成】\n`;
            exportText += `精炼攻击: ${record.parameters.refineAttack}  |  `;
            exportText += `元素攻击: ${record.parameters.elementAttack}\n`;
            
            // 系数设置板块
            exportText += `【系数设置】\n`;
            exportText += `系数M: ${record.parameters.coefficientM}  |  `;
            exportText += `系数N: ${record.parameters.coefficientN}\n`;
            
            // 乘区设置板块
            exportText += `【乘区设置】\n`;
            exportText += `增伤: ${record.parameters.damageIncrease}  |  `;
            exportText += `元素伤害: ${record.parameters.elementDamage}  |  `;
            exportText += `全能增幅: ${record.parameters.versatility}\n`;
            exportText += `易伤: ${record.parameters.vulnerability}  |  `;
            exportText += `爆伤期望: ${record.parameters.expectedCrit}\n\n`;

            // 关键弹窗参数（如有）
            if (record.modalData && record.modalData.masteryTransform) {
                const mt = record.modalData.masteryTransform;
                exportText += `【精通转化计算器】\n`;
                exportText += `固定值: ${mt.masteryTransformFixed || '0'}  |  `;
                exportText += `获取量: ${mt.masteryTransformAcquired || '0'}  |  `;
                exportText += `Y系数: ${mt.masteryTransformY || '0'}  |  `;
                exportText += `T系数: ${mt.masteryTransformT || '1.0'}  |  `;
                exportText += `精通增效: ${mt.masteryTransformBoostEnabled === false ? '关闭(=1)' : '开启'}\n\n`;
            }
            
            exportText += '=' .repeat(36) + '\n\n';
        });

        // 创建下载链接
        const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `STAR伤害计算历史_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    openModal() {
        console.log('=== 打开历史记录弹窗 ===');
        console.log('历史记录数量:', this.history.length);
        console.log('historyModal元素:', this.historyModal);
        console.log('historyList元素:', this.historyList);
        
        try {
        this.renderHistory();
            console.log('✅ renderHistory 执行成功');
        } catch (error) {
            console.error('❌ renderHistory 执行失败:', error);
            alert('历史记录渲染失败，请查看控制台错误信息');
            return;
        }
        
        if (this.historyModal) {
        this.historyModal.style.display = 'block';
            
            // 使用z-index管理器分配最高层级
            if (window.zIndexManager) {
                window.zIndexManager.assignZIndex(this.historyModal);
            }
            
            console.log('✅ 历史记录弹窗已显示');
        
        // 添加点击空白处关闭功能
        this.historyModal.onclick = (e) => {
            if (e.target === this.historyModal) {
                this.closeModal();
            }
        };
        } else {
            console.error('❌ historyModal 元素不存在，无法显示弹窗');
            alert('历史记录弹窗初始化失败，请刷新页面重试');
        }
    }

    closeModal() {
        this.historyModal.style.display = 'none';
        // 移除点击事件监听器
        this.historyModal.onclick = null;
        
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.historyModal);
        }
    }

    // 保存记录弹窗相关方法
    openSaveRecordModal() {
        this.previewCurrentParameters();
        this.saveRecordModal.style.display = 'block';
        this.recordNameInput.focus();
        
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.saveRecordModal);
        }
        
        // 添加点击空白处关闭功能
        this.saveRecordModal.onclick = (e) => {
            if (e.target === this.saveRecordModal) {
                this.closeSaveRecordModal();
            }
        };
    }

    closeSaveRecordModal() {
        this.saveRecordModal.style.display = 'none';
        this.recordNameInput.value = '';
        // 移除点击事件监听器
        this.saveRecordModal.onclick = null;
        
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.saveRecordModal);
        }
    }
}

// 全局变量
let damageCalculator;
let historyManager;
let presetManager;

// 历史记录相关全局函数
function openHistoryModal() {
    if (window.historyManager) {
        window.historyManager.openModal();
    }
}

function closeHistoryModal() {
    if (window.historyManager) {
        window.historyManager.closeModal();
    }
}

function clearHistory() {
    if (window.historyManager) {
        window.historyManager.clearHistory();
    }
}

function exportHistory() {
    if (window.historyManager) {
        window.historyManager.exportHistory();
    }
}

// 全局z-index管理器
class ZIndexManager {
    constructor() {
        this.currentZIndex = 1000;
        this.modalStack = [];
    }
    
    // 为新弹窗分配z-index
    assignZIndex(modalElement) {
        this.currentZIndex += 10;
        modalElement.style.zIndex = this.currentZIndex;
        this.modalStack.push({
            element: modalElement,
            zIndex: this.currentZIndex
        });
        console.log(`为弹窗分配z-index: ${this.currentZIndex}`);
        return this.currentZIndex;
    }
    
    // 移除弹窗时清理z-index
    removeModal(modalElement) {
        const index = this.modalStack.findIndex(item => item.element === modalElement);
        if (index > -1) {
            this.modalStack.splice(index, 1);
            console.log(`移除弹窗，当前栈深度: ${this.modalStack.length}`);
        }
    }
    
    // 重置z-index管理器
    reset() {
        this.currentZIndex = 1000;
        this.modalStack = [];
        console.log('z-index管理器已重置');
    }
}

// 创建全局z-index管理器实例
window.zIndexManager = new ZIndexManager();

// 暴露到全局作用域
window.openHistoryModal = openHistoryModal;
window.closeHistoryModal = closeHistoryModal;
window.clearHistory = clearHistory;
window.exportHistory = exportHistory;

// 保存记录相关全局函数
function openSaveRecordModal() {
    if (window.historyManager) {
        window.historyManager.openSaveRecordModal();
    }
}

function closeSaveRecordModal() {
    if (window.historyManager) {
        window.historyManager.closeSaveRecordModal();
    }
}

function saveCurrentRecord() {
    if (window.historyManager) {
        const recordName = document.getElementById('recordName').value.trim();
        if (!recordName) {
            alert('请输入记录名称');
            return;
        }
        window.historyManager.saveCurrentRecord(recordName);
    }
}

// 暴露到全局作用域
window.openSaveRecordModal = openSaveRecordModal;
window.closeSaveRecordModal = closeSaveRecordModal;
window.saveCurrentRecord = saveCurrentRecord;

// 删除历史记录全局函数
function deleteHistoryRecord(recordId) {
    console.log('删除函数被调用，记录ID:', recordId);
    
    if (!window.historyManager) {
        console.error('历史管理器未初始化');
        alert('删除失败：历史管理器未初始化');
        return;
    }

    // 获取要删除的记录信息用于确认对话框
    const record = window.historyManager.history.find(r => r.id === recordId);
    if (!record) {
        console.error('找不到要删除的记录:', recordId);
        alert('找不到要删除的记录');
        return;
    }
    
    const recordName = record.name ? `"${record.name}"` : '该条记录';
    console.log('准备删除记录:', recordName);
    
    // 添加确认对话框
    if (confirm(`确定要删除${recordName}吗？删除后无法恢复。`)) {
        console.log('用户确认删除');
        const success = window.historyManager.deleteRecord(recordId);
        if (success) {
            console.log('历史记录删除成功:', recordId);
            alert(`${recordName}已删除`);
        } else {
            console.error('删除失败');
            alert('删除失败');
        }
    } else {
        console.log('用户取消删除');
    }
}

// 简化的删除函数，用于测试
function testDelete(recordId) {
    alert('测试删除函数被调用，记录ID: ' + recordId);
}

function closeParameterSelectModal() {
    const modal = document.getElementById('parameterSelectModal');
    if (modal) {
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(modal);
        }
        modal.remove();
        console.log('参数选择弹窗已关闭');
    }
}

// 应用数据详情弹窗管理函数
function openApplyDataModal(recordName, appliedCount, restoredModalTypes, modalData) {
    const modal = document.getElementById('applyDataModal');
    const summaryTitle = document.getElementById('applySummaryTitle');
    const summaryText = document.getElementById('applySummaryText');
    const appliedDataList = document.getElementById('appliedDataList');
    
    if (!modal || !summaryTitle || !summaryText || !appliedDataList) {
        console.error('应用数据弹窗元素未找到');
        return;
    }
    
    // 设置摘要信息
    summaryTitle.textContent = `${recordName}的数据应用详情`;
    summaryText.textContent = `已成功应用${appliedCount}个参数到计算器`;
    
    // 清空现有内容
    appliedDataList.innerHTML = '';
    appliedDataList.className = 'applied-data-list';
    
    if (restoredModalTypes.length > 0) {
        // 按照分组显示数据
        const categoryGroups = {
            '基础属性': ['attack', 'mainStatTransform', 'damageReduction', 'luckProbability', 'luckMultiplier'],
            '系数设置': ['coefficient', 'thunderMark', 'mastery'],
            '乘区设置': ['damageIncrease', 'elementDamage', 'masteryTransform', 'versatility', 'crit']
        };
        
        // 按分组处理数据
        Object.keys(categoryGroups).forEach(categoryName => {
            const categoryTypes = categoryGroups[categoryName];
            const categoryItems = [];
            
            // 收集该分组的数据项
            categoryTypes.forEach(modalType => {
                if (restoredModalTypes.includes(modalType)) {
                    const data = modalData[modalType];
                    const item = createAppliedDataItem(modalType, data);
                    if (item) {
                        categoryItems.push(item);
                    }
                }
            });
            
            // 如果有数据项，创建分组
            if (categoryItems.length > 0) {
                const categorySection = document.createElement('div');
                categorySection.className = 'applied-data-category';
                
                const categoryTitle = document.createElement('h4');
                categoryTitle.textContent = categoryName;
                categorySection.appendChild(categoryTitle);
                
                const categoryList = document.createElement('div');
                categoryList.className = 'applied-data-category-list';
                categoryItems.forEach(item => {
                    categoryList.appendChild(item);
                });
                categorySection.appendChild(categoryList);
                
                appliedDataList.appendChild(categorySection);
            }
        });
    } else {
        // 显示空状态
        appliedDataList.className = 'applied-data-list empty';
        appliedDataList.textContent = '该记录未包含计算器数据或数据恢复失败';
    }
    
    // 显示弹窗
    modal.style.display = 'block';
    // 使用z-index管理器分配最高层级
    if (window.zIndexManager) {
        window.zIndexManager.assignZIndex(modal);
    }
    
    // 添加点击空白处关闭功能
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeApplyDataModal();
        }
    });
}

function closeApplyDataModal() {
    const modal = document.getElementById('applyDataModal');
    if (modal) {
        modal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(modal);
        }
    }
}

// 创建应用数据项元素
function createAppliedDataItem(modalType, data) {
    const item = document.createElement('div');
    item.className = `applied-data-item ${getDataItemClass(modalType)}`;
    
    const title = document.createElement('div');
    title.className = 'data-title';
    
    const content = document.createElement('div');
    content.className = 'data-content';
    
    // 根据类型设置标题和内容
    switch (modalType) {
        case 'attack':
            title.textContent = '攻击力';
            content.textContent = `固定值: ${data.attackFixed || '0'}, 主属性转化: ${data.attackMainStatTransform || '0'}`;
            break;
        case 'mainStatTransform':
            title.textContent = '主属性转化';
            content.textContent = `主属性: ${data.mainStatValue || '0'}, G系数: ${data.gCoefficient || '0'}`;
            break;
        case 'damageReduction':
            title.textContent = '减伤区';
            content.textContent = `防御值: ${data.defenseValue || '0'}, F系数: ${data.damageReductionF || '0'}`;
            break;
        case 'coefficient':
            title.textContent = '系数';
            content.textContent = `雷印: ${data.thunderMark || '0'}, 精通: ${data.mastery || '0'}`;
            break;
        case 'thunderMark':
            title.textContent = '雷印';
            content.textContent = `个数: ${data.thunderMarkCount || '0'}, 百分比: ${data.thunderMarkPercent || '0'}%`;
            break;
        case 'mastery':
            title.textContent = '精通增幅';
            content.textContent = `固定值: ${data.masteryModalFixed || '0'}, 获取量: ${data.masteryModalAcquired || '0'}`;
            break;
        case 'masteryTransform':
            title.textContent = '精通转化';
            content.textContent = `固定值: ${data.masteryTransformFixed || '0'}, 获取量: ${data.masteryTransformAcquired || '0'}, Y系数: ${data.masteryTransformY || '0'}, T系数: ${data.masteryTransformT || '1.0'}, 精通增效: ${data.masteryTransformBoostEnabled === false ? '关闭(=1)' : '开启'}`;
            break;
        case 'damageIncrease':
            const dynamicCount = data.dynamicIncreases ? data.dynamicIncreases.length : 0;
            let text = `首领增伤: ${data.bossIncrease || '0'}%, 距离加成: ${data.distanceIncrease || '0'}%`;
            if (dynamicCount > 0) {
                text += `, 自定义项目: ${dynamicCount}个`;
            }
            title.textContent = '增伤';
            content.textContent = text;
            break;
        case 'elementDamage':
            const elementDamageItemsCount = data.elementDamageItems ? data.elementDamageItems.length : 0;
            let elementText = `固定值: ${data.elementDamageFixed || '0'}, 精通转化: ${data.elementDamageMasteryTransform || '0'}`;
            if (elementDamageItemsCount > 0) {
                elementText += `, 其他项目: ${elementDamageItemsCount}个`;
            }
            title.textContent = '元素伤害';
            content.textContent = elementText;
            break;
        case 'versatility':
            title.textContent = '全能增幅';
            content.textContent = `固定值: ${data.versatilityFixed || '0'}, 获取量: ${data.versatilityAcquired || '0'}`;
            break;
        case 'crit':
            title.textContent = '爆伤期望';
            content.textContent = `暴击率: ${data.critRate || '0'}%, 暴击伤害: ${data.critDamage || '0'}%`;
            break;
        case 'luckProbability':
            title.textContent = '幸运概率';
            content.textContent = `固定值: ${data.fixed || '0'}, 获取量: ${data.acquired || '0'}`;
            break;
        case 'luckMultiplier':
            title.textContent = '幸运倍率';
            content.textContent = `基础40%: ${data.base || '0.4'}, 幸运概率: ${data.probability || '0'}, X系数: ${data.x || '1.0'}`;
            break;
        default:
            return null;
    }
    
    item.appendChild(title);
    item.appendChild(content);
    return item;
}

// 获取数据项的CSS类名
function getDataItemClass(modalType) {
    const classMap = {
        'attack': 'attack',
        'mainStatTransform': 'main-stat',
        'damageReduction': 'damage-reduction',
        'coefficient': 'coefficient',
        'thunderMark': 'thunder-mark',
        'mastery': 'mastery',
        'masteryTransform': 'mastery-transform',
        'damageIncrease': 'damage-increase',
        'elementDamage': 'element-damage',
        'versatility': 'versatility',
        'crit': 'crit'
    };
    return classMap[modalType] || '';
}

// 确保函数在全局作用域可用
window.closeParameterSelectModal = closeParameterSelectModal;
window.deleteHistoryRecord = deleteHistoryRecord;
window.testDelete = testDelete;
window.openApplyDataModal = openApplyDataModal;
window.closeApplyDataModal = closeApplyDataModal;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    damageCalculator = new DamageCalculator();
    historyManager = new HistoryManager();
    presetManager = new PresetManager(damageCalculator);

    // 将所有管理器暴露到全局作用域
    window.damageCalculator = damageCalculator;
    window.historyManager = historyManager;
    window.presetManager = presetManager;

    // 将loadPreset函数暴露到全局作用域
    window.loadPreset = function(presetName) {
        presetManager.loadPreset(presetName);
    };

    // 测试函数：验证参数应用功能
    window.testParameterApplication = function() {
        console.log('测试参数应用功能...');
        console.log('damageCalculator:', window.damageCalculator);
        console.log('historyManager:', window.historyManager);
        console.log('输入框:', window.damageCalculator ? window.damageCalculator.inputs : '未初始化');
        console.log('历史记录数量:', window.historyManager ? window.historyManager.history.length : '未初始化');
    };

    // 测试删除功能
    window.testDeleteFunction = function() {
        console.log('测试删除功能...');
        console.log('deleteHistoryRecord 函数存在:', typeof window.deleteHistoryRecord);
        console.log('testDelete 函数存在:', typeof window.testDelete);
        console.log('historyManager 存在:', !!window.historyManager);
        if (window.historyManager && window.historyManager.history.length > 0) {
            console.log('第一条记录ID:', window.historyManager.history[0].id);
        }
    };

    // 测试弹窗数据收集功能
    window.testModalDataCollection = function() {
        console.log('=== 测试弹窗数据收集功能 ===');
        
        if (!window.modalManager) {
            console.error('❌ modalManager未初始化');
            alert('弹窗管理器未初始化，请刷新页面重试');
            return;
        }
        
        console.log('✅ modalManager已初始化');
        
        // 检查localStorage中的数据
        console.log('\n--- localStorage中的弹窗数据 ---');
        const storageKeys = ['modalCritValues', 'modalVersatilityValues', 'modalThunderMarkValues', 'modalMasteryValues', 'modalDamageIncreaseValues', 'modalCoefficientValues', 'modalDamageReductionValues', 'modalElementDamageValues'];
        let hasAnyData = false;
        
        storageKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                console.log(`${key}:`, JSON.parse(data));
                hasAnyData = true;
            } else {
                console.log(`${key}: 无数据`);
            }
        });
        
        if (!hasAnyData) {
            console.log('⚠️ localStorage中没有弹窗数据，请先打开一些弹窗并填入数据');
        }
        
        // 测试数据收集
        console.log('\n--- 测试collectModalData方法 ---');
        if (window.historyManager) {
            const collectedData = window.historyManager.collectModalData();
            console.log('收集的弹窗数据:', collectedData);
            
            if (Object.keys(collectedData).length > 0) {
                console.log('✅ 弹窗数据收集成功！');
                alert(`弹窗数据收集成功！\n\n收集到的数据类型：\n${Object.keys(collectedData).join('\n')}\n\n详细信息已输出到控制台`);
            } else {
                console.log('❌ 未收集到任何弹窗数据');
                alert('未收集到任何弹窗数据。\n\n请先：\n1. 打开一些计算器弹窗\n2. 填入一些数值\n3. 再次运行此测试');
            }
        } else {
            console.error('❌ historyManager未初始化');
            alert('历史记录管理器未初始化');
        }
        
        console.log('=== 测试完成 ===');
    };

    console.log('MMORPG伤害计算器已加载');
    console.log('可用预设: loadPreset("low"), loadPreset("medium"), loadPreset("high")');
    console.log('可用功能: 点击各项旁边的?号打开计算器');
    console.log('历史记录功能已启用，仅支持手动保存');
    console.log('调试功能: testParameterApplication() - 测试参数应用');
    console.log('调试功能: testDeleteFunction() - 测试删除功能');
    console.log('调试功能: testModalDataCollection() - 测试弹窗数据收集');
    
    // 自动测试删除功能
    setTimeout(() => {
        window.testDeleteFunction();
    }, 1000);
}); 