// 主应用逻辑
// 预留扩展空间，后续可以连接后端API或移动端原生功能

let currentView = 'home';
let currentFilter = 'all';
let currentTravelMode = 'normal';
let currentLocation = null;
let editingNoteId = null;

// 初始化应用
function initApp() {
  updateBalanceDisplay();
  renderRecords();
  renderNotes();
  renderDestinations();
  setupEventListeners();
  getCurrentLocation();
  
  // 设置默认日期为今天
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('input-date').value = today;
}

// 设置事件监听器
function setupEventListeners() {
  // 底部导航
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-view');
      switchView(view);
    });
  });

  // 快速操作按钮
  document.getElementById('btn-add-income').addEventListener('click', () => {
    openRecordModal('income');
  });
  
  document.getElementById('btn-add-expense').addEventListener('click', () => {
    openRecordModal('expense');
  });
  
  document.getElementById('btn-edit-balance').addEventListener('click', () => {
    openBalanceModal();
  });

  // 记录筛选
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('filter-btn--active', b === btn);
      });
      renderRecords();
    });
  });

  // 保存记录
  document.getElementById('btn-save-record').addEventListener('click', saveRecord);

  // 关闭记录弹窗
  document.getElementById('modal-close-record').addEventListener('click', () => {
    closeModal('modal-add-record');
  });

  // 修改余额
  document.getElementById('btn-save-balance').addEventListener('click', saveBalance);
  document.getElementById('modal-close-balance').addEventListener('click', () => {
    closeModal('modal-edit-balance');
  });

  // 旅行模式切换
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentTravelMode = btn.getAttribute('data-mode');
      document.querySelectorAll('.mode-btn').forEach(b => {
        b.classList.toggle('mode-btn--active', b === btn);
      });
      renderDestinations();
    });
  });

  // 刷新位置
  document.getElementById('btn-refresh-location').addEventListener('click', getCurrentLocation);

  // 记事本
  document.getElementById('btn-add-note').addEventListener('click', () => {
    openNoteModal();
  });
  document.getElementById('btn-save-note').addEventListener('click', saveNote);
  document.getElementById('modal-close-note').addEventListener('click', () => {
    closeModal('modal-add-note');
  });

  // 设置
  document.getElementById('btn-export-data').addEventListener('click', () => {
    exportData();
  });
  
  document.getElementById('btn-clear-data').addEventListener('click', () => {
    if (confirm('确定要清空所有数据吗？此操作不可恢复！')) {
      clearAllData();
    }
  });

  // 点击弹窗外部关闭
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
  });
}

// 切换视图
function switchView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(v => {
    v.classList.remove('view--active');
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('nav-item--active');
  });
  
  document.getElementById(`view-${view}`).classList.add('view--active');
  document.querySelector(`[data-view="${view}"]`).classList.add('nav-item--active');
  
  // 更新顶部标题
  updateHeaderTitle(view);
  
  // 根据视图执行特定操作
  if (view === 'travel') {
    renderDestinations();
  }
}

// 更新顶部标题
function updateHeaderTitle(view) {
  const titles = {
    home: '记账',
    travel: '旅游',
    notes: '记事本',
    settings: '设置'
  };
  document.getElementById('app-subtitle').textContent = titles[view] || '余额管理';
}

// 更新余额显示
function updateBalanceDisplay() {
  const balanceEl = document.getElementById('current-balance');
  balanceEl.textContent = `¥${appData.balance.toFixed(2)}`;
}

// 打开添加记录弹窗
function openRecordModal(type) {
  const modal = document.getElementById('modal-add-record');
  const titleEl = document.getElementById('modal-record-title');
  const categorySelect = document.getElementById('input-category');
  
  titleEl.textContent = type === 'income' ? '添加收入' : '添加支出';
  
  // 清空表单
  document.getElementById('input-amount').value = '';
  document.getElementById('input-note').value = '';
  categorySelect.innerHTML = '<option value="">请选择类别</option>';
  
  // 填充类别选项
  const categoriesList = type === 'income' ? categories.income : categories.expense;
  categoriesList.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.value;
    option.textContent = cat.label;
    categorySelect.appendChild(option);
  });
  
  // 保存类型到按钮上
  document.getElementById('btn-save-record').setAttribute('data-type', type);
  
  openModal('modal-add-record');
}

// 保存记录
function saveRecord() {
  const type = document.getElementById('btn-save-record').getAttribute('data-type');
  const amount = parseFloat(document.getElementById('input-amount').value);
  const category = document.getElementById('input-category').value;
  const note = document.getElementById('input-note').value;
  const date = document.getElementById('input-date').value;
  
  if (!amount || amount <= 0) {
    alert('请输入有效的金额');
    return;
  }
  
  if (!category) {
    alert('请选择类别');
    return;
  }
  
  const record = {
    id: Date.now(),
    type: type,
    amount: amount,
    category: category,
    note: note || '',
    date: date || new Date().toISOString().split('T')[0]
  };
  
  appData.records.push(record);
  
  // 更新余额
  if (type === 'income') {
    appData.balance += amount;
  } else {
    appData.balance -= amount;
  }
  
  saveData();
  updateBalanceDisplay();
  renderRecords();
  closeModal('modal-add-record');
}

// 渲染记录列表
function renderRecords() {
  const container = document.getElementById('records-list');
  let filteredRecords = appData.records;
  
  if (currentFilter !== 'all') {
    filteredRecords = appData.records.filter(r => r.type === currentFilter);
  }
  
  if (filteredRecords.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">暂无记录</div>
      </div>
    `;
    return;
  }
  
  // 按日期排序（最新的在前）
  filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  container.innerHTML = filteredRecords.map(record => {
    const categoryLabel = getCategoryLabel(record.category, record.type);
    const amountDisplay = record.type === 'income' ? `+¥${record.amount.toFixed(2)}` : `-¥${record.amount.toFixed(2)}`;
    
    return `
      <div class="record-item record-item--${record.type}">
        <div class="record-info">
          <div class="record-amount ${record.type}">${amountDisplay}</div>
          <div class="record-category">${categoryLabel}</div>
          ${record.note ? `<div class="record-note">${record.note}</div>` : ''}
        </div>
        <div class="record-date">${formatDate(record.date)}</div>
      </div>
    `;
  }).join('');
}

// 获取类别标签
function getCategoryLabel(value, type) {
  const list = type === 'income' ? categories.income : categories.expense;
  const cat = list.find(c => c.value === value);
  return cat ? cat.label : value;
}

// 打开修改余额弹窗
function openBalanceModal() {
  document.getElementById('input-balance').value = appData.balance.toFixed(2);
  openModal('modal-edit-balance');
}

// 保存余额
function saveBalance() {
  const balance = parseFloat(document.getElementById('input-balance').value);
  if (isNaN(balance) || balance < 0) {
    alert('请输入有效的余额');
    return;
  }
  
  appData.balance = balance;
  saveData();
  updateBalanceDisplay();
  renderDestinations(); // 重新渲染旅游页面以更新可支付状态
  closeModal('modal-edit-balance');
}

// 获取当前位置
function getCurrentLocation() {
  const locationEl = document.getElementById('current-location');
  locationEl.textContent = '正在定位...';
  
  if (!navigator.geolocation) {
    locationEl.textContent = '浏览器不支持定位';
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // 这里可以调用逆地理编码API获取地址名称
      // 简化处理：只显示坐标
      locationEl.textContent = `纬度: ${currentLocation.lat.toFixed(4)}, 经度: ${currentLocation.lng.toFixed(4)}`;
      
      // 如果有位置，重新渲染目的地列表以计算费用
      if (currentView === 'travel') {
        renderDestinations();
      }
    },
    (error) => {
      console.error('定位失败:', error);
      locationEl.textContent = '定位失败，请检查权限';
      // 使用默认位置（北京）作为示例
      currentLocation = { lat: 39.9042, lng: 116.4074 };
      if (currentView === 'travel') {
        renderDestinations();
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
}

// 渲染目的地列表
function renderDestinations() {
  const container = document.getElementById('destinations-container');
  
  if (!currentLocation) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📍</div>
        <div class="empty-state-text">请先获取当前位置</div>
      </div>
    `;
    return;
  }
  
  container.innerHTML = travelDestinations.map(dest => {
    const costInfo = calculateTravelCost(
      currentLocation.lat,
      currentLocation.lng,
      dest,
      currentTravelMode
    );
    
    const canAfford = costInfo.canAfford;
    const cardClass = canAfford ? 'destination-card--affordable' : 'destination-card--unaffordable';
    const costClass = canAfford ? 'affordable' : 'unaffordable';
    const badge = canAfford ? '<span class="affordable-badge">可支付</span>' : '';
    
    return `
      <div class="destination-card ${cardClass}">
        <div class="destination-header">
          <div>
            <div class="destination-name">
              ${dest.name}
              ${badge}
            </div>
            <div class="destination-province">${dest.province}</div>
          </div>
          <div class="destination-cost">
            <div class="cost-total ${costClass}">¥${costInfo.total}</div>
          </div>
        </div>
        <div class="destination-description">${dest.description}</div>
        <div class="destination-details">
          <div class="detail-item">距离: ${costInfo.distance}km</div>
          <div class="detail-item">路费: ¥${costInfo.transportCost}</div>
          <div class="detail-item">住宿: ¥${costInfo.accommodation}</div>
          <div class="detail-item">餐食: ¥${costInfo.food}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 打开记事本弹窗
function openNoteModal(id = null) {
  editingNoteId = id;
  const titleEl = document.getElementById('input-note-title');
  const contentEl = document.getElementById('input-note-content');
  
  if (id) {
    const note = appData.notes.find(n => n.id === id);
    if (note) {
      titleEl.value = note.title;
      contentEl.value = note.content;
    }
  } else {
    titleEl.value = '';
    contentEl.value = '';
  }
  
  openModal('modal-add-note');
}

// 保存笔记
function saveNote() {
  const title = document.getElementById('input-note-title').value.trim();
  const content = document.getElementById('input-note-content').value.trim();
  
  if (!title) {
    alert('请输入笔记标题');
    return;
  }
  
  if (editingNoteId) {
    // 编辑现有笔记
    const note = appData.notes.find(n => n.id === editingNoteId);
    if (note) {
      note.title = title;
      note.content = content;
      note.updatedAt = new Date().toISOString();
    }
  } else {
    // 新建笔记
    const note = {
      id: Date.now(),
      title: title,
      content: content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    appData.notes.push(note);
  }
  
  saveData();
  renderNotes();
  closeModal('modal-add-note');
  editingNoteId = null;
}

// 渲染笔记列表
function renderNotes() {
  const container = document.getElementById('notes-list');
  
  if (appData.notes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <div class="empty-state-text">还没有笔记，创建一个吧</div>
      </div>
    `;
    return;
  }
  
  // 按更新时间排序
  const sortedNotes = [...appData.notes].sort((a, b) => 
    new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
  );
  
  container.innerHTML = sortedNotes.map(note => `
    <div class="note-item" onclick="openNoteModal(${note.id})">
      <div class="note-title">${note.title}</div>
      <div class="note-content">${note.content}</div>
      <div class="note-date">${formatDate(note.updatedAt || note.createdAt)}</div>
    </div>
  `).join('');
}

// 清空所有数据
function clearAllData() {
  appData.balance = 0;
  appData.records = [];
  appData.notes = [];
  saveData();
  updateBalanceDisplay();
  renderRecords();
  renderNotes();
  renderDestinations();
  alert('所有数据已清空');
}

// 工具函数：打开弹窗
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.add('modal--show');
}

// 工具函数：关闭弹窗
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('modal--show');
}

// 工具函数：格式化日期
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}

// 全局刷新函数（供data.js使用）
function refreshAllViews() {
  updateBalanceDisplay();
  renderRecords();
  renderNotes();
  renderDestinations();
}

// 注册Service Worker（PWA离线支持）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((registration) => {
        console.log('Service Worker 注册成功:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker 注册失败:', error);
      });
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initApp);

// 预留：移动端原生功能接口
// 后续可以添加：
// - 微信/支付宝支付记录抓取（需要原生SDK）
// - 推送通知
// - 本地数据库
// - 文件系统访问
// - 相机功能（扫描账单）
// - 生物识别（指纹/Face ID）

