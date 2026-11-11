const modern = 'https://www.tesla.com/';
const manual = 'https://www.tesla.com/ownersmanual/';

export const cars = [
  {
    id: 's', name: 'Model S', type: '旗艦轎跑', trim: 'Plaid', image: 's', paint: 'ruby',
    scene: 'ALPINE PASS', place: '阿爾卑斯山口', alt: '深紅色 Model S 停在雨後的山路上，背後是層疊的雪峰。',
    intro: '低伏的車身與綿延的玻璃弧線，勾勒出 Tesla 的旗艦斜背轎跑。',
    tagline: '一道弧線，從車頭延伸至車尾。',
    details: [
      ['流線斜背', '從側面看，車頂最高點一路向後收束。後擋風玻璃與行李廂蓋融為一道斜面，讓五門車身保有轎跑比例。'],
      ['平整的車側', '收合時與鈑件齊平的門把，把光線留給前後輪拱之間連續的曲面。']
    ],
    miles: 368, accel: '1.99', rollout: true, motors: 3, seats: '5', length: 5046, width: 1987, height: 1430, wheelbase: 2960,
    spec: modern+'models?redirect=no', guide: manual+'models/en_us/GUID-91E5877F-3CD2-4B3B-B2B8-B5DB4A6C0A05.html'
  },
  {
    id: '3', name: 'Model 3', type: '運動轎車', trim: 'Performance', image: '3', paint: 'pearl',
    scene: 'PACIFIC COAST', place: '太平洋海岸', alt: '珍珠白 Model 3 停在海岸公路，映著藍調時刻的海面。',
    intro: '俐落的車頭、緊湊的車身，讓這款四門運動轎車顯得輕盈。',
    tagline: '沿著車身下緣，讀懂氣流的走向。',
    details: [
      ['前後空力設計', 'Performance 的車頭下緣設有分流器，車尾以擴散器收束。切到側面，可以比較兩端貼近路面的比例。'],
      ['前後配輪圈', '20 吋鍛造輪圈搭配前後不同寬度的輪胎，從車尾三分之四視角最容易看出後輪的份量。']
    ],
    miles: 309, accel: '2.9', rollout: true, motors: 2, seats: '5', length: 4724, width: 1850, height: 1431, wheelbase: 2875,
    spec: modern+'model3?redirect=no', guide: manual+'model3/en_us/GUID-56562137-FC31-4110-A13C-9A9FC6657BF0.html'
  },
  {
    id: 'x', name: 'Model X', type: '旗艦 SUV', trim: 'Dual Motor AWD', image: 'x', paint: 'ocean',
    scene: 'CEDAR VALLEY', place: '霧杉山谷', alt: '午夜藍 Model X 在霧中的杉木林間，向上展開一扇鷹翼後車門。',
    intro: '全景前擋風玻璃銜接高聳車頂，向上展開的鷹翼後門成為車身焦點。',
    tagline: '當後門向上展開，車側成為入口。',
    details: [
      ['鷹翼式後車門', '雙鉸鏈讓後車門向上折起。從正側面看，可辨認門板在車頂處轉折的位置。'],
      ['全景擋風玻璃', '前擋風玻璃向乘客頭頂延伸，讓高車頂的 SUV 也有一條平順的車頭曲線。']
    ],
    miles: 352, accel: '3.8', rollout: false, motors: 2, seats: '最多 7', length: 5057, width: 1999, height: 1680, wheelbase: 2965,
    spec: modern+'modelx?redirect=no', guide: manual+'modelx/en_us/GUID-91E5877F-3CD2-4B3B-B2B8-B5DB4A6C0A05.html'
  },
  {
    id: 'y', name: 'Model Y', type: '跨界 SUV', trim: 'Performance', image: 'y', paint: 'silver',
    scene: 'CONCRETE COURT', place: '清水模光庭', alt: '銀色 Model Y 在清水模建築的晨光裡，橫向燈帶映出車頭輪廓。',
    intro: '跨界車的座艙高度，搭配流線的車頂與俐落的橫向燈帶。',
    tagline: '寬闊的橫向燈帶，遇上向後收束的車頂。',
    details: [
      ['橫向燈帶', '新款 Model Y 將前後燈光橫向排列。正面觀看時，燈帶在車頭畫出一道清晰的水平線。'],
      ['尾翼與擴散器', 'Performance 的碳纖維尾翼貼著尾門邊緣，後保桿下方的擴散器則整理流經底部的氣流。']
    ],
    miles: 306, accel: '3.3', rollout: true, motors: 2, seats: '5', length: 4796, width: 1920, height: 1611, wheelbase: 2890,
    spec: modern+'modely?redirect=no', guide: manual+'modely/en_us/GUID-1E76B638-7B12-4D9A-8767-94B7F1E92A0E.html'
  },
  {
    id: 'cybertruck', name: 'Cybertruck', type: '電動皮卡', trim: 'Premium AWD', image: 'ct', paint: 'silver',
    scene: 'RED ROCK BASIN', place: '紅岩盆地', alt: '不鏽鋼 Cybertruck 停在紅岩沙漠，車側折面反射落日。',
    intro: '平直的不鏽鋼外板在銳角交會，皮卡的輪廓由幾道折線構成。',
    tagline: '把曲面換成折面，光影便有了稜角。',
    details: [
      ['不鏽鋼折面', '大片平整的外板在車肩與車頂形成鮮明折線。旋轉車身，可以看到相鄰面在相同光源下呈現不同明暗。'],
      ['封閉式貨斗', '車頂稜線一路向後落到貨斗；電動捲蓋可沿著傾斜導軌收起，關閉時能將貨物鎖在車內。']
    ],
    miles: 325, accel: '4.1', rollout: false, motors: 2, seats: '5', length: 5683, width: 2032, height: 1794, wheelbase: 3635,
    spec: modern+'cybertruck?redirect=no', guide: manual+'cybertruck/en_us/GUID-12A976DD-EB60-431B-AFF1-5A37E95006DB.html'
  }
];

export const paints = {
  ruby: {name:'深緋紅', hex:'#aa192c'},
  pearl: {name:'珍珠白', hex:'#e3e4e1'},
  ocean: {name:'午夜藍', hex:'#254661'},
  silver: {name:'霧銀', hex:'#b8bdc0'},
  graphite: {name:'石墨灰', hex:'#40434b'}
};
export const byId = Object.fromEntries(cars.map(car => [car.id, car]));
export const km = car => Math.round(car.miles * 1.609344);
export const photo = car => './assets/scene-'+car.image+'.webp';
export const thumb = car => './assets/tile-'+car.image+'.webp';
export const number = value => Number(value).toLocaleString('en-US');
export const drive = car => (car.motors === 3 ? '三' : '雙')+'馬達全輪驅動';
