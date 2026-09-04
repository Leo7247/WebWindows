/* ==========================================================================
   WebOS Project Horizon - Extended System Core Engine
   ========================================================================== */

/* 雲端資料庫端點 (供所有訪客跨設備實時共享帳號) */
const CLOUD_API = "https://api.restful-api.dev/objects/ff808181932badb40193309a47320000";

/* ==========================================================================
   1. DICTIONARY (I18N) & GLOBAL STATE
   ========================================================================== */

const dict = {
  en: {
    login_err: "Incorrect password.",
    cancel: "Cancel",
    settings: "Settings",
    tab_theme: "🎨 Themes",
    tab_acc: "👤 Accounts",
    tab_lang: "🌐 Language",
    tab_about: "ℹ️ About",
    theme_title: "Appearance",
    theme_select: "OS Engine (Live)",
    bg_url: "Background URL",
    apply: "Apply",
    default: "Default",
    acc_title: "Security & Account",
    acc_name: "Username",
    acc_pw: "Password (Blank to disable)",
    acc_avatar: "Avatar URL",
    save: "Save",
    reset: "Factory Reset",
    about_title: "System Info",
    store: "App Store (Free)",
    store_desc: "Open Source Apps (No IAP)",
    file_explorer: "File Explorer (VFS)",
    fs_new: "New Text File",
    fs_upload: "Upload File",
    fs_clear: "Format Disk",
    weather: "Weather Station",
    search: "Search",
    paint: "Paint",
    calc: "Calculator",
    notepad: "Notepad",
    refresh: "Refresh",
    cm_theme: "Personalization",
    login_pw_ph: "Enter password",
    user_guide: "User Guide"
  },
  zh: {
    login_err: "密碼錯誤。",
    cancel: "取消",
    settings: "系統設定 (Settings)",
    tab_theme: "🎨 外觀與主題",
    tab_acc: "👤 安全性與帳戶",
    tab_lang: "🌐 語言與地區",
    tab_about: "ℹ️ 系統資訊",
    theme_title: "外觀與個人化",
    theme_select: "介面風格引擎 (即時切換)",
    bg_url: "自訂桌面背景 (URL)",
    apply: "套用背景",
    default: "還原預設",
    acc_title: "安全性與帳戶",
    acc_name: "顯示名稱",
    acc_pw: "登入密碼 (留白以關閉保護)",
    acc_avatar: "頭像 URL",
    save: "更新帳戶資料",
    reset: "還原原廠設定 (危險)",
    about_title: "關於 WebOS",
    store: "App Store (免費 / 無 IAP)",
    store_desc: "開源應用程式社群 (All Apps Free)",
    file_explorer: "檔案總管 (虛擬檔案系統)",
    fs_new: "新增文字檔",
    fs_upload: "上傳實體檔案",
    fs_clear: "格式化磁碟",
    weather: "氣象中心",
    search: "搜尋",
    paint: "小畫家",
    calc: "計算機",
    notepad: "記事本 (Auto-Save)",
    refresh: "重新整理",
    cm_theme: "佈景主題",
    login_pw_ph: "請輸入密碼",
    user_guide: "使用手冊 (User Guide)"
  }
};

let curLang = localStorage.getItem('os_lang') || 'zh';

const DEFAULT_USERS = {
  "User": {
    pw: "",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    isGuest: true
  },
  "Admin": {
    pw: "J45F",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135768.png",
    isGuest: false
  }
};

let usersDB = JSON.parse(localStorage.getItem('os_users_db')) || DEFAULT_USERS;
if (!usersDB["User"]) usersDB["User"] = DEFAULT_USERS["User"];
if (!usersDB["Admin"]) usersDB["Admin"] = DEFAULT_USERS["Admin"];

let currentLoginUser = "User";
let sysUser = "User";
let sysBg = localStorage.getItem('os_bg') || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2500';
let sysTheme = localStorage.getItem('os_theme') || 'theme-win10';

const coreApps = [
  { id: 'app-settings', name: 'Settings', icon: 'https://cdn-icons-png.flaticon.com/512/3132/3132084.png' },
  { id: 'app-store', name: 'App Store', icon: 'https://cdn-icons-png.flaticon.com/512/888/888846.png' },
  { id: 'app-explorer', name: 'File Explorer', icon: 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png' }
];

const storeRegistry = [
  { id: 'app-guide', nameEn: 'User Guide', nameZh: '使用手冊', icon: 'https://cdn-icons-png.flaticon.com/512/3874/3874550.png' },
  { id: 'app-browser', nameEn: 'Browser', nameZh: '瀏覽器', icon: 'https://cdn-icons-png.flaticon.com/512/888/888856.png' },
  { id: 'app-python', nameEn: 'Python IDE', nameZh: 'Python IDE', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png' },
  { id: 'app-cmd', nameEn: 'Command Prompt', nameZh: '命令提示字元', icon: 'https://cdn-icons-png.flaticon.com/512/3299/3299066.png' },
  { id: 'app-paint', nameEn: 'Paint', nameZh: '小畫家', icon: 'https://cdn-icons-png.flaticon.com/512/3003/3003102.png' },
  { id: 'app-weather', nameEn: 'Weather', nameZh: '天氣', icon: 'https://cdn-icons-png.flaticon.com/512/1163/1163661.png' },
  { id: 'app-calc', nameEn: 'Calculator', nameZh: '計算機', icon: 'https://cdn-icons-png.flaticon.com/512/1055/1055685.png' },
  { id: 'app-notepad', nameEn: 'Notepad', nameZh: '記事本', icon: 'https://cdn-icons-png.flaticon.com/512/3224/3224410.png' }
];

let installedApps = JSON.parse(localStorage.getItem('os_apps')) || [
  'app-guide',
  'app-browser',
  'app-python',
  'app-cmd',
  'app-paint'
];

/* ==========================================
   2. 跨裝置雲端資料同步 (Cloud Sync)
   ========================================== */
async function syncUsersFromCloud() {
  try {
    const response = await fetch(CLOUD_API);
    if (response.ok) {
      const payload = await response.json();
      if (payload && payload.data && typeof payload.data === 'object') {
        usersDB = { ...usersDB, ...payload.data };
        usersDB["User"] = DEFAULT_USERS["User"];
        localStorage.setItem('os_users_db', JSON.stringify(usersDB));
        updateUserSelectDropdown();
      }
    }
  } catch (error) {
    console.warn("Cloud connection error, falling back to cached accounts.", error);
  }
}

async function pushUserToCloud(username, password, avatar) {
  usersDB[username] = {
    pw: password,
    avatar: avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    isGuest: false
  };
  localStorage.setItem('os_users_db', JSON.stringify(usersDB));
  updateUserSelectDropdown();

  try {
    await fetch(CLOUD_API, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: usersDB })
    });
  } catch (error) {
    console.warn("Failed to patch cloud user database, local storage maintained.", error);
  }
}

/* ==========================================
   3. Initialization & Multi-Stage Boot Logic
   ========================================== */

const kernelLines = [
  "[    0.000000] Linux version 6.6.0-webos-generic (gcc version 13.2.0) #1 SMP PREEMPT",
  "[    0.001204] Command line: BOOT_IMAGE=/vmlinuz-webos root=/dev/vda1 ro quiet splash",
  "[    0.015234] x86/fpu: Supporting XSAVE feature 0x001: 'x87 floating point registers'",
  "[    0.032110] ACPI: Core revision 20260401",
  "[    0.045091] Memory: 16777216K/17179869K available (14336K kernel code, 2048K data)",
  "[    0.061240] Dentry cache hash table entries: 2097152 (order: 12, 16777216 bytes)",
  "[    0.089431] Inode-cache hash table entries: 1048576 (order: 11, 8388608 bytes)",
  "[    0.112048] Mount-cache hash table entries: 32768 (order: 6, 262144 bytes)",
  "[    0.140812] Initializing cgroup subsys cpu, memory, devices, freezer",
  "[    0.180291] VFS: Disk quotas dquot_6.6.0 mounted",
  "[    0.210482] NetLabel: Initializing",
  "[    0.245012] WebKit MDM Bypass tunnel driver initialized [OK]",
  "[    0.280918] Brython 3.12 Dynamic Compiler engine registered [OK]",
  "[    0.312891] EXT4-fs (vda1): mounted filesystem with ordered data mode",
  "[    0.354012] systemd[1]: Starting GUI Window Compositor & Session Daemon...",
  "[    0.410291] [  OK  ] Started Graphical Window Manager.",
  "[    0.450119] Switching runlevel: entering multi-user target GUI"
];

function initOS() {
  document.body.className = sysTheme;
  document.getElementById('theme-select').value = sysTheme;
  document.getElementById('desktop').style.backgroundImage = `url('${sysBg}')`;
  document.getElementById('lock-screen').style.backgroundImage = `url('${sysBg}')`;
  document.getElementById('set-bg-url').value = sysBg;
  document.getElementById('np-text').value = localStorage.getItem('os_np') || '';
  
  updateStartIcon(); 
  setLang(curLang); 
  updateUserSelectDropdown();
  syncUsersFromCloud();

  setTimeout(injectResizers, 250);

  // 說明視窗按鈕綁定
  const helpBtn = document.getElementById('lock-help-btn');
  const helpModal = document.getElementById('lock-help-modal');
  const closeHelpBtn = document.getElementById('close-help-btn');

  if (helpBtn) {
    helpBtn.onclick = (e) => {
      e.stopPropagation();
      helpModal.style.display = 'block';
    };
  }
  if (closeHelpBtn) {
    closeHelpBtn.onclick = (e) => {
      e.stopPropagation();
      helpModal.style.display = 'none';
    };
  }

  // --- Stage 1: BIOS POST 階段 ---
  const biosScreen = document.getElementById('bios-screen');
  const biosText = document.getElementById('bios-text');
  biosScreen.style.display = 'flex';

  const biosLines = [
    "Project Horizon BIOS v9.8.0",
    "Checking Central Processor Core... OK",
    "Initializing Touch, Pointer & Gesture Subsystem... OK",
    "Connecting Cloud User Database Endpoint... OK",
    "Mounting Virtual File System (VFS)... OK",
    "Passing control to OS Kernel..."
  ];

  let biosIdx = 0;
  function printBIOS() {
    if (biosIdx < biosLines.length) {
      const newLine = document.createElement('div');
      newLine.className = 'bios-line';
      newLine.innerText = biosLines[biosIdx];
      biosText.appendChild(newLine);
      biosIdx++;
      setTimeout(printBIOS, 80 + Math.random() * 80);
    } else {
      setTimeout(startKernelBoot, 200);
    }
  }

  // --- Stage 2: Kernel Boot 核心文字滾動階段 ---
  function startKernelBoot() {
    biosScreen.style.display = 'none';
    const kernelScreen = document.getElementById('kernel-screen');
    const kernelText = document.getElementById('kernel-text');
    kernelScreen.style.display = 'block';

    let kIdx = 0;
    function printKernel() {
      if (kIdx < kernelLines.length) {
        const line = document.createElement('div');
        line.innerText = kernelLines[kIdx];
        kernelText.appendChild(line);
        kernelScreen.scrollTop = kernelScreen.scrollHeight;
        kIdx++;
        setTimeout(printKernel, 35 + Math.random() * 40);
      } else {
        setTimeout(startGUIBoot, 300);
      }
    }
    printKernel();
  }

  // --- Stage 3: GUI 圖形開機載入畫面 ---
  function startGUIBoot() {
    const kernelScreen = document.getElementById('kernel-screen');
    kernelScreen.style.display = 'none';
    
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.style.display = 'flex';

    setTimeout(() => {
      bootScreen.style.display = 'none';
      document.getElementById('lock-screen').style.display = 'block';
    }, 1200);
  }

  // 開始開機流程
  printBIOS();
  
  renderDesktop();
  renderFS();
  initPaint();
  initCalc();
  initGuide();
  setInterval(updateTime, 1000);
  updateTime();
}

function updateStartIcon() {
  const icon = document.getElementById('start-icon');
  if (sysTheme === 'theme-win10') {
    icon.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Windows_logo_-_2021.svg';
  } else if (sysTheme === 'theme-macos') {
    icon.src = 'https://cdn-icons-png.flaticon.com/512/732/732221.png';
  } else if (sysTheme === 'theme-ubuntu') {
    icon.src = 'https://cdn-icons-png.flaticon.com/512/825/825501.png';
  }
}

function setLang(lang) {
  curLang = lang;
  localStorage.setItem('os_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[lang][key]) {
      el.innerText = dict[lang][key];
    }
  });

  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const lookupKey = key.replace('_ph', '');
    if (dict[lang][lookupKey]) {
      el.placeholder = dict[lang][lookupKey];
    }
  });

  renderStore();
  renderDesktop();
}

function updateUserSelectDropdown() {
  const select = document.getElementById('user-select-list');
  select.innerHTML = '';
  for (let username in usersDB) {
    const option = document.createElement('option');
    option.value = username;
    option.innerText = username + (usersDB[username].isGuest ? " (訪客 - 無密碼)" : "");
    if (username === currentLoginUser) {
      option.selected = true;
    }
    select.appendChild(option);
  }
  updateLoginUIForUser(currentLoginUser);
}

function updateLoginUIForUser(userName) {
  currentLoginUser = userName;
  document.getElementById('login-user-name').innerText = userName;
  const avatarUrl = usersDB[userName]?.avatar || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  document.getElementById('login-avatar').src = avatarUrl;
  
  const pwInput = document.getElementById('login-pw');
  pwInput.value = '';
  document.getElementById('login-err').style.display = 'none';

  if (userName === "User") {
    pwInput.placeholder = "User 無需密碼，直接點擊 ➔";
  } else {
    pwInput.placeholder = "請輸入密碼";
  }
}

document.getElementById('user-select-list').onchange = (e) => {
  updateLoginUIForUser(e.target.value);
};

// 鎖定畫面點擊切換進入登入框
document.getElementById('lock-time-view').onclick = () => {
  document.getElementById('lock-time-view').style.transform = 'translateY(-100%)';
  document.getElementById('login-view').style.transform = 'translateY(0)';
  setTimeout(() => {
    document.getElementById('login-pw').focus();
  }, 450);
};

document.getElementById('login-cancel').onclick = () => {
  document.getElementById('lock-time-view').style.transform = 'translateY(0)';
  document.getElementById('login-view').style.transform = 'translateY(100%)';
  document.getElementById('login-err').style.display = 'none';
};

document.getElementById('login-btn').onclick = attemptLogin;

function attemptLogin() {
  const inputPw = document.getElementById('login-pw').value;
  const targetUser = usersDB[currentLoginUser];

  if (currentLoginUser === "User" || (targetUser && inputPw === targetUser.pw)) {
    sysUser = currentLoginUser;
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('desktop').style.display = 'block';

    document.getElementById('set-username').value = sysUser;
    document.getElementById('set-password').value = targetUser.pw;
    document.getElementById('set-avatar').value = targetUser.avatar;

    if (sysUser === "User") {
      document.getElementById('onboarding-modal').style.display = 'flex';
    } else {
      document.getElementById('onboarding-modal').style.display = 'none';
    }
  } else {
    document.getElementById('login-err').style.display = 'block';
  }
}

// "User" 新增帳號並自動登出
document.getElementById('ob-submit-btn').onclick = async () => {
  const newName = document.getElementById('ob-username').value.trim();
  const newPw = document.getElementById('ob-password').value.trim();
  const newAv = document.getElementById('ob-avatar').value.trim();
  const errBox = document.getElementById('ob-error');

  if (!newName || !newPw) {
    errBox.innerText = "❌ 帳號名稱與密碼為必填項目！";
    errBox.style.display = 'block';
    return;
  }
  if (newName.toLowerCase() === "user") {
    errBox.innerText = "❌ 不能使用保留名稱 User！";
    errBox.style.display = 'block';
    return;
  }

  errBox.style.display = 'none';
  const submitBtn = document.getElementById('ob-submit-btn');
  submitBtn.innerText = "正在推送到雲端...";

  await pushUserToCloud(newName, newPw, newAv);

  alert(`🎉 帳戶「${newName}」已同步至雲端！\n其他 iPad 或電腦皆可見到此帳戶。現在將自動登出。`);
  
  document.getElementById('ob-username').value = '';
  document.getElementById('ob-password').value = '';
  document.getElementById('ob-avatar').value = '';
  submitBtn.innerText = "建立帳戶並登出 ➔";
  document.getElementById('onboarding-modal').style.display = 'none';

  currentLoginUser = newName;
  document.getElementById('desktop').style.display = 'none';
  document.getElementById('login-cancel').click();
  document.getElementById('lock-screen').style.display = 'block';
  updateUserSelectDropdown();
};

// Power Actions
document.getElementById('pwr-logout').onclick = () => {
  document.getElementById('desktop').style.display = 'none';
  document.getElementById('login-cancel').click();
  document.getElementById('lock-screen').style.display = 'block';
  document.getElementById('login-pw').value = '';
  syncUsersFromCloud();
};

document.getElementById('pwr-reboot').onclick = () => {
  document.getElementById('desktop').style.display = 'none';
  document.getElementById('black-screen').style.display = 'block';
  setTimeout(() => {
    location.reload();
  }, 900);
};

document.getElementById('pwr-shutdown').onclick = () => {
  document.getElementById('desktop').style.display = 'none';
  document.getElementById('black-screen').style.display = 'block';
};

/* ==========================================================================
   4. WINDOW MANAGER (POINTER EVENTS ENGINE FOR IPAD & MOUSE)
   ========================================================================== */

let zIndex = 100;

function openApp(id) {
  if (sysUser === "User" && document.getElementById('onboarding-modal').style.display === 'flex') {
    alert("請先建立你的專屬帳號！");
    return;
  }

  const win = document.getElementById(id);
  win.style.display = 'flex';
  document.getElementById('start-menu').style.display = 'none';
  
  const tbIcon = document.getElementById('tb-' + id);
  if (tbIcon) {
    tbIcon.style.display = 'flex';
  }
  
  bringToFront(id);
  document.querySelectorAll('.taskbar-icon').forEach(icon => icon.classList.remove('active'));
  if (tbIcon) {
    tbIcon.classList.add('active');
  }

  if (id === 'app-cmd') {
    document.getElementById('term-input').focus();
  }
}

function closeApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  const tbIcon = document.getElementById('tb-' + id);
  if (tbIcon) {
    tbIcon.style.display = 'none';
  }
}

function toggleApp(id) {
  const win = document.getElementById(id);
  if (win.style.display === 'flex' && win.style.zIndex == zIndex) {
    minApp(id);
  } else {
    openApp(id);
  }
}

function minApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'none';
  const tbIcon = document.getElementById('tb-' + id);
  if (tbIcon) {
    tbIcon.classList.remove('active');
  }
}

function maxApp(id) {
  const win = document.getElementById(id);
  if (win.dataset.max === '1') {
    win.style.width = win.dataset.w;
    win.style.height = win.dataset.h;
    win.style.top = win.dataset.t;
    win.style.left = win.dataset.l;
    win.dataset.max = '0';
  } else {
    win.dataset.w = win.style.width || (win.offsetWidth + 'px');
    win.dataset.h = win.style.height || (win.offsetHeight + 'px');
    win.dataset.t = win.style.top || (win.offsetTop + 'px');
    win.dataset.l = win.style.left || (win.offsetLeft + 'px');
    win.style.width = '100%';
    win.style.height = 'calc(100% - var(--taskbar-height))';
    win.style.top = document.body.classList.contains('theme-ubuntu') ? 'var(--taskbar-height)' : '0';
    win.style.left = '0';
    win.dataset.max = '1';
  }
}

function bringToFront(id) {
  zIndex++;
  const win = document.getElementById(id);
  if (win) {
    win.style.zIndex = zIndex;
  }
}

/* --- 視窗拖曳核心引擎 (Pointer Events 統整觸控與滑鼠) --- */
let isDrag = false;
let curWin = null;
let oX = 0;
let oY = 0;

document.querySelectorAll('.title-bar').forEach(bar => {
  const winId = bar.getAttribute('data-win');

  bar.addEventListener('pointerdown', (e) => {
    if (e.target.classList.contains('ctrl-btn')) return;

    isDrag = true;
    curWin = document.getElementById(winId);
    bringToFront(winId);

    const rect = curWin.getBoundingClientRect();
    oX = e.clientX - rect.left;
    oY = e.clientY - rect.top;

    bar.setPointerCapture(e.pointerId);
  });

  bar.addEventListener('pointermove', (e) => {
    if (isDrag && curWin && curWin.dataset.max !== '1') {
      let newX = e.clientX - oX;
      let newY = e.clientY - oY;

      if (newY < 0) newY = 0;

      curWin.style.left = newX + 'px';
      curWin.style.top = newY + 'px';
    }
  });

  const stopDragHandler = (e) => {
    if (isDrag) {
      isDrag = false;
      curWin = null;
      try {
        bar.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  bar.addEventListener('pointerup', stopDragHandler);
  bar.addEventListener('pointercancel', stopDragHandler);

  const closeBtn = bar.querySelector('.close');
  if (closeBtn) closeBtn.onclick = () => closeApp(winId);

  const maxBtn = bar.querySelector('.max');
  if (maxBtn) maxBtn.onclick = () => maxApp(winId);

  const minBtn = bar.querySelector('.min');
  if (minBtn) minBtn.onclick = () => minApp(winId);
});

/* --- 視窗縮放核心引擎 --- */
function injectResizers() {
  document.querySelectorAll('.window').forEach(win => {
    if (win.querySelector('.resizer')) return;

    const directions = ['r', 'b', 'br'];
    directions.forEach(dir => {
      const resizer = document.createElement('div');
      resizer.className = `resizer resizer-${dir}`;
      win.appendChild(resizer);

      let isResizing = false;
      let startX = 0;
      let startY = 0;
      let startW = 0;
      let startH = 0;

      resizer.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        bringToFront(win.id);

        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startW = win.offsetWidth;
        startH = win.offsetHeight;

        resizer.setPointerCapture(e.pointerId);
      });

      resizer.addEventListener('pointermove', (e) => {
        if (!isResizing) return;

        if (dir === 'r' || dir === 'br') {
          const newW = startW + (e.clientX - startX);
          if (newW > 320) {
            win.style.width = newW + 'px';
          }
        }
        if (dir === 'b' || dir === 'br') {
          const newH = startH + (e.clientY - startY);
          if (newH > 240) {
            win.style.height = newH + 'px';
          }
        }
      });

      const stopResizeHandler = (e) => {
        if (isResizing) {
          isResizing = false;
          try {
            resizer.releasePointerCapture(e.pointerId);
          } catch (err) {}
        }
      };

      resizer.addEventListener('pointerup', stopResizeHandler);
      resizer.addEventListener('pointercancel', stopResizeHandler);
    });
  });
}

// 開始按鈕
document.getElementById('start-btn').onclick = (e) => {
  e.stopPropagation();
  const startMenu = document.getElementById('start-menu');
  startMenu.style.display = (startMenu.style.display === 'flex') ? 'none' : 'flex';
  document.getElementById('power-menu').style.display = 'none';
};

document.getElementById('start-pwr').onclick = (e) => {
  e.stopPropagation();
  const pMenu = document.getElementById('power-menu');
  pMenu.style.display = (pMenu.style.display === 'flex') ? 'none' : 'flex';
};

document.getElementById('start-set').onclick = () => openApp('app-settings');

document.getElementById('start-acc').onclick = () => {
  openApp('app-settings');
  const accTab = document.querySelector('[data-tab="set-account"]');
  if (accTab) accTab.click();
};

document.addEventListener('click', (e) => {
  if (!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('power-menu').style.display = 'none';
  }
  if (!e.target.closest('#context-menu')) {
    document.getElementById('context-menu').style.display = 'none';
  }
});

// 桌面右鍵快顯
document.addEventListener('contextmenu', (e) => {
  if (e.target.closest('.window') || e.target.closest('#taskbar') || e.target.closest('#start-menu')) return;
  const contextMenu = document.getElementById('context-menu');
  contextMenu.style.display = 'block';
  contextMenu.style.left = e.clientX + 'px';
  contextMenu.style.top = e.clientY + 'px';
});

document.getElementById('cm-refresh').onclick = () => location.reload();
document.getElementById('cm-theme').onclick = () => {
  openApp('app-settings');
  const themeTab = document.querySelector('[data-tab="set-theme"]');
  if (themeTab) themeTab.click();
};
document.getElementById('cm-fs').onclick = () => openApp('app-explorer');

/* ==========================================================================
   5. DESKTOP, APP STORE & VIRTUAL FILE SYSTEM (VFS)
   ========================================================================== */

function getAppName(app) {
  return app.name ? app.name : (curLang === 'zh' ? app.nameZh : app.nameEn);
}

function getAllApps() {
  const custom = storeRegistry.filter(app => installedApps.includes(app.id));
  return [...coreApps, ...custom];
}

/* --- 修復核心：桌面圖示支援單擊直接開啟（專門針對 iPad/手機優化） --- */
function renderDesktop() {
  const desktopBox = document.getElementById('desktop-icons');
  const startList = document.getElementById('start-app-list');
  const startTiles = document.getElementById('start-tiles');
  const taskbarApps = document.getElementById('taskbar-apps');

  desktopBox.innerHTML = '';
  startList.innerHTML = '';
  startTiles.innerHTML = '';
  taskbarApps.innerHTML = '';

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  getAllApps().forEach(app => {
    const displayName = getAppName(app);

    // 桌面圖示建立
    const iconItem = document.createElement('div');
    iconItem.className = 'icon';

    // 觸控設備單擊即開，滑鼠設備雙擊開啟
    if (isTouchDevice) {
      iconItem.onclick = () => openApp(app.id);
    } else {
      iconItem.ondblclick = () => openApp(app.id);
      iconItem.onclick = () => {
        document.querySelectorAll('.desktop-icons .icon').forEach(i => i.style.background = 'transparent');
        iconItem.style.background = 'rgba(255, 255, 255, 0.25)';
      };
    }

    iconItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    desktopBox.appendChild(iconItem);

    // 開始功能表列表
    const listItem = document.createElement('div');
    listItem.className = 'start-app-item';
    listItem.onclick = () => openApp(app.id);
    listItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    startList.appendChild(listItem);

    // 開始功能表磁貼
    const tileItem = document.createElement('div');
    tileItem.className = 'tile';
    tileItem.onclick = () => openApp(app.id);
    tileItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    startTiles.appendChild(tileItem);

    // 工作列按鈕
    const tbItem = document.createElement('div');
    tbItem.className = 'taskbar-icon';
    tbItem.id = 'tb-' + app.id;
    tbItem.title = displayName;
    tbItem.style.display = 'none';
    tbItem.onclick = () => toggleApp(app.id);
    tbItem.innerHTML = `<img src="${app.icon}">`;
    taskbarApps.appendChild(tbItem);
  });
}

function renderStore() {
  const storeGrid = document.getElementById('store-grid');
  storeGrid.innerHTML = '';

  storeRegistry.forEach(app => {
    const isInst = installedApps.includes(app.id);
    const card = document.createElement('div');
    card.className = 'store-card';

    const infoWrap = document.createElement('div');
    infoWrap.style.flex = '1';
    infoWrap.innerHTML = `<div style="font-weight:bold; font-size:16px;">${getAppName(app)}</div>`;

    const actionBtn = document.createElement('button');
    actionBtn.className = isInst ? 'store-btn installed' : 'store-btn';
    actionBtn.innerText = isInst ? 'Uninstall' : 'Install';
    actionBtn.onclick = () => {
      if (isInst) {
        uninstallApp(app.id);
      } else {
        installApp(app.id);
      }
    };

    card.innerHTML = `<img src="${app.icon}">`;
    card.appendChild(infoWrap);
    card.appendChild(actionBtn);
    storeGrid.appendChild(card);
  });
}

function installApp(id) {
  if (!installedApps.includes(id)) {
    installedApps.push(id);
    localStorage.setItem('os_apps', JSON.stringify(installedApps));
    renderDesktop();
    renderStore();
  }
}

function uninstallApp(id) {
  installedApps = installedApps.filter(appId => appId !== id);
  localStorage.setItem('os_apps', JSON.stringify(installedApps));
  closeApp(id);
  renderDesktop();
  renderStore();
}

// 虛擬檔案系統 (VFS)
let vfs = JSON.parse(localStorage.getItem('os_vfs')) || {
  'README.txt': 'WebOS Virtual File System persistent storage.\nAll changes remain intact in your browser LocalStorage.'
};

function saveVFS() {
  localStorage.setItem('os_vfs', JSON.stringify(vfs));
}

function renderFS() {
  const fsGrid = document.getElementById('fs-grid');
  fsGrid.innerHTML = '';

  for (let filename in vfs) {
    const isTxt = filename.endsWith('.txt');
    const iconSrc = isTxt 
      ? 'https://cdn-icons-png.flaticon.com/512/3224/3224410.png' 
      : 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';

    const fileItem = document.createElement('div');
    fileItem.className = 'fs-item';
    fileItem.onclick = () => openFile(filename);
    fileItem.oncontextmenu = (e) => {
      e.preventDefault();
      delFile(filename);
    };
    fileItem.innerHTML = `<img src="${iconSrc}"><div class="fs-item-name">${filename}</div>`;
    fsGrid.appendChild(fileItem);
  }
}

document.getElementById('fs-btn-new').onclick = () => {
  const name = prompt("File name:", "NewFile.txt");
  if (name && !vfs[name]) {
    vfs[name] = "";
    saveVFS();
    renderFS();
  }
};

document.getElementById('fs-upload').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    vfs[file.name] = evt.target.result;
    saveVFS();
    renderFS();
  };
  reader.readAsDataURL(file);
};

document.getElementById('fs-btn-clear').onclick = () => {
  if (confirm("Format VFS? All virtual disk data will be deleted.")) {
    vfs = {};
    saveVFS();
    renderFS();
  }
};

window.openFile = (name) => {
  if (name.endsWith('.txt')) {
    openApp('app-notepad');
    document.getElementById('np-text').value = vfs[name];
  } else {
    alert("Preview format not directly supported. Size: " + vfs[name].length + " bytes.");
  }
};

window.delFile = (name) => {
  if (confirm(`Delete file: ${name}?`)) {
    delete vfs[name];
    saveVFS();
    renderFS();
  }
};

/* ==========================================================================
   6. COMMAND PROMPT (FULL WINDOWS CMD SIMULATOR)
   ========================================================================== */

let cmdHistory = [];
let historyIndex = -1;
let currentPath = "C:\\Users\\Admin";

const cmdInput = document.getElementById('term-input');
const cmdOutput = document.getElementById('term-output');
const cmdPromptLabel = document.getElementById('term-prompt');

function updatePromptDisplay() {
  cmdPromptLabel.innerText = currentPath + ">";
}

cmdInput.onkeydown = (e) => {
  if (e.key === 'ArrowUp') {
    if (cmdHistory.length > 0 && historyIndex > 0) {
      historyIndex--;
      cmdInput.value = cmdHistory[historyIndex];
    } else if (cmdHistory.length > 0 && historyIndex === -1) {
      historyIndex = cmdHistory.length - 1;
      cmdInput.value = cmdHistory[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      cmdInput.value = cmdHistory[historyIndex];
    } else {
      historyIndex = -1;
      cmdInput.value = "";
    }
    e.preventDefault();
  } else if (e.key === 'Enter') {
    const rawLine = cmdInput.value;
    const trimmed = rawLine.trim();
    if (trimmed) {
      cmdHistory.push(trimmed);
      historyIndex = -1;
    }
    executeCommand(trimmed, rawLine);
    cmdInput.value = '';
    const container = document.getElementById('term-container');
    container.scrollTop = container.scrollHeight;
  }
};

function executeCommand(cmdStr, rawLine) {
  cmdOutput.innerHTML += `<div>${currentPath}&gt; ${rawLine}</div>`;
  if (!cmdStr) return;

  if (cmdStr.includes('>')) {
    const parts = cmdStr.split('>');
    const leftText = parts[0].trim();
    const targetFileName = parts[1].trim();
    if (leftText.toLowerCase().startsWith('echo ') && targetFileName) {
      vfs[targetFileName] = leftText.substring(5);
      saveVFS();
      renderFS();
      return;
    }
  }

  const tokens = cmdStr.split(' ');
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  switch (cmd) {
    case 'help':
      cmdOutput.innerHTML += `
<div style="color:#aaaaaa;">
CD             顯示當前目錄的名稱或變更當前目錄。<br>
CLS            清除螢幕文字記錄。<br>
COLOR          設定終端機色彩 (0a, 0c, 0f, 0e)。<br>
DATE           顯示當前系統日期。<br>
DEL            刪除虛擬檔案系統中之檔案。<br>
DIR            顯示目錄中的檔案與子目錄清單。<br>
ECHO           顯示訊息，或將輸出重新定向到檔案。<br>
EXIT           退出 CMD 命令列。<br>
HELP           提供 Windows 命令的說明資訊。<br>
MD / MKDIR     建立新目錄。<br>
TIME           顯示當前系統時間。<br>
TYPE           顯示文字檔案的內容。<br>
VER            顯示 Windows 作業系統版本。<br>
</div>`;
      break;

    case 'dir':
    case 'ls':
      const files = Object.keys(vfs);
      const dateStr = new Date().toLocaleDateString('zh-HK');
      let dirHTML = `<div>Volume in drive C is WebOS_System</div><br><div> Directory of ${currentPath}</div><br>`;
      let totalBytes = 0;
      files.forEach(f => {
        const len = vfs[f].length;
        totalBytes += len;
        dirHTML += `<div>${dateStr}     ${len.toString().padStart(6, ' ')} ${f}</div>`;
      });
      dirHTML += `<br><div>       ${files.length} File(s)    ${totalBytes} bytes</div><br>`;
      cmdOutput.innerHTML += dirHTML;
      break;

    case 'cd':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>${currentPath}</div>`;
      } else if (args[0] === '..' || args[0] === '../') {
        const segs = currentPath.split('\\');
        if (segs.length > 1) {
          segs.pop();
          currentPath = segs.join('\\') || "C:\\";
        }
        updatePromptDisplay();
      } else if (args[0] === '\\' || args[0] === '/') {
        currentPath = "C:\\";
        updatePromptDisplay();
      } else {
        currentPath = `${currentPath}\\${args[0]}`;
        updatePromptDisplay();
      }
      break;

    case 'cls':
    case 'clear':
      cmdOutput.innerHTML = '';
      break;

    case 'ver':
      cmdOutput.innerHTML += `<div>Microsoft Windows [Version 10.0.19045.3086]</div>`;
      break;

    case 'date':
      cmdOutput.innerHTML += `<div>Current Date: ${new Date().toLocaleDateString('zh-HK')}</div>`;
      break;

    case 'time':
      cmdOutput.innerHTML += `<div>Current Time: ${new Date().toLocaleTimeString('zh-HK')}</div>`;
      break;

    case 'echo':
      cmdOutput.innerHTML += `<div>${args.join(' ')}</div>`;
      break;

    case 'type':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>The syntax of the command is incorrect.</div>`;
      } else if (vfs[args[0]] !== undefined) {
        cmdOutput.innerHTML += `<div>${vfs[args[0]]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>The system cannot find the file specified.</div>`;
      }
      break;

    case 'del':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>The syntax of the command is incorrect.</div>`;
      } else if (vfs[args[0]] !== undefined) {
        delete vfs[args[0]];
        saveVFS();
        renderFS();
        cmdOutput.innerHTML += `<div>Deleted: ${args[0]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>Could not find ${args[0]}.</div>`;
      }
      break;

    case 'md':
    case 'mkdir':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>The syntax of the command is incorrect.</div>`;
      } else {
        vfs[`[DIR]_${args[0]}`] = "";
        saveVFS();
        renderFS();
      }
      break;

    case 'color':
      if (args[0]) {
        const c = args[0].toLowerCase();
        const t = document.getElementById('term-container');
        if (c === '0a') t.style.color = '#00ff00';
        else if (c === '0c') t.style.color = '#ff4444';
        else if (c === '0f') t.style.color = '#ffffff';
        else if (c === '0e') t.style.color = '#ffff00';
        else t.style.color = '#cccccc';
      }
      break;

    case 'exit':
      closeApp('app-cmd');
      break;

    default:
      cmdOutput.innerHTML += `<div>'${cmd}' is not recognized as an internal or external command.</div>`;
      break;
  }
}

/* ==========================================================================
   7. APPS LOGIC (SETTINGS, BROWSER, WEATHER, PAINT, CALC, GUIDE)
   ========================================================================== */

function initGuide() {
  document.querySelectorAll('.guide-nav-item').forEach(item => {
    item.onclick = () => {
      document.querySelectorAll('.guide-nav-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.guide-section').forEach(el => el.style.display = 'none');
      item.classList.add('active');
      document.getElementById(item.getAttribute('data-tab')).style.display = 'block';
    };
  });
}

document.querySelectorAll('.set-nav-item').forEach(item => {
  item.onclick = () => {
    document.querySelectorAll('.set-nav-item').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.settings-main > div').forEach(el => el.style.display = 'none');
    item.classList.add('active');
    document.getElementById(item.getAttribute('data-tab')).style.display = 'block';
  };
});

window.changeTheme = () => {
  sysTheme = document.getElementById('theme-select').value;
  document.body.className = sysTheme;
  localStorage.setItem('os_theme', sysTheme);
  updateStartIcon();
};

window.changeWallpaper = () => {
  sysBg = document.getElementById('set-bg-url').value;
  localStorage.setItem('os_bg', sysBg);
  document.getElementById('desktop').style.backgroundImage = `url('${sysBg}')`;
  document.getElementById('lock-screen').style.backgroundImage = `url('${sysBg}')`;
};

document.getElementById('btn-save-acc').onclick = () => {
  const u = document.getElementById('set-username').value.trim();
  const p = document.getElementById('set-password').value.trim();
  const av = document.getElementById('set-avatar').value.trim();
  if (!u) {
    alert("名稱不能為空！");
    return;
  }
  usersDB[u] = {
    pw: p,
    avatar: av || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    isGuest: false
  };
  localStorage.setItem('os_users_db', JSON.stringify(usersDB));
  updateUserSelectDropdown();
  alert("帳戶資料已更新！");
};

document.getElementById('btn-create-acc').onclick = async () => {
  const n = document.getElementById('new-u-name').value.trim();
  const p = document.getElementById('new-u-pw').value.trim();
  const a = document.getElementById('new-u-av').value.trim();

  if (!n || !p) {
    alert("❌ 帳戶名稱與密碼為必填項目！");
    return;
  }

  const btn = document.getElementById('btn-create-acc');
  btn.innerText = "正在推送到雲端...";
  await pushUserToCloud(n, p, a);

  document.getElementById('new-u-name').value = '';
  document.getElementById('new-u-pw').value = '';
  document.getElementById('new-u-av').value = '';
  btn.innerText = "確認建立新帳戶並同步";

  alert(`✅ 帳號「${n}」已成功建立並同步！在另一部 iPad 上打開網頁即可看見此帳號。`);
};

document.getElementById('btn-reset').onclick = () => {
  if (confirm("確定重設？這將清空所有本地快取資料。")) {
    localStorage.clear();
    location.reload();
  }
};

document.getElementById('btn-lang-zh').onclick = () => setLang('zh');
document.getElementById('btn-lang-en').onclick = () => setLang('en');

// Browser (Smart Omnibox & MDM Tunnel)
let mdmMode = false;
document.getElementById('mdm-toggle-btn').onclick = () => {
  mdmMode = !mdmMode;
  const btn = document.getElementById('mdm-toggle-btn');
  const warn = document.getElementById('mdm-warning');
  if (mdmMode) {
    btn.classList.add('active');
    btn.innerText = "MDM Proxy: ON";
    if (warn) {
      warn.style.display = "block";
      warn.innerText = "⚠️ WebKit MDM Bypass 已啟動：正透過 Google Translate 代理載入...";
    }
  } else {
    btn.classList.remove('active');
    btn.innerText = "MDM Proxy: OFF";
    if (warn) warn.style.display = "none";
  }
  if (document.getElementById('url-input').value) {
    navBrowser();
  }
};

window.navBrowser = () => {
  let input = document.getElementById('url-input').value.trim();
  let url = "";
  if (!input) {
    url = 'https://www.google.com/webhp?igu=1';
  } else if (!input.includes('.') || input.includes(' ')) {
    url = `https://www.google.com/search?igu=1&q=${encodeURIComponent(input)}`;
  } else {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      url = 'https://' + input;
    } else {
      url = input;
    }
    if (url.includes('google.com') && !url.includes('igu=1')) {
      if (url.includes('/search?')) url += '&igu=1';
      else url = 'https://www.google.com/webhp?igu=1';
    }
  }
  if (mdmMode) {
    url = `https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=${encodeURIComponent(url)}`;
  }
  document.getElementById('browser-frame').src = url;
};

document.getElementById('b-reload').onclick = navBrowser;
document.getElementById('b-back').onclick = () => {
  document.getElementById('browser-frame').contentWindow.history.back();
};

// Weather
async function fetchWeather(lat, lon, cityName) {
  document.getElementById('w-city').innerText = cityName;
  document.getElementById('w-temp').innerText = "...";
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await response.json();
    document.getElementById('w-temp').innerText = data.current_weather.temperature + '°C';
    document.getElementById('w-desc').innerText = 'Satellite Link OK';
  } catch (err) {
    document.getElementById('w-desc').innerText = "連線失敗";
  }
}

document.getElementById('w-search').onclick = () => {
  const citySelect = document.getElementById('weather-city');
  const coords = citySelect.value.split(',');
  const cityName = citySelect.options[citySelect.selectedIndex].text;
  fetchWeather(coords[0], coords[1], cityName);
};

document.getElementById('w-gps').onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "📍 當前 GPS 定位"),
      () => alert("無法取得定位權限。")
    );
  }
};

// Paint (支援 iPad 觸控螢幕座標轉換)
let paintCanvas, ctx;
let painting = false;
let paintColor = '#000000';
let brushSize = 4;
let isEraser = false;

function initPaint() {
  paintCanvas = document.getElementById('paint-canvas');
  ctx = paintCanvas.getContext('2d');
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function getCanvasCoords(e) {
    const rect = paintCanvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (paintCanvas.width / rect.width),
      y: (e.clientY - rect.top) * (paintCanvas.height / rect.height)
    };
  }

  paintCanvas.addEventListener('pointerdown', (e) => {
    painting = true;
    const pos = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    paintCanvas.setPointerCapture(e.pointerId);
  });

  paintCanvas.addEventListener('pointermove', (e) => {
    if (!painting) return;
    const pos = getCanvasCoords(e);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : paintColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  const stopPaintHandler = (e) => {
    if (painting) {
      painting = false;
      ctx.beginPath();
      try {
        paintCanvas.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  paintCanvas.addEventListener('pointerup', stopPaintHandler);
  paintCanvas.addEventListener('pointercancel', stopPaintHandler);

  document.getElementById('p-tool-pen').onclick = () => {
    isEraser = false;
    document.getElementById('p-tool-pen').classList.add('active');
    document.getElementById('p-tool-eraser').classList.remove('active');
  };

  document.getElementById('p-tool-eraser').onclick = () => {
    isEraser = true;
    document.getElementById('p-tool-eraser').classList.add('active');
    document.getElementById('p-tool-pen').classList.remove('active');
  };

  const sizeInput = document.getElementById('p-brush-size');
  sizeInput.oninput = () => {
    brushSize = sizeInput.value;
  };

  const colorInput = document.getElementById('p-color-picker');
  colorInput.onchange = () => {
    paintColor = colorInput.value;
    isEraser = false;
    document.getElementById('p-tool-pen').classList.add('active');
    document.getElementById('p-tool-eraser').classList.remove('active');
  };

  document.getElementById('p-clear').onclick = () => {
    if (confirm("確定清除整張畫布？")) {
      ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    }
  };

  document.getElementById('p-save').onclick = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = paintCanvas.toDataURL('image/png');
    link.click();
  };
}

// Calculator
let calcV = "";
window.calcIn = (k) => {
  const display = document.getElementById('calc-display');
  if (k === 'C') {
    calcV = "";
    display.value = "0";
  } else if (k === '=') {
    try {
      calcV = eval(calcV).toString();
      display.value = calcV;
    } catch {
      display.value = "Error";
      calcV = "";
    }
  } else {
    calcV += k;
    display.value = calcV;
  }
};

function initCalc() {
  const grid = document.getElementById('calc-grid');
  grid.innerHTML = '';
  const buttons = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
  buttons.forEach(char => {
    let btnStyle = "font-size:22px; border:none; border-radius:6px; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1);";
    if (char === '=' || char === '/' || char === '*' || char === '-' || char === '+') {
      btnStyle += "background:#e0e0e0;";
    } else if (char === '=') {
      btnStyle += "background:var(--win-blue); color:white;";
    } else {
      btnStyle += "background:#ffffff;";
    }
    grid.innerHTML += `<button style="${btnStyle}" onclick="calcIn('${char}')">${char}</button>`;
  });
}

// Clock & Time Loop
function updateTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString(curLang === 'zh' ? 'zh-HK' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const dateStr = now.toLocaleDateString(curLang === 'zh' ? 'zh-HK' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  document.getElementById('tb-time').innerText = timeStr;
  document.getElementById('tb-date').innerText = dateStr;
  document.getElementById('lock-huge-time').innerText = timeStr;
  document.getElementById('lock-huge-date').innerText = dateStr;
}

// System Init Trigger
window.addEventListener('DOMContentLoaded', initOS);
