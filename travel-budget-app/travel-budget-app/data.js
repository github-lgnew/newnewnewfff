// 数据结构定义和初始数据
// 预留扩展空间，后续可以连接后端API或移动端原生功能

// 应用数据存储（实际应用中应该使用localStorage或后端数据库）
let appData = {
  balance: 10000.00, // 默认余额
  records: [], // 收支记录
  notes: [], // 记事本
  settings: {
    defaultTravelMode: 'normal', // 默认旅行模式: budget/normal/luxury
    currency: 'CNY',
    language: 'zh-CN'
  }
};

// 从localStorage加载数据
function loadData() {
  const saved = localStorage.getItem('travelBudgetApp');
  if (saved) {
    try {
      appData = JSON.parse(saved);
    } catch (e) {
      console.error('加载数据失败', e);
    }
  }
}

// 保存数据到localStorage
function saveData() {
  try {
    localStorage.setItem('travelBudgetApp', JSON.stringify(appData));
  } catch (e) {
    console.error('保存数据失败', e);
  }
}

// 初始化：加载数据
loadData();

// 收支类别配置（可扩展）
const categories = {
  income: [
    { value: 'salary', label: '工资' },
    { value: 'bonus', label: '奖金' },
    { value: 'investment', label: '投资收益' },
    { value: 'transfer', label: '转账收款' },
    { value: 'other_income', label: '其他收入' }
  ],
  expense: [
    { value: 'food', label: '餐饮' },
    { value: 'shopping', label: '购物' },
    { value: 'transport', label: '交通' },
    { value: 'entertainment', label: '娱乐' },
    { value: 'medical', label: '医疗' },
    { value: 'education', label: '教育' },
    { value: 'housing', label: '住房' },
    { value: 'travel', label: '旅行' },
    { value: 'other_expense', label: '其他支出' }
  ]
};

// 中国主要旅游城市和景点数据（示例数据，实际应该从API获取）
const travelDestinations = [
  {
    id: 'beijing',
    name: '北京',
    province: '北京市',
    description: '首都，拥有故宫、天安门、长城等著名景点',
    coordinates: { lat: 39.9042, lng: 116.4074 },
    costs: {
      budget: { transport: 200, accommodation: 150, food: 80, total: 430 },
      normal: { transport: 800, accommodation: 400, food: 200, total: 1400 },
      luxury: { transport: 2000, accommodation: 1200, food: 500, total: 3700 }
    }
  },
  {
    id: 'shanghai',
    name: '上海',
    province: '上海市',
    description: '国际化大都市，外滩、东方明珠、迪士尼乐园',
    coordinates: { lat: 31.2304, lng: 121.4737 },
    costs: {
      budget: { transport: 250, accommodation: 180, food: 100, total: 530 },
      normal: { transport: 900, accommodation: 500, food: 250, total: 1650 },
      luxury: { transport: 2500, accommodation: 1500, food: 600, total: 4600 }
    }
  },
  {
    id: 'guangzhou',
    name: '广州',
    province: '广东省',
    description: '岭南文化中心，美食之都',
    coordinates: { lat: 23.1291, lng: 113.2644 },
    costs: {
      budget: { transport: 180, accommodation: 120, food: 70, total: 370 },
      normal: { transport: 600, accommodation: 350, food: 180, total: 1130 },
      luxury: { transport: 1800, accommodation: 900, food: 400, total: 3100 }
    }
  },
  {
    id: 'shenzhen',
    name: '深圳',
    province: '广东省',
    description: '科技创新城市，主题公园众多',
    coordinates: { lat: 22.5431, lng: 114.0579 },
    costs: {
      budget: { transport: 200, accommodation: 140, food: 80, total: 420 },
      normal: { transport: 700, accommodation: 400, food: 200, total: 1300 },
      luxury: { transport: 2000, accommodation: 1000, food: 500, total: 3500 }
    }
  },
  {
    id: 'chengdu',
    name: '成都',
    province: '四川省',
    description: '天府之国，大熊猫基地，川菜美食',
    coordinates: { lat: 30.6624, lng: 104.0633 },
    costs: {
      budget: { transport: 150, accommodation: 100, food: 60, total: 310 },
      normal: { transport: 500, accommodation: 300, food: 150, total: 950 },
      luxury: { transport: 1500, accommodation: 800, food: 350, total: 2650 }
    }
  },
  {
    id: 'hangzhou',
    name: '杭州',
    province: '浙江省',
    description: '人间天堂，西湖美景，龙井茶乡',
    coordinates: { lat: 30.2741, lng: 120.1551 },
    costs: {
      budget: { transport: 180, accommodation: 130, food: 75, total: 385 },
      normal: { transport: 650, accommodation: 380, food: 190, total: 1220 },
      luxury: { transport: 1900, accommodation: 950, food: 450, total: 3300 }
    }
  },
  {
    id: 'xiamen',
    name: '厦门',
    province: '福建省',
    description: '海上花园，鼓浪屿，闽南风情',
    coordinates: { lat: 24.4798, lng: 118.0819 },
    costs: {
      budget: { transport: 220, accommodation: 150, food: 85, total: 455 },
      normal: { transport: 750, accommodation: 420, food: 210, total: 1380 },
      luxury: { transport: 2100, accommodation: 1100, food: 520, total: 3720 }
    }
  },
  {
    id: 'sanya',
    name: '三亚',
    province: '海南省',
    description: '热带海滨度假胜地，天涯海角',
    coordinates: { lat: 18.2479, lng: 109.5027 },
    costs: {
      budget: { transport: 300, accommodation: 200, food: 100, total: 600 },
      normal: { transport: 1200, accommodation: 600, food: 300, total: 2100 },
      luxury: { transport: 3000, accommodation: 2000, food: 800, total: 5800 }
    }
  },
  {
    id: 'xi_an',
    name: '西安',
    province: '陕西省',
    description: '古都长安，兵马俑，回民街美食',
    coordinates: { lat: 34.3416, lng: 108.9398 },
    costs: {
      budget: { transport: 170, accommodation: 110, food: 65, total: 345 },
      normal: { transport: 580, accommodation: 320, food: 160, total: 1060 },
      luxury: { transport: 1700, accommodation: 850, food: 380, total: 2930 }
    }
  },
  {
    id: 'suzhou',
    name: '苏州',
    province: '江苏省',
    description: '江南水乡，古典园林，丝绸之府',
    coordinates: { lat: 31.2989, lng: 120.5853 },
    costs: {
      budget: { transport: 160, accommodation: 120, food: 70, total: 350 },
      normal: { transport: 550, accommodation: 350, food: 180, total: 1080 },
      luxury: { transport: 1600, accommodation: 900, food: 420, total: 2920 }
    }
  }
];

// 计算从当前位置到目的地的距离和费用
// 这是一个简化的计算，实际应用中应该使用地图API（如高德地图、百度地图）
function calculateTravelCost(fromLat, fromLng, toDestination, travelMode) {
  // 简化计算：使用直线距离估算
  // 实际应该使用路线规划API获取真实距离和交通方式
  const distance = calculateDistance(
    fromLat, fromLng,
    toDestination.coordinates.lat, toDestination.coordinates.lng
  );

  const destinationCosts = toDestination.costs[travelMode] || toDestination.costs.normal;
  
  // 根据距离估算路费（简化计算）
  // 实际应该调用地图API获取真实路线和价格
  let transportCost = 0;
  if (distance < 200) {
    // 短途：高铁/动车
    transportCost = Math.round(distance * 0.5);
  } else if (distance < 1000) {
    // 中途：高铁
    transportCost = Math.round(distance * 0.6);
  } else {
    // 长途：飞机+高铁
    transportCost = Math.round(distance * 0.8);
  }

  const totalCost = transportCost + destinationCosts.accommodation + destinationCosts.food;
  
  return {
    distance: Math.round(distance),
    transportCost: transportCost,
    accommodation: destinationCosts.accommodation,
    food: destinationCosts.food,
    total: totalCost,
    canAfford: totalCost <= appData.balance
  };
}

// 计算两点间距离（公里）- 使用Haversine公式
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 导出数据（用于备份）
function exportData() {
  const dataStr = JSON.stringify(appData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `travel-budget-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 导入数据（从备份文件）
function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      appData = imported;
      saveData();
      // 重新加载页面数据
      if (typeof refreshAllViews === 'function') {
        refreshAllViews();
      }
      alert('数据导入成功！');
    } catch (err) {
      alert('数据格式错误，导入失败！');
    }
  };
  reader.readAsText(file);
}

// 预留：微信/支付宝支付记录导入接口
// 注意：微信和支付宝官方不提供API，可能需要：
// 1. 用户手动导出账单文件，然后解析
// 2. 使用第三方服务（需要用户授权）
// 3. 连接银行API（需要银行支持）
function importWeChatRecords(file) {
  // TODO: 解析微信账单CSV/Excel文件
  console.log('微信账单导入功能待开发');
}

function importAlipayRecords(file) {
  // TODO: 解析支付宝账单CSV/Excel文件
  console.log('支付宝账单导入功能待开发');
}

