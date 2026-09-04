/* ==========================================================================
   WebOS Project Horizon - Complete Guaranteed Kernel & Touch Engine
   ========================================================================== */

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
  { id: 'app-notepad', nameEn: 'Notepad', nameZh: '記事本', icon: 'https://cdn-icons-png.flaticon.com/512/3224/3224410.png' },
  { id: 'app-clock', nameEn: 'Stopwatch', nameZh: '碼錶計時', icon: 'https://cdn-icons-png.flaticon.com/512/2972/2972531.png' },
  { id: 'app-synth', nameEn: 'Audio Synth', nameZh: '音效播放', icon: 'https://cdn-icons-png.flaticon.com/512/3075/3075908.png' }
];

let installedApps = JSON.parse(localStorage.getItem('os_apps')) || [
  'app-guide',
  'app-browser',
  'app-python',
  'app-cmd',
  'app-paint',
  'app-clock',
  'app-synth'
];

/* ==========================================================================
   2. CLOUD USER DATA SYNCHRONIZATION
   ========================================================================== */

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

/* ==========================================================================
   3. GUARANTEED KERNEL & SYSTEM BOOTSTRAP PIPELINE
   ========================================================================== */

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
  "[    0.389102] systemd[1]: Started WebOS D-Bus System Message Bus.",
  "[    0.410291] [  OK  ] Started Graphical Window Manager Compositor.",
  "[    0.435190] [  OK  ] Mounted Windows 10 Virtual File System Hierarchy.",
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

  setTimeout(() => {
    injectResizers();
  }, 300);

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

  // --- Stage 1: BIOS 自檢階段 ---
  const biosScreen = document.getElementById('bios-screen');
  const biosText = document.getElementById('bios-text');
  biosScreen.style.display = 'flex';

  const biosLines = [
    "Project Horizon BIOS v13.0.0",
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
      setTimeout(printBIOS, 70 + Math.random() * 60);
    } else {
      setTimeout(startKernelBoot, 200);
    }
  }

  // --- Stage 2: Linux-like Kernel Boot 核心滾動文字階段 (確保平滑滾動) ---
  function startKernelBoot() {
    biosScreen.style.display = 'none';
    const kernelScreen = document.getElementById('kernel-screen');
    const kernelText = document.getElementById('kernel-text');
    
    // 強制設定為可視狀態
    kernelScreen.style.display = 'block';
    kernelText.innerHTML = '';

    let kIdx = 0;
    function printKernel() {
      if (kIdx < kernelLines.length) {
        const line = document.createElement('div');
        line.className = 'kernel-log-line';
        line.innerText = kernelLines[kIdx];
        kernelText.appendChild(line);

        // 強制捲動到底部
        kernelScreen.scrollTop = kernelScreen.scrollHeight;
        kIdx++;
        setTimeout(printKernel, 40 + Math.random() * 35);
      } else {
        setTimeout(startGUIBoot, 500);
      }
    }
    printKernel();
  }

  // --- Stage 3: GUI 開機載入 (紅色 Windows Logo) ---
  function startGUIBoot() {
    const kernelScreen = document.getElementById('kernel-screen');
    kernelScreen.style.display = 'none';
    
    const bootScreen = document.getElementById('boot-screen');
    bootScreen.style.display = 'flex';

    setTimeout(() => {
      bootScreen.style.display = 'none';
      document.getElementById('lock-screen').style.display = 'block';
    }, 1500);
  }

  printBIOS();
  
  renderDesktop();
  renderFS();
  initPaint();
  initCalc();
  initGuide();
  initStopwatch();
  setInterval(updateTime, 1000);
  updateTime();
}

function updateStartIcon() {
  const icon = document.getElementById('start-icon');
  if (sysTheme === 'theme-win10') {
    icon.src = 'https://icones.pro/wp-content/uploads/2021/06/icone-windows-rouge.png';
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
   4. WINDOW MANAGER (TOUCH & RESIZE ENGINE)
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
   5. DESKTOP & REAL FOLDER-BASED VFS ENGINE
   ========================================================================== */

function getAppName(app) {
  return app.name ? app.name : (curLang === 'zh' ? app.nameZh : app.nameEn);
}

function getAllApps() {
  const custom = storeRegistry.filter(app => installedApps.includes(app.id));
  return [...coreApps, ...custom];
}

function renderDesktop() {
  const desktopBox = document.getElementById('desktop-icons');
  const startList = document.getElementById('start-app-list');
  const startTiles = document.getElementById('start-tiles');
  const taskbarApps = document.getElementById('taskbar-apps');

  desktopBox.innerHTML = '';
  startList.innerHTML = '';
  startTiles.innerHTML = '';
  taskbarApps.innerHTML = '';

  getAllApps().forEach(app => {
    const displayName = getAppName(app);

    const iconItem = document.createElement('div');
    iconItem.className = 'icon';

    iconItem.addEventListener('click', () => {
      openApp(app.id);
    });

    iconItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    desktopBox.appendChild(iconItem);

    const listItem = document.createElement('div');
    listItem.className = 'start-app-item';
    listItem.onclick = () => openApp(app.id);
    listItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    startList.appendChild(listItem);

    const tileItem = document.createElement('div');
    tileItem.className = 'tile';
    tileItem.onclick = () => openApp(app.id);
    tileItem.innerHTML = `<img src="${app.icon}"><span>${displayName}</span>`;
    startTiles.appendChild(tileItem);

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

/* ==========================================================================
   6. WINDOWS 10 STYLE FILE EXPLORER (帶 Ribbon 及導航窗格)
   ========================================================================== */

const INITIAL_VFS = {
  "README.txt": "歡迎來到 WebOS Project Horizon 虛擬檔案系統！\n所有建立的檔案皆即時保存在 LocalStorage 中。",
  "System": {
    "system.js": "// WebOS Core Logic Source Code Mounted\nconsole.log('Kernel Running');",
    "style.css": "/* WebOS Dynamic Adaptive Theme Stylesheet */",
    "copyright.txt": `MIT License

Copyright (c) 2026 iAnyFeature

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
  },
  "Apps": {
    "Games": {
      "info.txt": "HTML5 Canvas and SpriteKit projects are located here."
    }
  },
  "Users": {
    "Admin": {
      "Documents": {
        "Notes.txt": "會議記錄：系統已全面支援全觸控與資料夾導航。"
      }
    }
  }
};

let vfs = JSON.parse(localStorage.getItem('os_vfs_v2')) || INITIAL_VFS;
let currentVFSPath = ["C:"];

function saveVFS() {
  localStorage.setItem('os_vfs_v2', JSON.stringify(vfs));
}

function getNodeByPath(pathArray) {
  let curr = vfs;
  for (let i = 1; i < pathArray.length; i++) {
    if (curr[pathArray[i]] && typeof curr[pathArray[i]] === 'object') {
      curr = curr[pathArray[i]];
    } else {
      return null;
    }
  }
  return curr;
}

function navigateVFS(targetPathArray) {
  currentVFSPath = [...targetPathArray];
  renderFS();
}

function renderFS() {
  const fsGrid = document.getElementById('fs-grid');
  const pathLabel = document.getElementById('fs-current-path');
  const statusCount = document.getElementById('fs-status-count');
  
  fsGrid.innerHTML = '';
  pathLabel.innerText = currentVFSPath.join('\\') + "\\";

  document.querySelectorAll('.win10-sidebar .side-item').forEach(item => {
    item.classList.remove('active');
  });

  const currentDir = getNodeByPath(currentVFSPath);
  if (!currentDir) return;

  let count = 0;
  for (let name in currentDir) {
    count++;
    const isFolder = typeof currentDir[name] === 'object';
    const iconSrc = isFolder 
      ? 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png'
      : (name.endsWith('.txt') 
          ? 'https://cdn-icons-png.flaticon.com/512/3224/3224410.png'
          : 'https://cdn-icons-png.flaticon.com/512/2965/2965335.png');

    const item = document.createElement('div');
    item.className = 'fs-item';

    if (isFolder) {
      item.onclick = () => {
        currentVFSPath.push(name);
        renderFS();
      };
    } else {
      item.onclick = () => {
        openApp('app-notepad');
        document.getElementById('np-text').value = currentDir[name];
      };
    }

    item.oncontextmenu = (e) => {
      e.preventDefault();
      if (confirm(`確定刪除 ${name}？`)) {
        delete currentDir[name];
        saveVFS();
        renderFS();
      }
    };

    item.innerHTML = `<img src="${iconSrc}"><div class="fs-item-name">${name}</div>`;
    fsGrid.appendChild(item);
  }

  statusCount.innerText = `${count} 個項目`;
}

document.getElementById('fs-btn-back').onclick = () => {
  if (currentVFSPath.length > 1) {
    currentVFSPath.pop();
    renderFS();
  }
};

document.getElementById('fs-btn-up-dir').onclick = () => {
  if (currentVFSPath.length > 1) {
    currentVFSPath.pop();
    renderFS();
  }
};

document.getElementById('fs-btn-new').onclick = () => {
  const name = prompt("文字檔案名稱:", "NewFile.txt");
  if (name) {
    const dir = getNodeByPath(currentVFSPath);
    if (dir && dir[name] === undefined) {
      dir[name] = "";
      saveVFS();
      renderFS();
    }
  }
};

document.getElementById('fs-btn-new-dir').onclick = () => {
  const name = prompt("資料夾名稱:", "NewFolder");
  if (name) {
    const dir = getNodeByPath(currentVFSPath);
    if (dir && dir[name] === undefined) {
      dir[name] = {};
      saveVFS();
      renderFS();
    }
  }
};

document.getElementById('fs-btn-up').onclick = () => {
  document.getElementById('fs-upload').click();
};

document.getElementById('fs-upload').onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const dir = getNodeByPath(currentVFSPath);
    if (dir) {
      dir[file.name] = evt.target.result;
      saveVFS();
      renderFS();
    }
  };
  reader.readAsText(file);
};

document.getElementById('fs-btn-clear').onclick = () => {
  if (confirm("格式化虛擬磁碟？將還原至初始狀態。")) {
    vfs = INITIAL_VFS;
    currentVFSPath = ["C:"];
    saveVFS();
    renderFS();
  }
};

document.getElementById('fs-search-input').oninput = (e) => {
  const query = e.target.value.toLowerCase().trim();
  document.querySelectorAll('.win10-content-pane .fs-item').forEach(item => {
    const name = item.querySelector('.fs-item-name').innerText.toLowerCase();
    item.style.display = name.includes(query) ? 'block' : 'none';
  });
};

/* ==========================================================================
   7. COMMAND PROMPT (支援資料夾切換與重定向)
   ========================================================================== */

let cmdHistory = [];
let historyIndex = -1;
let cmdPathArray = ["C:"];

const cmdInput = document.getElementById('term-input');
const cmdOutput = document.getElementById('term-output');
const cmdPromptLabel = document.getElementById('term-prompt');

function updatePromptDisplay() {
  cmdPromptLabel.innerText = cmdPathArray.join('\\') + ">";
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
  cmdOutput.innerHTML += `<div>${cmdPathArray.join('\\')}&gt; ${rawLine}</div>`;
  if (!cmdStr) return;

  const currentDir = getNodeByPath(cmdPathArray);

  if (cmdStr.includes('>')) {
    const parts = cmdStr.split('>');
    const leftText = parts[0].trim();
    const targetFileName = parts[1].trim();
    if (leftText.toLowerCase().startsWith('echo ') && targetFileName) {
      if (currentDir) {
        currentDir[targetFileName] = leftText.substring(5);
        saveVFS();
        renderFS();
      }
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
CD [路徑]      變更目錄或顯示當前路徑。<br>
CLS            清除命令列所有文字。<br>
COLOR [代碼]   設定終端機字體顏色 (0a, 0c, 0f, 0e)。<br>
DATE           顯示當前系統日期。<br>
DEL [檔案]     刪除當前目錄中的檔案。<br>
DIR            顯示當前目錄之檔案與子目錄清單。<br>
ECHO [文字]    輸出訊息，或將輸出重定向至指定檔案。<br>
EXIT           關閉終端機視窗。<br>
HELP           列出所有命令支援清單。<br>
MD [名稱]      在當前目錄建立新資料夾。<br>
TIME           顯示當前系統時間。<br>
TYPE [檔案]    印出文字檔案之內容。<br>
VER            顯示 Windows 版本號碼。<br>
</div>`;
      break;

    case 'dir':
    case 'ls':
      if (!currentDir) break;
      const dateStr = new Date().toLocaleDateString('zh-HK');
      let dirHTML = `<div>Volume in drive C is WebOS_System</div><br><div> Directory of ${cmdPathArray.join('\\')}</div><br>`;
      dirHTML += `<div>${dateStr}  &lt;DIR&gt;          .</div><div>${dateStr}  &lt;DIR&gt;          ..</div>`;
      let fileCount = 0;
      let byteCount = 0;

      for (let item in currentDir) {
        if (typeof currentDir[item] === 'object') {
          dirHTML += `<div>${dateStr}  &lt;DIR&gt;          ${item}</div>`;
        } else {
          fileCount++;
          const len = currentDir[item].length;
          byteCount += len;
          dirHTML += `<div>${dateStr}               ${len.toString().padStart(6, ' ')} ${item}</div>`;
        }
      }
      dirHTML += `<br><div>               ${fileCount} File(s)       ${byteCount} bytes</div><br>`;
      cmdOutput.innerHTML += dirHTML;
      break;

    case 'cd':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>${cmdPathArray.join('\\')}</div>`;
      } else if (args[0] === '..' || args[0] === '../') {
        if (cmdPathArray.length > 1) {
          cmdPathArray.pop();
          updatePromptDisplay();
        }
      } else if (args[0] === '\\' || args[0] === '/') {
        cmdPathArray = ["C:"];
        updatePromptDisplay();
      } else {
        if (currentDir && typeof currentDir[args[0]] === 'object') {
          cmdPathArray.push(args[0]);
          updatePromptDisplay();
        } else {
          cmdOutput.innerHTML += `<div>系統找不到指定的路徑。</div>`;
        }
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
        cmdOutput.innerHTML += `<div>命令語法不正確。</div>`;
      } else if (currentDir && typeof currentDir[args[0]] === 'string') {
        cmdOutput.innerHTML += `<div style="white-space:pre-wrap;">${currentDir[args[0]]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>系統找不到指定的檔案。</div>`;
      }
      break;

    case 'del':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>命令語法不正確。</div>`;
      } else if (currentDir && currentDir[args[0]] !== undefined) {
        delete currentDir[args[0]];
        saveVFS();
        renderFS();
        cmdOutput.innerHTML += `<div>已刪除: ${args[0]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>找不到指定檔案。</div>`;
      }
      break;

    case 'md':
    case 'mkdir':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>命令語法不正確。</div>`;
      } else if (currentDir) {
        currentDir[args[0]] = {};
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
      cmdOutput.innerHTML += `<div>'${cmd}' 不是內部或外部命令、可執行的程式或批次檔。</div>`;
      break;
  }
}

/* ==========================================================================
   8. SPECIFIC APPS (SETTINGS, BROWSER, WEATHER, PAINT, STOPWATCH, SYNTH)
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

// Browser
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

// Paint (觸控極致強化)
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

// Stopwatch App
let swTimer = null;
let swStartTime = 0;
let swElapsedTime = 0;
let swRunning = false;

function initStopwatch() {
  const display = document.getElementById('sw-display');
  const startBtn = document.getElementById('sw-start-btn');
  const lapBtn = document.getElementById('sw-lap-btn');
  const resetBtn = document.getElementById('sw-reset-btn');
  const lapsBox = document.getElementById('sw-laps');

  function formatTime(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
  }

  startBtn.onclick = () => {
    if (!swRunning) {
      swRunning = true;
      swStartTime = Date.now() - swElapsedTime;
      swTimer = setInterval(() => {
        swElapsedTime = Date.now() - swStartTime;
        display.innerText = formatTime(swElapsedTime);
      }, 10);
      startBtn.innerText = "暫停 (Pause)";
      startBtn.style.background = "#ff9800";
    } else {
      swRunning = false;
      clearInterval(swTimer);
      startBtn.innerText = "繼續 (Resume)";
      startBtn.style.background = "var(--win-blue)";
    }
  };

  lapBtn.onclick = () => {
    if (swRunning) {
      const p = document.createElement('div');
      p.style.padding = "4px 0";
      p.innerText = `Lap ${lapsBox.children.length + 1}: ${formatTime(swElapsedTime)}`;
      lapsBox.prepend(p);
    }
  };

  resetBtn.onclick = () => {
    swRunning = false;
    clearInterval(swTimer);
    swElapsedTime = 0;
    display.innerText = "00:00.00";
    startBtn.innerText = "開始 (Start)";
    startBtn.style.background = "var(--win-blue)";
    lapsBox.innerHTML = '';
  };
}

// Audio Synth App
let audioCtx = null;
window.playTone = (freq) => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.5);
};

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

// Clock Loop
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

window.addEventListener('DOMContentLoaded', initOS);
