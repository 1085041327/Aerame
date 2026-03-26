// 弹窗管理类
class ModalManager {
    constructor() {
        // 定义各个弹窗的存储键
        this.storageKeys = {
            crit: 'modalCritValues',
            versatility: 'modalVersatilityValues',
            thunderMark: 'modalThunderMarkValues',
            mastery: 'modalMasteryValues',
            damageIncrease: 'modalDamageIncreaseValues',
            coefficient: 'modalCoefficientValues',
            damageReduction: 'modalDamageReductionValues',
            elementDamage: 'modalElementDamageValues',
            attack: 'modalAttackValues',
            mainStatTransform: 'modalMainStatTransformValues',
            masteryTransform: 'modalMasteryTransformValues',
            luckProbability: 'modalLuckProbabilityValues',
            luckMultiplier: 'modalLuckMultiplierValues'
        };
        
        this.initModals();
        this.initEventListeners();
        this.loadAllModalValues();
    }

    initModals() {
        console.log('初始化弹窗元素...');
        // 暴击计算弹窗
        this.critModal = document.getElementById('critModal');
        this.critRateInput = document.getElementById('critRate');
        this.critDamageInput = document.getElementById('critDamage');
        this.critResultElement = document.getElementById('critResult');
        
        if (!this.critModal) console.error('critModal元素未找到');
        if (!this.critRateInput) console.error('critRateInput元素未找到');
        if (!this.critDamageInput) console.error('critDamageInput元素未找到');
        if (!this.critResultElement) console.error('critResultElement元素未找到');

        // 全能增幅计算弹窗
        this.versatilityModal = document.getElementById('versatilityModal');
        this.versatilityFixedInput = document.getElementById('versatilityFixed');
        this.versatilityAcquiredInput = document.getElementById('versatilityAcquired');
        this.versatilityQInput = document.getElementById('versatilityQ');
        this.versatilityResultElement = document.getElementById('versatilityResult');
        this.versatilityAmplificationResultElement = document.getElementById('versatilityAmplificationResult');

        // 雷印计算弹窗
        this.thunderMarkModal = document.getElementById('thunderMarkModal');
        this.thunderMarkCountInput = document.getElementById('thunderMarkCount');
        this.thunderMarkPercentInput = document.getElementById('thunderMarkPercent');
        this.thunderMarkResultElement = document.getElementById('thunderMarkResult');

        // 精通增幅计算弹窗
        this.masteryModal = document.getElementById('masteryModal');
        this.masteryModalFixedInput = document.getElementById('masteryModalFixed');
        this.masteryModalAcquiredInput = document.getElementById('masteryModalAcquired');
        this.masteryModalJInput = document.getElementById('masteryModalJ');
        this.masteryModalResultElement = document.getElementById('masteryModalResult');
        this.masteryAmplificationResultElement = document.getElementById('masteryAmplificationResult');

        // 增伤计算弹窗
        this.damageIncreaseModal = document.getElementById('damageIncreaseModal');
        this.bossIncreaseInput = document.getElementById('bossIncrease');
        this.distanceIncreaseInput = document.getElementById('distanceIncrease');
        this.dynamicDamageIncreases = document.getElementById('dynamicDamageIncreases');
        this.damageIncreaseResultElement = document.getElementById('damageIncreaseResult');
        this.damageIncreaseCounter = 0;

        // 减伤区计算弹窗
        this.damageReductionModal = document.getElementById('damageReductionModal');
        this.defenseValueInput = document.getElementById('defenseValue');
        this.damageReductionFInput = document.getElementById('damageReductionF');
        this.defenseZoneResultElement = document.getElementById('defenseZoneResult');
        this.damageReductionResultElement = document.getElementById('damageReductionResult');

        // 元素伤害计算弹窗
        this.elementDamageModal = document.getElementById('elementDamageModal');
        this.elementDamageFixedInput = document.getElementById('elementDamageFixed');
        this.elementDamageMasteryTransformInput = document.getElementById('elementDamageMasteryTransform');
        this.dynamicElementDamageItems = document.getElementById('dynamicElementDamageItems');
        this.elementDamageResultElement = document.getElementById('elementDamageResult');
        this.elementDamageCounter = 0;

        // 幸运概率计算弹窗
        this.luckProbabilityModal = document.getElementById('luckProbabilityModal');
        this.luckProbabilityFixedInput = document.getElementById('luckProbabilityFixed');
        this.luckProbabilityAcquiredInput = document.getElementById('luckProbabilityAcquired');
        this.luckProbabilityResultElement = document.getElementById('luckProbabilityResult');

        // 幸运倍率计算弹窗
        this.luckMultiplierModal = document.getElementById('luckMultiplierModal');
        this.luckMultiplierBaseInput = document.getElementById('luckMultiplierBase');
        this.luckMultiplierProbabilityInput = document.getElementById('luckMultiplierProbability');
        this.luckMultiplierXInput = document.getElementById('luckMultiplierX');
        this.luckMultiplierResultElement = document.getElementById('luckMultiplierResult');

        // 精通转化计算子弹窗
        this.masteryTransformModal = document.getElementById('masteryTransformModal');
        this.masteryTransformFixedInput = document.getElementById('masteryTransformFixed');
        this.masteryTransformAcquiredInput = document.getElementById('masteryTransformAcquired');
        this.masteryTransformYInput = document.getElementById('masteryTransformY');
        this.masteryTransformTInput = document.getElementById('masteryTransformT');
        this.masteryTransformBoostEnabledInput = document.getElementById('masteryTransformBoostEnabled');
        this.masteryZoneResultElement = document.getElementById('masteryZoneResult');
        this.masteryTransformResultElement = document.getElementById('masteryTransformResult');

        // 元素伤害项目添加弹窗
        this.elementDamageItemModal = document.getElementById('elementDamageItemModal');
        
        // 增伤项目添加弹窗
        this.damageIncreaseItemModal = document.getElementById('damageIncreaseItemModal');

        // 攻击力计算弹窗
        this.attackModal = document.getElementById('attackModal');
        this.attackFixedInput = document.getElementById('attackFixed');
        this.attackMainStatTransformInput = document.getElementById('attackMainStatTransform');
        this.attackResultElement = document.getElementById('attackResult');

        // 主属性转化计算子弹窗
        this.mainStatTransformModal = document.getElementById('mainStatTransformModal');
        this.mainStatValueInput = document.getElementById('mainStatValue');
        this.gCoefficientInput = document.getElementById('gCoefficient');
        this.mainStatTransformResultElement = document.getElementById('mainStatTransformResult');

        // 系数计算弹窗
        this.coefficientModal = document.getElementById('coefficientModal');
        this.jobSelection = document.getElementById('jobSelection');
        this.thunderbladeCalculation = document.getElementById('thunderbladeCalculation');
        this.otherCalculation = document.getElementById('otherCalculation');

        // 雷影剑士相关元素
        this.thunderMarkInput = document.getElementById('thunderMark');
        this.masteryInput = document.getElementById('mastery');
        
        // 新的系数计算界面元素
        this.thunderMarkPreview = document.getElementById('thunderMarkPreview');
        this.masteryPreview = document.getElementById('masteryPreview');
        this.totalPreview = document.getElementById('totalPreview');
        this.coefficientMLocal = document.getElementById('coefficientMLocal');
        this.coefficientNLocal = document.getElementById('coefficientNLocal');
    }

    initEventListeners() {
        // 暴击计算事件监听
        this.critRateInput.addEventListener('input', () => {
            this.calculateCritExpected();
            this.saveCritValues();
        });
        this.critDamageInput.addEventListener('input', () => {
            this.calculateCritExpected();
            this.saveCritValues();
        });

        // 全能增幅计算事件监听
        this.versatilityFixedInput.addEventListener('input', () => {
            this.calculateVersatility();
            this.saveVersatilityValues();
        });
        this.versatilityAcquiredInput.addEventListener('input', () => {
            this.calculateVersatility();
            this.saveVersatilityValues();
        });
        this.versatilityQInput.addEventListener('input', () => {
            this.calculateVersatility();
            this.saveVersatilityValues();
        });

        // 雷印计算事件监听
        this.thunderMarkCountInput.addEventListener('input', () => {
            this.calculateThunderMark();
            this.saveThunderMarkValues();
        });
        this.thunderMarkPercentInput.addEventListener('input', () => {
            this.calculateThunderMark();
            this.saveThunderMarkValues();
        });

        // 精通增幅计算事件监听
        this.masteryModalFixedInput.addEventListener('input', () => {
            this.calculateMasteryModal();
            this.saveMasteryValues();
        });
        this.masteryModalAcquiredInput.addEventListener('input', () => {
            this.calculateMasteryModal();
            this.saveMasteryValues();
        });
        this.masteryModalJInput.addEventListener('input', () => {
            this.calculateMasteryModal();
            this.saveMasteryValues();
        });

        // 增伤计算事件监听
        this.bossIncreaseInput.addEventListener('input', () => {
            this.calculateDamageIncrease();
            this.saveDamageIncreaseValues();
        });
        this.distanceIncreaseInput.addEventListener('input', () => {
            this.calculateDamageIncrease();
            this.saveDamageIncreaseValues();
        });

        // 减伤区计算事件监听
        this.defenseValueInput.addEventListener('input', () => {
            this.calculateDamageReduction();
            this.saveDamageReductionValues();
        });
        this.damageReductionFInput.addEventListener('input', () => {
            this.calculateDamageReduction();
            this.saveDamageReductionValues();
        });

        // 元素伤害计算事件监听
        this.elementDamageFixedInput.addEventListener('input', () => {
            this.calculateElementDamage();
            this.saveElementDamageValues();
        });
        this.elementDamageMasteryTransformInput.addEventListener('input', () => {
            this.calculateElementDamage();
            this.saveElementDamageValues();
        });

        // 攻击力计算事件监听
        this.attackFixedInput.addEventListener('input', () => {
            this.calculateAttack();
            this.saveAttackValues();
        });
        this.attackMainStatTransformInput.addEventListener('input', () => {
            this.calculateAttack();
            this.saveAttackValues();
        });

        // 主属性转化计算事件监听
        this.mainStatValueInput.addEventListener('input', () => {
            this.calculateMainStatTransform();
            this.saveMainStatTransformValues();
        });
        this.gCoefficientInput.addEventListener('input', () => {
            this.calculateMainStatTransform();
            this.saveMainStatTransformValues();
        });

        // 精通转化计算事件监听
        this.masteryTransformFixedInput.addEventListener('input', () => {
            this.calculateMasteryTransform();
            this.saveMasteryTransformValues();
        });
        this.masteryTransformAcquiredInput.addEventListener('input', () => {
            this.calculateMasteryTransform();
            this.saveMasteryTransformValues();
        });
        this.masteryTransformYInput.addEventListener('input', () => {
            this.calculateMasteryTransform();
            this.saveMasteryTransformValues();
        });
        this.masteryTransformTInput.addEventListener('input', () => {
            this.calculateMasteryTransform();
            this.saveMasteryTransformValues();
        });
        this.masteryTransformBoostEnabledInput.addEventListener('change', () => {
            this.calculateMasteryTransform();
            this.saveMasteryTransformValues();
        });

        // 幸运概率计算事件监听
        this.luckProbabilityFixedInput.addEventListener('input', () => {
            this.calculateLuckProbability();
            this.saveLuckProbabilityValues();
        });
        this.luckProbabilityAcquiredInput.addEventListener('input', () => {
            this.calculateLuckProbability();
            this.saveLuckProbabilityValues();
        });

        // 幸运倍率计算事件监听
        this.luckMultiplierBaseInput.addEventListener('input', () => {
            this.calculateLuckMultiplier();
            this.saveLuckMultiplierValues();
        });
        this.luckMultiplierProbabilityInput.addEventListener('input', () => {
            this.calculateLuckMultiplier();
            this.saveLuckMultiplierValues();
        });
        this.luckMultiplierXInput.addEventListener('input', () => {
            this.calculateLuckMultiplier();
            this.saveLuckMultiplierValues();
        });

        // 系数计算事件监听
        this.thunderMarkInput.addEventListener('input', () => {
            this.updateCoefficientCalculation();
            this.saveCoefficientValues();
        });
        this.masteryInput.addEventListener('input', () => {
            this.updateCoefficientCalculation();
            this.saveCoefficientValues();
        });

        // 为系数本地输入框添加事件监听
        if (this.coefficientMLocal) {
            this.coefficientMLocal.addEventListener('input', () => {
                this.saveCoefficientValues();
            });
        }
        if (this.coefficientNLocal) {
            this.coefficientNLocal.addEventListener('input', () => {
                this.saveCoefficientValues();
            });
        }

        // 点击弹窗外部关闭弹窗
        window.addEventListener('click', (event) => {
            if (event.target === this.critModal) {
                this.closeCritModal();
            }
            if (event.target === this.versatilityModal) {
                this.closeVersatilityModal();
            }
            if (event.target === this.thunderMarkModal) {
                this.closeThunderMarkModal();
            }
            if (event.target === this.masteryModal) {
                this.closeMasteryModal();
            }
            if (event.target === this.damageIncreaseModal) {
                this.closeDamageIncreaseModal();
            }
            if (event.target === this.damageReductionModal) {
                this.closeDamageReductionModal();
            }
            if (event.target === this.elementDamageModal) {
                this.closeElementDamageModal();
            }
            if (event.target === this.masteryTransformModal) {
                this.closeMasteryTransformModal();
            }
            if (event.target === this.elementDamageItemModal) {
                this.closeElementDamageItemModal();
            }
            if (event.target === this.damageIncreaseItemModal) {
                this.closeDamageIncreaseItemModal();
            }
            if (event.target === this.attackModal) {
                this.closeAttackModal();
            }
            if (event.target === this.mainStatTransformModal) {
                this.closeMainStatTransformModal();
            }
            if (event.target === this.coefficientModal) {
                this.closeCoefficientModal();
            }
            if (event.target === this.luckProbabilityModal) {
                this.closeLuckProbabilityModal();
            }
            if (event.target === this.luckMultiplierModal) {
                this.closeLuckMultiplierModal();
            }
        });
    }

    // 暴击计算相关方法
    openCritModal() {
        this.critModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.critModal);
        }
        this.calculateCritExpected();
    }

    closeCritModal() {
        this.critModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.critModal);
        }
    }

    calculateCritExpected() {
        const critRate = parseFloat(this.critRateInput.value) || 0;
        const critDamage = parseFloat(this.critDamageInput.value) || 100;
        
        // 期望暴击伤害 = 1 + 暴击率 × (暴击伤害 - 1)
        const expectedCrit = 1 + (critRate / 100) * (critDamage / 100 - 1);
        
        this.critResultElement.textContent = `期望暴击伤害: ${expectedCrit.toFixed(4)}`;
        return expectedCrit;
    }

    applyCritResult() {
        const expectedCrit = this.calculateCritExpected();
        damageCalculator.setExpectedCrit(expectedCrit);
        this.closeCritModal();
    }

    // 全能增幅计算相关方法
    openVersatilityModal() {
        this.versatilityModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.versatilityModal);
        }
        this.calculateVersatility();
    }

    closeVersatilityModal() {
        this.versatilityModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.versatilityModal);
        }
    }

    calculateVersatility() {
        const fixed = parseFloat(this.versatilityFixedInput.value) || 0;
        const acquired = parseFloat(this.versatilityAcquiredInput.value) || 0;
        const Q = parseFloat(this.versatilityQInput.value) || 1;
        
        // 全能乘区 = 1 + 固定值 + (获取量 / (获取量 + 28000))
        const versatility = 1 + fixed + (acquired / (acquired + 28000));

        // 全能增幅乘区 = 1 + [固定值 + (获取量 / (获取量 + 28000))] × Q
        const versatilityAmplification = 1 + (fixed + (acquired / (acquired + 28000))) * Q;
        
        this.versatilityResultElement.textContent = `全能乘区: ${versatility.toFixed(4)}`;
        this.versatilityAmplificationResultElement.textContent = `全能增幅乘区: ${versatilityAmplification.toFixed(4)}`;
        
        return versatilityAmplification;
    }

    applyVersatilityResult() {
        const versatilityAmplification = this.calculateVersatility();
        damageCalculator.setVersatility(versatilityAmplification);
        this.closeVersatilityModal();
    }

    // 雷印计算相关方法
    openThunderMarkModal() {
        this.thunderMarkModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.thunderMarkModal);
        }
        this.calculateThunderMark();
    }

    closeThunderMarkModal() {
        this.thunderMarkModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.thunderMarkModal);
        }
    }

    calculateThunderMark() {
        const count = parseFloat(this.thunderMarkCountInput.value) || 0;
        const percent = parseFloat(this.thunderMarkPercentInput.value) || 0;
        
        // 雷印值 = 个数 × (百分比/100)
        const thunderMark = count * (percent / 100);
        
        this.thunderMarkResultElement.textContent = `雷印值: ${thunderMark.toFixed(4)}`;
        return thunderMark;
    }

    applyThunderMarkResult() {
        const thunderMark = this.calculateThunderMark();
        const thunderMarkInput = document.getElementById('thunderMark');
        if (thunderMarkInput) {
            thunderMarkInput.value = thunderMark.toFixed(4);
            // 触发雷影剑士的系数计算更新
            this.updateCoefficientCalculation();
        }
        this.closeThunderMarkModal();
    }

    // 精通增幅计算相关方法
    openMasteryModal() {
        this.masteryModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.masteryModal);
        }
        this.calculateMasteryModal();
    }

    closeMasteryModal() {
        this.masteryModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.masteryModal);
        }
    }

    calculateMasteryModal() {
        const fixed = parseFloat(this.masteryModalFixedInput.value) || 0;
        const acquired = parseFloat(this.masteryModalAcquiredInput.value) || 0;
        const J = parseFloat(this.masteryModalJInput.value) || 1;
        
        // 精通乘区 = 固定值 + (获取量 / (获取量 + 50000))
        const mastery = fixed + (acquired / (acquired + 50000));
        
        // 精通增幅乘区 = 1 + [固定值 + (获取量 / (获取量 + 50000))] × J
        const masteryAmplification = 1 + mastery * J;
        
        this.masteryModalResultElement.textContent = `精通乘区: ${mastery.toFixed(4)}`;
        this.masteryAmplificationResultElement.textContent = `精通增幅乘区: ${masteryAmplification.toFixed(4)}`;
        
        return masteryAmplification;
    }

    applyMasteryModalResult() {
        const masteryAmplification = this.calculateMasteryModal();
        const masteryInput = document.getElementById('mastery');
        if (masteryInput) {
            masteryInput.value = masteryAmplification.toFixed(4);
            // 触发雷影剑士的系数计算更新
            this.updateCoefficientCalculation();
        }
        this.closeMasteryModal();
    }

    // 增伤计算相关方法
    openDamageIncreaseModal() {
        this.damageIncreaseModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.damageIncreaseModal);
        }
        this.calculateDamageIncrease();
    }

    closeDamageIncreaseModal() {
        this.damageIncreaseModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.damageIncreaseModal);
        }
    }

    calculateDamageIncrease() {
        const bossIncrease = parseFloat(this.bossIncreaseInput.value) || 0;
        const distanceIncrease = parseFloat(this.distanceIncreaseInput.value) || 0;
        
        // 获取所有动态增伤项目
        const dynamicItems = this.dynamicDamageIncreases.querySelectorAll('.damage-increase-item input[type="number"]');
        let additionalIncrease = 0;
        
        dynamicItems.forEach(input => {
            additionalIncrease += parseFloat(input.value) || 0;
        });
        
        // 增伤乘区 = 1 + 首领增伤/100 + 距离加成/100 + 其他增伤/100
        const damageIncrease = 1 + (bossIncrease / 100) + (distanceIncrease / 100) + (additionalIncrease / 100);
        
        this.damageIncreaseResultElement.textContent = `增伤乘区: ${damageIncrease.toFixed(4)}`;
        return damageIncrease;
    }

    addDamageIncrease() {
        // 已废弃：使用新的弹窗方式添加增伤项目
        this.openDamageIncreaseItemModal();
    }

    // 内部方法：创建增伤项目（不弹出提示框）
    createDamageIncreaseItem(itemName, itemValue = '0') {
        this.damageIncreaseCounter++;
        const itemId = `damageIncreaseItem${this.damageIncreaseCounter}`;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'damage-increase-item';
        itemDiv.innerHTML = `
            <div class="input-group">
                <label for="${itemId}">${itemName}</label>
                <input type="number" id="${itemId}" value="${itemValue}" min="0" step="0.1" placeholder="输入百分比数值">
                <button type="button" class="remove-btn" onclick="window.modalManager.removeDamageIncrease(this)">×</button>
            </div>
        `;
        
        this.dynamicDamageIncreases.appendChild(itemDiv);
        
        // 添加事件监听
        const input = itemDiv.querySelector('input');
        input.addEventListener('input', () => {
            this.calculateDamageIncrease();
            this.saveDamageIncreaseValues();
        });
        
        // 重新计算并保存
        this.calculateDamageIncrease();
        this.saveDamageIncreaseValues();
    }

    removeDamageIncrease(button) {
        const item = button.closest('.damage-increase-item');
        if (item) {
            item.remove();
            this.calculateDamageIncrease();
            this.saveDamageIncreaseValues();
        }
    }

    applyDamageIncreaseResult() {
        const damageIncrease = this.calculateDamageIncrease();
        damageCalculator.setDamageIncrease(damageIncrease);
        this.closeDamageIncreaseModal();
    }

    // 减伤区计算相关方法
    openDamageReductionModal() {
        this.damageReductionModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.damageReductionModal);
        }
        this.calculateDamageReduction();
    }

    closeDamageReductionModal() {
        this.damageReductionModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.damageReductionModal);
        }
    }

    calculateDamageReduction() {
        const defenseValue = parseFloat(this.defenseValueInput.value) || 0;
        const fCoefficient = parseFloat(this.damageReductionFInput.value) || 1.0;

        // 防御区公式：防御值 / (防御值 + 6500)
        const defenseZone = defenseValue / (defenseValue + 6500);

        // 减伤区公式：1 - 防御值 × F / (防御值 × F + 6500)
        const damageReduction = 1 - (defenseValue * fCoefficient) / (defenseValue * fCoefficient + 6500);

        this.defenseZoneResultElement.textContent = `防御区: ${defenseZone.toFixed(4)}`;
        this.damageReductionResultElement.textContent = `减伤区: ${damageReduction.toFixed(4)}`;

        // 返回减伤区值用于应用到主界面
        return damageReduction;
    }

    applyDamageReductionResult() {
        const damageReduction = this.calculateDamageReduction();
        damageCalculator.setDamageReduction(damageReduction);
        this.closeDamageReductionModal();
    }

    // 元素伤害计算相关方法
    openElementDamageModal() {
        this.elementDamageModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.elementDamageModal);
        }
        this.calculateElementDamage();
    }

    closeElementDamageModal() {
        this.elementDamageModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.elementDamageModal);
        }
    }

    calculateElementDamage() {
        const fixedValue = parseFloat(this.elementDamageFixedInput.value) || 0;
        const masteryTransform = parseFloat(this.elementDamageMasteryTransformInput.value) || 0;
        
        // 计算其他项目的总和
        let otherItemsSum = 0;
        const items = this.dynamicElementDamageItems.querySelectorAll('.damage-increase-item');
        items.forEach(item => {
            const valueInput = item.querySelector('input[type="number"]');
            if (valueInput) {
                otherItemsSum += parseFloat(valueInput.value) || 0;
            }
        });
        
        // 元素伤害乘区 = 1 + 固定值百分比/100 + 精通转化百分比/100 + 其他项目百分比/100
        const elementDamageZone = 1 + (fixedValue / 100) + (masteryTransform / 100) + (otherItemsSum / 100);
        
        this.elementDamageResultElement.textContent = `元素伤害乘区: ${elementDamageZone.toFixed(4)}`;
        
        // 返回元素伤害乘区值用于应用到主界面
        return elementDamageZone;
    }

    // 精通转化计算相关方法
    openMasteryTransformModal() {
        this.masteryTransformModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.masteryTransformModal);
        }
        this.calculateMasteryTransform();
    }

    closeMasteryTransformModal() {
        this.masteryTransformModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.masteryTransformModal);
        }
    }

    calculateMasteryTransform() {
        const fixedValue = parseFloat(this.masteryTransformFixedInput.value) || 0;
        const acquired = parseFloat(this.masteryTransformAcquiredInput.value) || 0;
        const yCoefficient = parseFloat(this.masteryTransformYInput.value) || 1.0;
        const tCoefficient = parseFloat(this.masteryTransformTInput.value) || 0;
        const boostEnabled = this.masteryTransformBoostEnabledInput ? this.masteryTransformBoostEnabledInput.checked : true;
        
        // 精通乘区 = 固定值 + (获取量 / (获取量 + 50000))
        const masteryZone = fixedValue + (acquired / (acquired + 50000));

        // 精通增效 = T × (1 + 精通乘区%)
        const masteryBoost = boostEnabled ? tCoefficient * (1 + masteryZone) : 1;

        // 精通转化 = [固定值 + (获取量 / (获取量 + 50000))] × Y × 精通增效 × 100%
        const masteryTransform = masteryZone * yCoefficient * masteryBoost * 100;
        
        this.masteryZoneResultElement.textContent = `精通乘区: ${masteryZone.toFixed(4)}`;
        this.masteryTransformResultElement.textContent = `精通转化: ${masteryTransform.toFixed(4)}`;
        
        return masteryTransform;
    }

    applyMasteryTransformResult() {
        const masteryTransform = this.calculateMasteryTransform();
        if (this.elementDamageMasteryTransformInput) {
            // 应用精通转化值（已经是百分比形式）
            this.elementDamageMasteryTransformInput.value = masteryTransform.toFixed(2);
            this.calculateElementDamage();
            this.saveElementDamageValues();
        }
        this.closeMasteryTransformModal();
    }

    // 元素伤害项目添加弹窗相关方法
    openElementDamageItemModal() {
        this.elementDamageItemModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.elementDamageItemModal);
        }
    }

    closeElementDamageItemModal() {
        this.elementDamageItemModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.elementDamageItemModal);
        }
    }

    addElementDamageItem() {
        const nameInput = document.getElementById('newElementDamageItemName');
        const valueInput = document.getElementById('newElementDamageItemValue');
        
        const itemName = nameInput.value.trim();
        const itemValue = valueInput.value || '0';
        
        if (itemName === '') {
            alert('请输入项目名称');
            return;
        }
        
        this.createElementDamageItem(itemName, itemValue);
        
        // 清空输入框
        nameInput.value = '';
        valueInput.value = '0';
        
        // 关闭项目添加弹窗
        this.closeElementDamageItemModal();
    }

    // 增伤项目添加弹窗相关方法
    openDamageIncreaseItemModal() {
        this.damageIncreaseItemModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.damageIncreaseItemModal);
        }
    }

    closeDamageIncreaseItemModal() {
        this.damageIncreaseItemModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.damageIncreaseItemModal);
        }
    }

    addDamageIncreaseFromModal() {
        const nameInput = document.getElementById('newDamageIncreaseItemName');
        const valueInput = document.getElementById('newDamageIncreaseItemValue');
        
        const itemName = nameInput.value.trim();
        const itemValue = valueInput.value || '0';
        
        if (itemName === '') {
            alert('请输入项目名称');
            return;
        }
        
        this.createDamageIncreaseItem(itemName, itemValue);
        
        // 清空输入框
        nameInput.value = '';
        valueInput.value = '0';
        
        // 关闭项目添加弹窗
        this.closeDamageIncreaseItemModal();
    }

    createElementDamageItem(itemName, itemValue = '0') {
        this.elementDamageCounter++;
        const itemId = `elementDamageItem${this.elementDamageCounter}`;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'damage-increase-item';
        itemDiv.innerHTML = `
            <div class="input-group">
                <label for="${itemId}">${itemName}</label>
                <input type="number" id="${itemId}" value="${itemValue}" step="0.1" placeholder="输入百分比数值">
                <button type="button" class="remove-btn" onclick="window.modalManager.removeElementDamageItem(this)">×</button>
            </div>
        `;
        
        this.dynamicElementDamageItems.appendChild(itemDiv);
        
        // 为新增的输入框添加事件监听
        const newInput = itemDiv.querySelector('input');
        newInput.addEventListener('input', () => {
            this.calculateElementDamage();
            this.saveElementDamageValues();
        });
        
        // 重新计算
        this.calculateElementDamage();
        this.saveElementDamageValues();
    }

    removeElementDamageItem(button) {
        const item = button.closest('.damage-increase-item');
        if (item) {
            item.remove();
            this.calculateElementDamage();
            this.saveElementDamageValues();
        }
    }

    applyElementDamageResult() {
        const elementDamage = this.calculateElementDamage();
        if (window.damageCalculator) {
            window.damageCalculator.setElementDamage(elementDamage);
        }
        this.closeElementDamageModal();
    }

    // 攻击力计算相关方法
    openAttackModal() {
        this.attackModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.attackModal);
        }
        this.calculateAttack();
    }

    closeAttackModal() {
        this.attackModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.attackModal);
        }
    }

    calculateAttack() {
        const fixedValue = parseFloat(this.attackFixedInput.value) || 0;
        const mainStatTransform = parseFloat(this.attackMainStatTransformInput.value) || 0;
        
        // 攻击力区 = 固定值 + 主属性转化
        const attackZone = fixedValue + mainStatTransform;
        
        this.attackResultElement.textContent = `攻击力区: ${attackZone.toFixed(0)}`;
        
        // 返回攻击力区值用于应用到主界面
        return attackZone;
    }

    applyAttackResult() {
        const attackZone = this.calculateAttack();
        damageCalculator.setAttack(attackZone);
        this.closeAttackModal();
    }

    // 主属性转化计算相关方法
    openMainStatTransformModal() {
        this.mainStatTransformModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.mainStatTransformModal);
        }
        this.calculateMainStatTransform();
    }

    closeMainStatTransformModal() {
        this.mainStatTransformModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.mainStatTransformModal);
        }
    }

    calculateMainStatTransform() {
        const mainStatValue = parseFloat(this.mainStatValueInput.value) || 0;
        const gCoefficient = parseFloat(this.gCoefficientInput.value) || 1.0;
        
        // 主属性转化 = 主属性 × G
        const mainStatTransform = mainStatValue * gCoefficient;
        
        this.mainStatTransformResultElement.textContent = `主属性转化: ${mainStatTransform.toFixed(0)}`;
        
        return mainStatTransform;
    }

    applyMainStatTransformResult() {
        const mainStatTransform = this.calculateMainStatTransform();
        if (this.attackMainStatTransformInput) {
            // 应用主属性转化值
            this.attackMainStatTransformInput.value = mainStatTransform.toFixed(0);
            this.calculateAttack();
            this.saveAttackValues();
        }
        this.closeMainStatTransformModal();
    }

    // 系数计算相关方法
    openCoefficientModal() {
        this.coefficientModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.coefficientModal);
        }
        this.showJobSelection();
    }

    closeCoefficientModal() {
        this.coefficientModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.coefficientModal);
        }
        this.resetCoefficientModal();
    }

    showJobSelection() {
        this.jobSelection.style.display = 'block';
        this.thunderbladeCalculation.style.display = 'none';
        this.otherCalculation.style.display = 'none';
    }

    selectJob(jobType) {
        this.jobSelection.style.display = 'none';
        
        if (jobType === 'thunderblade') {
            this.thunderbladeCalculation.style.display = 'block';
            // 初始化系数计算
            setTimeout(() => {
                this.updateCoefficientCalculation();
            }, 100);
        } else if (jobType === 'other') {
            this.otherCalculation.style.display = 'block';
        }
    }

    backToJobSelection() {
        this.showJobSelection();
    }

    resetCoefficientModal() {
        this.showJobSelection();
    }

    // 系数重置功能
    resetCoefficientsToOne() {
        // 重置主界面的系数M和N为1
        const coefficientMInput = document.getElementById('coefficientM');
        const coefficientNInput = document.getElementById('coefficientN');
        
        if (coefficientMInput) coefficientMInput.value = '1.0';
        if (coefficientNInput) coefficientNInput.value = '1.0';
        
        // 显示成功提示
        this.showResetSuccess('系数M、N已重置为1');
    }

    resetOnlyM() {
        // 重置主界面的系数M为1
        const coefficientMInput = document.getElementById('coefficientM');
        if (coefficientMInput) coefficientMInput.value = '1.0';
        
        // 显示成功提示
        this.showResetSuccess('系数M已重置为1');
    }

    resetOnlyN() {
        // 重置主界面的系数N为1
        const coefficientNInput = document.getElementById('coefficientN');
        if (coefficientNInput) coefficientNInput.value = '1.0';
        
        // 显示成功提示
        this.showResetSuccess('系数N已重置为1');
    }

    showResetSuccess(message) {
        // 创建临时的成功提示
        const successDiv = document.createElement('div');
        successDiv.className = 'reset-success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 1.1em;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            animation: fadeInOut 2s ease-in-out;
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(successDiv);
        
        // 2秒后自动移除
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 2000);
    }

    // 新的系数计算逻辑
    updateCoefficientCalculation() {
        if (!this.thunderMarkInput || !this.masteryInput) return;
        
        const thunderMark = parseFloat(this.thunderMarkInput.value) || 0;
        const mastery = parseFloat(this.masteryInput.value) || 0;
        const total = thunderMark + mastery;
        
        // 更新预览显示
        if (this.thunderMarkPreview) {
            this.thunderMarkPreview.textContent = thunderMark.toFixed(4);
        }
        if (this.masteryPreview) {
            this.masteryPreview.textContent = mastery.toFixed(4);
        }
        if (this.totalPreview) {
            this.totalPreview.textContent = total.toFixed(4);
        }
    }

    // 复制按钮功能
    copyTotalToM() {
        const total = this.getTotalValue();
        if (this.coefficientMLocal) {
            this.coefficientMLocal.value = total.toFixed(4);
            this.saveCoefficientValues();
        }
    }

    copyTotalToN() {
        const total = this.getTotalValue();
        if (this.coefficientNLocal) {
            this.coefficientNLocal.value = total.toFixed(4);
            this.saveCoefficientValues();
        }
    }

    copyTotalToBoth() {
        const total = this.getTotalValue();
        if (this.coefficientMLocal) {
            this.coefficientMLocal.value = total.toFixed(4);
        }
        if (this.coefficientNLocal) {
            this.coefficientNLocal.value = total.toFixed(4);
        }
        this.saveCoefficientValues();
    }

    getTotalValue() {
        const thunderMark = parseFloat(this.thunderMarkInput.value) || 0;
        const mastery = parseFloat(this.masteryInput.value) || 0;
        return thunderMark + mastery;
    }

    applyCoefficientResult() {
        const coefficientM = parseFloat(this.coefficientMLocal.value) || 0;
        const coefficientN = parseFloat(this.coefficientNLocal.value) || 0;
        
        damageCalculator.setCoefficients(coefficientM, coefficientN);
        this.closeCoefficientModal();
    }

    // 保存和加载功能
    saveModalValues(modalType, values) {
        try {
            const storageKey = this.storageKeys[modalType];
            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(values));
                console.log(`${modalType}弹窗值已保存:`, values);
            }
        } catch (error) {
            console.error(`保存${modalType}弹窗值失败:`, error);
        }
    }

    loadModalValues(modalType) {
        try {
            const storageKey = this.storageKeys[modalType];
            if (storageKey) {
                const saved = localStorage.getItem(storageKey);
                return saved ? JSON.parse(saved) : null;
            }
        } catch (error) {
            console.error(`加载${modalType}弹窗值失败:`, error);
        }
        return null;
    }

    // 加载所有弹窗的保存值
    loadAllModalValues() {
        // 延迟加载，确保DOM元素已初始化
        setTimeout(() => {
            this.loadCritValues();
            this.loadVersatilityValues();
            this.loadThunderMarkValues();
            this.loadMasteryValues();
            this.loadDamageIncreaseValues();
            this.loadCoefficientValues();
            this.loadDamageReductionValues();
            this.loadElementDamageValues();
            this.loadMasteryTransformValues();
            this.loadAttackValues();
            this.loadMainStatTransformValues();
            this.loadLuckProbabilityValues();
            this.loadLuckMultiplierValues();
        }, 100);
    }

    // 暴击计算器值的保存和加载
    saveCritValues() {
        const values = {
            critRate: this.critRateInput.value,
            critDamage: this.critDamageInput.value
        };
        this.saveModalValues('crit', values);
    }

    loadCritValues() {
        const values = this.loadModalValues('crit');
        if (values && this.critRateInput && this.critDamageInput) {
            this.critRateInput.value = values.critRate || '25';
            this.critDamageInput.value = values.critDamage || '150';
            console.log('已加载暴击计算器保存值');
        }
    }

    // 全能增幅计算器值的保存和加载
    saveVersatilityValues() {
        const values = {
            versatilityFixed: this.versatilityFixedInput.value,
            versatilityAcquired: this.versatilityAcquiredInput.value,
            versatilityQ: this.versatilityQInput.value
        };
        this.saveModalValues('versatility', values);
    }

    loadVersatilityValues() {
        const values = this.loadModalValues('versatility');
        if (values && this.versatilityFixedInput && this.versatilityAcquiredInput && this.versatilityQInput) {
            this.versatilityFixedInput.value = values.versatilityFixed || '0';
            this.versatilityAcquiredInput.value = values.versatilityAcquired || '500';
            this.versatilityQInput.value = values.versatilityQ || '1';
            console.log('已加载全能增幅计算器保存值');
        }
    }

    // 雷印计算器值的保存和加载
    saveThunderMarkValues() {
        const values = {
            thunderMarkCount: this.thunderMarkCountInput.value,
            thunderMarkPercent: this.thunderMarkPercentInput.value
        };
        this.saveModalValues('thunderMark', values);
    }

    loadThunderMarkValues() {
        const values = this.loadModalValues('thunderMark');
        if (values && this.thunderMarkCountInput && this.thunderMarkPercentInput) {
            this.thunderMarkCountInput.value = values.thunderMarkCount || '3';
            this.thunderMarkPercentInput.value = values.thunderMarkPercent || '10';
            console.log('已加载雷印计算器保存值');
        }
    }

    // 精通增幅计算器值的保存和加载
    saveMasteryValues() {
        const values = {
            masteryModalFixed: this.masteryModalFixedInput.value,
            masteryModalAcquired: this.masteryModalAcquiredInput.value,
            masteryModalJ: this.masteryModalJInput.value
        };
        this.saveModalValues('mastery', values);
    }

    loadMasteryValues() {
        const values = this.loadModalValues('mastery');
        if (values && this.masteryModalFixedInput && this.masteryModalAcquiredInput && this.masteryModalJInput) {
            this.masteryModalFixedInput.value = values.masteryModalFixed || '0';
            this.masteryModalAcquiredInput.value = values.masteryModalAcquired || '500';
            this.masteryModalJInput.value = values.masteryModalJ || '1';
            console.log('已加载精通增幅计算器保存值');
        }
    }

    // 增伤计算器值的保存和加载
    saveDamageIncreaseValues() {
        const values = {
            bossIncrease: this.bossIncreaseInput.value,
            distanceIncrease: this.distanceIncreaseInput.value
        };
        // 保存动态添加的增伤项（包含名称和数值）
        const dynamicIncreases = [];
        if (this.dynamicDamageIncreases) {
            const items = this.dynamicDamageIncreases.querySelectorAll('.damage-increase-item');
            items.forEach(item => {
                const input = item.querySelector('input[type="number"]');
                const label = item.querySelector('label');
                if (input && label && input.value) {
                    dynamicIncreases.push({
                        name: label.textContent,
                        value: input.value
                    });
                }
            });
        }
        values.dynamicIncreases = dynamicIncreases;
        this.saveModalValues('damageIncrease', values);
    }

    loadDamageIncreaseValues() {
        const values = this.loadModalValues('damageIncrease');
        if (values && this.bossIncreaseInput && this.distanceIncreaseInput) {
            this.bossIncreaseInput.value = values.bossIncrease || '0';
            this.distanceIncreaseInput.value = values.distanceIncrease || '0';
            
            // 恢复动态增伤项
            if (values.dynamicIncreases && Array.isArray(values.dynamicIncreases)) {
                values.dynamicIncreases.forEach((item, index) => {
                    let itemName, itemValue;
                    
                    if (typeof item === 'object' && item.name && item.value) {
                        // 新格式：{name: "名称", value: "数值"}
                        itemName = item.name;
                        itemValue = item.value;
                    } else {
                        // 旧格式：只有数值，生成默认名称
                        itemName = `增伤项目${index + 1}`;
                        itemValue = item;
                    }
                    
                    if (itemName && itemName.trim() !== '') {
                        this.createDamageIncreaseItem(itemName, itemValue);
                    }
                });
            }
            console.log('已加载增伤计算器保存值');
        }
    }

    // 系数计算器值的保存和加载
    saveCoefficientValues() {
        const values = {
            thunderMark: this.thunderMarkInput ? this.thunderMarkInput.value : '',
            mastery: this.masteryInput ? this.masteryInput.value : '',
            coefficientMLocal: this.coefficientMLocal ? this.coefficientMLocal.value : '',
            coefficientNLocal: this.coefficientNLocal ? this.coefficientNLocal.value : ''
        };
        this.saveModalValues('coefficient', values);
    }

    loadCoefficientValues() {
        const values = this.loadModalValues('coefficient');
        if (values) {
            if (this.thunderMarkInput && values.thunderMark !== undefined) {
                this.thunderMarkInput.value = values.thunderMark || '0';
            }
            if (this.masteryInput && values.mastery !== undefined) {
                this.masteryInput.value = values.mastery || '0';
            }
            if (this.coefficientMLocal && values.coefficientMLocal !== undefined) {
                this.coefficientMLocal.value = values.coefficientMLocal || '1.0';
            }
            if (this.coefficientNLocal && values.coefficientNLocal !== undefined) {
                this.coefficientNLocal.value = values.coefficientNLocal || '1.0';
            }
            console.log('已加载系数计算器保存值');
        }
    }

    // 减伤区计算器值的保存和加载
    saveDamageReductionValues() {
        const values = {
            defenseValue: this.defenseValueInput.value,
            damageReductionF: this.damageReductionFInput.value
        };
        this.saveModalValues('damageReduction', values);
    }

    loadDamageReductionValues() {
        const values = this.loadModalValues('damageReduction');
        if (values) {
            if (this.defenseValueInput && values.defenseValue !== undefined) {
                this.defenseValueInput.value = values.defenseValue || '1000';
            }
            if (this.damageReductionFInput && values.damageReductionF !== undefined) {
                this.damageReductionFInput.value = values.damageReductionF || '1.0';
            }
            console.log('已加载减伤区计算器保存值');
        }
    }

    // 元素伤害计算器值的保存和加载
    saveElementDamageValues() {
        const elementDamageItems = [];
        const items = this.dynamicElementDamageItems.querySelectorAll('.damage-increase-item');
        items.forEach(item => {
            const nameElement = item.querySelector('label');
            const valueInput = item.querySelector('input[type="number"]');
            if (nameElement && valueInput) {
                elementDamageItems.push({
                    name: nameElement.textContent.trim(),
                    value: valueInput.value
                });
            }
        });

        const values = {
            elementDamageFixed: this.elementDamageFixedInput.value,
            elementDamageMasteryTransform: this.elementDamageMasteryTransformInput.value,
            elementDamageItems: elementDamageItems
        };
        this.saveModalValues('elementDamage', values);
    }

    loadElementDamageValues() {
        const values = this.loadModalValues('elementDamage');
        if (values) {
            if (this.elementDamageFixedInput && values.elementDamageFixed !== undefined) {
                this.elementDamageFixedInput.value = values.elementDamageFixed || '0';
            }
            if (this.elementDamageMasteryTransformInput && values.elementDamageMasteryTransform !== undefined) {
                this.elementDamageMasteryTransformInput.value = values.elementDamageMasteryTransform || '0';
            }
            
            // 恢复元素伤害项
            if (values.elementDamageItems && Array.isArray(values.elementDamageItems)) {
                values.elementDamageItems.forEach((item, index) => {
                    let itemName, itemValue;
                    
                    if (typeof item === 'object' && item.name && item.value) {
                        // 新格式：{name: "名称", value: "数值"}
                        itemName = item.name;
                        itemValue = item.value;
                    } else {
                        // 旧格式：只有数值，生成默认名称
                        itemName = `元素伤害项目${index + 1}`;
                        itemValue = item;
                    }
                    
                    if (itemName && itemName.trim() !== '') {
                        this.createElementDamageItem(itemName, itemValue);
                    }
                });
            }
            console.log('已加载元素伤害计算器保存值');
        }
    }

    // 精通转化值的保存和加载
    saveMasteryTransformValues() {
        const values = {
            masteryTransformFixed: this.masteryTransformFixedInput.value,
            masteryTransformAcquired: this.masteryTransformAcquiredInput.value,
            masteryTransformY: this.masteryTransformYInput.value,
            masteryTransformT: this.masteryTransformTInput.value,
            masteryTransformBoostEnabled: this.masteryTransformBoostEnabledInput ? this.masteryTransformBoostEnabledInput.checked : true
        };
        
        this.saveModalValues('masteryTransform', values);
    }

    loadMasteryTransformValues() {
        const values = this.loadModalValues('masteryTransform');
        if (values) {
            if (this.masteryTransformFixedInput && values.masteryTransformFixed !== undefined) {
                this.masteryTransformFixedInput.value = values.masteryTransformFixed || '0';
            }
            if (this.masteryTransformAcquiredInput && values.masteryTransformAcquired !== undefined) {
                this.masteryTransformAcquiredInput.value = values.masteryTransformAcquired || '1000';
            }
            if (this.masteryTransformYInput && values.masteryTransformY !== undefined) {
                this.masteryTransformYInput.value = values.masteryTransformY || '1.0';
            }
            if (this.masteryTransformTInput && values.masteryTransformT !== undefined) {
                this.masteryTransformTInput.value = values.masteryTransformT || '1.0';
            }
            if (this.masteryTransformBoostEnabledInput) {
                this.masteryTransformBoostEnabledInput.checked = values.masteryTransformBoostEnabled !== undefined ? values.masteryTransformBoostEnabled : true;
            }
            console.log('已加载精通转化保存值');
        }
    }

    // 攻击力计算器值的保存和加载
    saveAttackValues() {
        const values = {
            attackFixed: this.attackFixedInput.value,
            attackMainStatTransform: this.attackMainStatTransformInput.value
        };
        this.saveModalValues('attack', values);
    }

    loadAttackValues() {
        const values = this.loadModalValues('attack');
        if (values) {
            if (this.attackFixedInput && values.attackFixed !== undefined) {
                this.attackFixedInput.value = values.attackFixed || '1000';
            }
            if (this.attackMainStatTransformInput && values.attackMainStatTransform !== undefined) {
                this.attackMainStatTransformInput.value = values.attackMainStatTransform || '0';
            }
            console.log('已加载攻击力计算器保存值');
        }
    }

    // 主属性转化计算器值的保存和加载
    saveMainStatTransformValues() {
        const values = {
            mainStatValue: this.mainStatValueInput.value,
            gCoefficient: this.gCoefficientInput.value
        };
        this.saveModalValues('mainStatTransform', values);
    }

    loadMainStatTransformValues() {
        const values = this.loadModalValues('mainStatTransform');
        if (values) {
            if (this.mainStatValueInput && values.mainStatValue !== undefined) {
                this.mainStatValueInput.value = values.mainStatValue || '1000';
            }
            if (this.gCoefficientInput && values.gCoefficient !== undefined) {
                this.gCoefficientInput.value = values.gCoefficient || '1.0';
            }
            console.log('已加载主属性转化计算器保存值');
        }
    }

    // 幸运概率计算相关方法
    openLuckProbabilityModal() {
        this.luckProbabilityModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.luckProbabilityModal);
        }
        this.calculateLuckProbability();
    }

    closeLuckProbabilityModal() {
        this.luckProbabilityModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.luckProbabilityModal);
        }
    }

    calculateLuckProbability() {
        const fixedValue = parseFloat(this.luckProbabilityFixedInput.value) || 0;
        const acquired = parseFloat(this.luckProbabilityAcquiredInput.value) || 0;
        
        // 幸运概率 = 固定值 + (获取量 / (获取量 + 50000))
        const luckProbability = fixedValue + (acquired / (acquired + 50000));
        
        this.luckProbabilityResultElement.textContent = `幸运概率: ${luckProbability.toFixed(4)}`;
        
        // 更新幸运倍率计算器的幸运概率值
        if (this.luckMultiplierProbabilityInput) {
            this.luckMultiplierProbabilityInput.value = luckProbability.toFixed(4);
            this.calculateLuckMultiplier();
        }
        
        return luckProbability;
    }

    applyLuckProbabilityResult() {
        const luckProbability = this.calculateLuckProbability();
        // 设置主界面的幸运概率值
        const luckProbabilityInput = document.getElementById('luckProbability');
        if (luckProbabilityInput) {
            luckProbabilityInput.value = luckProbability.toFixed(4);
            // 触发输入事件以更新计算
            luckProbabilityInput.dispatchEvent(new Event('input'));
        }
        this.closeLuckProbabilityModal();
    }

    // 幸运倍率计算相关方法
    openLuckMultiplierModal() {
        this.luckMultiplierModal.style.display = 'block';
        // 使用z-index管理器分配最高层级
        if (window.zIndexManager) {
            window.zIndexManager.assignZIndex(this.luckMultiplierModal);
        }
        this.calculateLuckMultiplier();
    }

    closeLuckMultiplierModal() {
        this.luckMultiplierModal.style.display = 'none';
        // 从z-index管理器中移除
        if (window.zIndexManager) {
            window.zIndexManager.removeModal(this.luckMultiplierModal);
        }
    }

    calculateLuckMultiplier() {
        const baseValue = parseFloat(this.luckMultiplierBaseInput.value) || 0.4;
        const luckProbability = parseFloat(this.luckMultiplierProbabilityInput.value) || 0;
        const xCoefficient = parseFloat(this.luckMultiplierXInput.value) || 1.0;
        
        // 幸运倍率 = 固定值40% + 幸运概率/X
        const luckMultiplier = baseValue + (luckProbability / xCoefficient);
        
        this.luckMultiplierResultElement.textContent = `幸运倍率: ${luckMultiplier.toFixed(4)}`;
        
        return luckMultiplier;
    }

    applyLuckMultiplierResult() {
        const luckMultiplier = this.calculateLuckMultiplier();
        // 设置主界面的幸运倍率值
        const luckMultiplierInput = document.getElementById('luckMultiplier');
        if (luckMultiplierInput) {
            luckMultiplierInput.value = luckMultiplier.toFixed(4);
            // 触发输入事件以更新计算
            luckMultiplierInput.dispatchEvent(new Event('input'));
        }
        this.closeLuckMultiplierModal();
    }

    // 保存和加载幸运概率值
    saveLuckProbabilityValues() {
        const values = {
            fixed: this.luckProbabilityFixedInput.value,
            acquired: this.luckProbabilityAcquiredInput.value
        };
        this.saveModalValues('luckProbability', values);
    }

    loadLuckProbabilityValues() {
        const values = this.loadModalValues('luckProbability');
        if (values) {
            if (this.luckProbabilityFixedInput && values.fixed !== undefined) {
                this.luckProbabilityFixedInput.value = values.fixed || '0';
            }
            if (this.luckProbabilityAcquiredInput && values.acquired !== undefined) {
                this.luckProbabilityAcquiredInput.value = values.acquired || '500';
            }
            console.log('已加载幸运概率计算器保存值');
        }
    }

    // 保存和加载幸运倍率值
    saveLuckMultiplierValues() {
        const values = {
            base: this.luckMultiplierBaseInput.value,
            probability: this.luckMultiplierProbabilityInput.value,
            x: this.luckMultiplierXInput.value
        };
        this.saveModalValues('luckMultiplier', values);
    }

    loadLuckMultiplierValues() {
        const values = this.loadModalValues('luckMultiplier');
        if (values) {
            if (this.luckMultiplierBaseInput && values.base !== undefined) {
                this.luckMultiplierBaseInput.value = values.base || '0.4';
            }
            if (this.luckMultiplierProbabilityInput && values.probability !== undefined) {
                this.luckMultiplierProbabilityInput.value = values.probability || '0';
            }
            if (this.luckMultiplierXInput && values.x !== undefined) {
                this.luckMultiplierXInput.value = values.x || '1.0';
            }
            console.log('已加载幸运倍率计算器保存值');
        }
    }
}

// 全局弹窗管理器
let modalManager;

// 页面加载完成后初始化弹窗管理器
document.addEventListener('DOMContentLoaded', function() {
    modalManager = new ModalManager();
    // 暴露到全局作用域，供script.js中的collectModalData使用
    window.modalManager = modalManager;
    console.log('弹窗管理器已初始化并暴露到全局作用域');
});

// 全局函数，供HTML调用
function openCritModal() {
    console.log('尝试打开暴击弹窗');
    if (modalManager) {
        modalManager.openCritModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeCritModal() {
    modalManager.closeCritModal();
}

function applyCritResult() {
    modalManager.applyCritResult();
}

function openVersatilityModal() {
    console.log('尝试打开全能增幅弹窗');
    if (modalManager) {
        modalManager.openVersatilityModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeVersatilityModal() {
    modalManager.closeVersatilityModal();
}

function applyVersatilityResult() {
    modalManager.applyVersatilityResult();
}

function openThunderMarkModal() {
    modalManager.openThunderMarkModal();
}

function closeThunderMarkModal() {
    modalManager.closeThunderMarkModal();
}

function applyThunderMarkResult() {
    modalManager.applyThunderMarkResult();
}

function openMasteryModal() {
    modalManager.openMasteryModal();
}

function closeMasteryModal() {
    modalManager.closeMasteryModal();
}

function applyMasteryModalResult() {
    modalManager.applyMasteryModalResult();
}

function openDamageIncreaseModal() {
    console.log('尝试打开增伤弹窗');
    if (modalManager) {
        modalManager.openDamageIncreaseModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeDamageIncreaseModal() {
    modalManager.closeDamageIncreaseModal();
}

function applyDamageIncreaseResult() {
    modalManager.applyDamageIncreaseResult();
}

function addDamageIncrease() {
    modalManager.addDamageIncrease();
}

function openDamageReductionModal() {
    console.log('尝试打开减伤区弹窗');
    if (modalManager) {
        modalManager.openDamageReductionModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeDamageReductionModal() {
    modalManager.closeDamageReductionModal();
}

function applyDamageReductionResult() {
    modalManager.applyDamageReductionResult();
}

function openElementDamageModal() {
    modalManager.openElementDamageModal();
}

function closeElementDamageModal() {
    modalManager.closeElementDamageModal();
}

function applyElementDamageResult() {
    modalManager.applyElementDamageResult();
}

function addElementDamageItem() {
    modalManager.addElementDamageItem();
}

function openMasteryTransformModal() {
    modalManager.openMasteryTransformModal();
}

function closeMasteryTransformModal() {
    modalManager.closeMasteryTransformModal();
}

function applyMasteryTransformResult() {
    modalManager.applyMasteryTransformResult();
}

function openElementDamageItemModal() {
    modalManager.openElementDamageItemModal();
}

function closeElementDamageItemModal() {
    modalManager.closeElementDamageItemModal();
}

function openDamageIncreaseItemModal() {
    modalManager.openDamageIncreaseItemModal();
}

function closeDamageIncreaseItemModal() {
    modalManager.closeDamageIncreaseItemModal();
}

function addDamageIncreaseFromModal() {
    modalManager.addDamageIncreaseFromModal();
}

function openAttackModal() {
    modalManager.openAttackModal();
}

function closeAttackModal() {
    modalManager.closeAttackModal();
}

function applyAttackResult() {
    modalManager.applyAttackResult();
}

function openMainStatTransformModal() {
    modalManager.openMainStatTransformModal();
}

function closeMainStatTransformModal() {
    modalManager.closeMainStatTransformModal();
}

function applyMainStatTransformResult() {
    modalManager.applyMainStatTransformResult();
}

function openCoefficientModal() {
    console.log('尝试打开系数弹窗');
    if (modalManager) {
        modalManager.openCoefficientModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeCoefficientModal() {
    modalManager.closeCoefficientModal();
}

function selectJob(jobType) {
    modalManager.selectJob(jobType);
}

function backToJobSelection() {
    modalManager.backToJobSelection();
}

function copyTotalToM() {
    modalManager.copyTotalToM();
}

function copyTotalToN() {
    modalManager.copyTotalToN();
}

function copyTotalToBoth() {
    modalManager.copyTotalToBoth();
}

function applyCoefficientResult() {
    modalManager.applyCoefficientResult();
}

// 系数重置功能的全局函数
function resetCoefficientsToOne() {
    modalManager.resetCoefficientsToOne();
}

function resetOnlyM() {
    modalManager.resetOnlyM();
}

function resetOnlyN() {
    modalManager.resetOnlyN();
}

// 幸运概率计算器全局函数
function openLuckProbabilityModal() {
    console.log('尝试打开幸运概率弹窗');
    if (modalManager) {
        modalManager.openLuckProbabilityModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeLuckProbabilityModal() {
    modalManager.closeLuckProbabilityModal();
}

function applyLuckProbabilityResult() {
    modalManager.applyLuckProbabilityResult();
}

// 幸运倍率计算器全局函数
function openLuckMultiplierModal() {
    console.log('尝试打开幸运倍率弹窗');
    if (modalManager) {
        modalManager.openLuckMultiplierModal();
    } else {
        console.error('modalManager未初始化');
    }
}

function closeLuckMultiplierModal() {
    modalManager.closeLuckMultiplierModal();
}

function applyLuckMultiplierResult() {
    modalManager.applyLuckMultiplierResult();
}

// 公式折叠/展开功能
function toggleFormula(toggleElement) {
    const formulaContent = toggleElement.nextElementSibling;
    const icon = toggleElement.querySelector('.formula-icon');
    
    if (formulaContent.classList.contains('expanded')) {
        // 折叠公式
        formulaContent.classList.remove('expanded');
        icon.textContent = '📝';
        toggleElement.querySelector('.formula-text').textContent = '计算公式';
    } else {
        // 展开公式
        formulaContent.classList.add('expanded');
        icon.textContent = '📖';
        toggleElement.querySelector('.formula-text').textContent = '隐藏公式';
    }
} 