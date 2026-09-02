/* ==========================================
   1. System Configuration & I18N
   ========================================== */
const dict = {
  en: {
    login_err: "Incorrect password.", cancel: "Cancel", settings: "Settings", 
    tab_theme: "🎨 Themes", tab_acc: "👤 Accounts", tab_lang: "🌐 Language", tab_about: "ℹ️ About",
    theme_title: "Appearance", theme_select: "OS Engine (Live)", bg_url: "Background URL", apply: "Apply", default: "Default",
    acc_title: "Security & Account", acc_name: "Username", acc_pw: "Password (Blank to disable)", acc_avatar: "Avatar URL", save: "Save", reset: "Factory Reset",
    about_title: "System Info", store: "App Store (Free)", store_desc: "Open Source Apps (No IAP)",
    file_explorer: "File Explorer (VFS)", fs_new: "New Text File", fs_upload: "Upload File", fs_clear: "Format Disk",
    weather: "Weather Station", search: "Search", paint: "Paint", calc: "Calculator", notepad: "Notepad",
    refresh: "Refresh", cm_theme: "Personalization", login_pw_ph: "Enter password", user_guide: "User Guide"
  },
  zh: {
    login_err: "密碼錯誤。", cancel: "取消", settings: "系統設定 (Settings)", 
    tab_theme: "🎨 外觀與主題", tab_acc: "👤 安全性與帳戶", tab_lang: "🌐 語言與地區", tab_about: "ℹ️ 系統資訊",
    theme_title: "外觀與個人化", theme_select: "介面風格引擎 (即時切換)", bg_url: "自訂桌面背景 (URL)", apply: "套用背景", default: "還原預設",
    acc_title: "安全性與帳戶", acc_name: "顯示名稱", acc_pw: "登入密碼 (留白以關閉保護)", acc_avatar: "頭像 URL", save: "更新帳戶資料", reset: "還原原廠設定 (危險)",
    about_title: "關於 WebOS", store: "App Store (免費 / 無 IAP)", store_desc: "開源應用程式社群 (All Apps Free)",
    file_explorer: "檔案總管 (虛擬檔案系統)", fs_new: "新增文字檔", fs_upload: "上傳實體檔案", fs_clear: "格式化磁碟",
    weather: "氣象中心", search: "搜尋", paint: "小畫家", calc: "計算機", notepad: "記事本 (Auto-Save)",
    refresh: "重新整理", cm_theme: "佈景主題", login_pw_ph: "請輸入密碼", user_guide: "使用手冊 (User Guide)"
  }
};

let curLang = localStorage.getItem('os_lang') || 'zh';
let sysUser = localStorage.getItem('os_user') || 'Admin';
let sysPw = localStorage.getItem('os_pw') || '';
let sysBg = localStorage.getItem('os_bg') || 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=2500';
let sysTheme = localStorage.getItem('os_theme') || 'theme-win10';
let sysAvatar = localStorage.getItem('os_avatar') || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

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

let installedApps = JSON.parse(localStorage.getItem('os_apps')) || ['app-guide', 'app-browser', 'app-python', 'app-cmd', 'app-paint'];

/* ==========================================
   2. Initialization & Boot Logic
   ========================================== */
function initOS() {
  document.body.className = sysTheme;
  document.getElementById('theme-select').value = sysTheme;
  document.getElementById('desktop').style.backgroundImage = `url('${sysBg}')`;
  document.getElementById('lock-screen').style.backgroundImage = `url('${sysBg}')`;
  document.getElementById('login-user-name').innerText = sysUser;
  document.getElementById('login-avatar').src = sysAvatar;
  
  document.getElementById('set-username').value = sysUser;
  document.getElementById('set-bg-url').value = sysBg;
  document.getElementById('set-avatar').value = sysAvatar;
  document.getElementById('np-text').value = localStorage.getItem('os_np') || '';
  
  updateStartIcon();
  setLang(curLang); 
  
  // BIOS POST Sequence
  document.getElementById('bios-screen').style.display = 'flex';
  const biosText = document.getElementById('bios-text');
  const biosLines = [
    "Project Horizon BIOS v7.0.0",
    "Checking Central Processor Core... OK",
    "Checking System Memory: 16384MB OK",
    "Mounting Virtual File System (VFS)... OK",
    "Restricting In-App Purchases (IAP)... OK",
    "Loading Paint Engine & Brython Python... OK",
    "Starting Graphical User Interface..."
  ];
  let lineIdx = 0;
  function printBIOS() {
    if(lineIdx < biosLines.length) {
      biosText.innerHTML += `<div class="bios-line">${biosLines[lineIdx]}</div>`;
      lineIdx++;
      setTimeout(printBIOS, 150 + Math.random() * 200);
    } else {
      setTimeout(() => {
        document.getElementById('bios-screen').style.display = 'none';
        document.getElementById('boot-screen').style.display = 'flex';
        setTimeout(() => {
          document.getElementById('boot-screen').style.display = 'none';
          document.getElementById('lock-screen').style.display = 'block';
        }, 1200);
      }, 300);
    }
  }
  printBIOS();
  
  renderDesktop(); renderFS(); initPaint(); initCalc(); initGuide();
  setInterval(updateTime, 1000); updateTime();
}

function updateStartIcon() {
  const icon = document.getElementById('start-icon');
  if(sysTheme === 'theme-win10') icon.src = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Windows_logo_-_2021.svg';
  else if(sysTheme === 'theme-macos') icon.src = 'https://cdn-icons-png.flaticon.com/512/732/732221.png';
  else if(sysTheme === 'theme-ubuntu') icon.src = 'https://cdn-icons-png.flaticon.com/512/825/825501.png';
}

function setLang(lang) {
  curLang = lang; localStorage.setItem('os_lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n'); if(dict[lang][k]) el.innerText = dict[lang][k];
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const k = el.getAttribute('data-i18n-ph'); if(dict[lang][k.replace('_ph','')]) el.placeholder = dict[lang][k.replace('_ph','')];
  });
  renderStore(); renderDesktop();
}

// Lock & Login
document.getElementById('lock-time-view').onclick = () => {
  document.getElementById('lock-time-view').style.transform = 'translateY(-100%)';
  document.getElementById('login-view').style.transform = 'translateY(0)';
  setTimeout(() => document.getElementById('login-pw').focus(), 500);
};

document.getElementById('login-cancel').onclick = () => {
  document.getElementById('lock-time-view').style.transform = 'translateY(0)';
  document.getElementById('login-view').style.transform = 'translateY(100%)';
  document.getElementById('login-err').style.display = 'none';
};

document.getElementById('login-btn').onclick = attemptLogin;
function attemptLogin() {
  const input = document.getElementById('login-pw').value;
  if(sysPw === '' || input === sysPw) {
    document.getElementById('lock-screen').style.display = 'none';
    document.getElementById('desktop').style.display = 'block';
  } else { document.getElementById('login-err').style.display = 'block'; }
}

// Power Management
document.getElementById('pwr-logout').onclick = () => { document.getElementById('desktop').style.display = 'none'; document.getElementById('login-cancel').click(); document.getElementById('lock-screen').style.display = 'block'; document.getElementById('login-pw').value = ''; };
document.getElementById('pwr-reboot').onclick = () => { document.getElementById('desktop').style.display = 'none'; document.getElementById('black-screen').style.display = 'block'; setTimeout(()=>location.reload(), 1000); };
document.getElementById('pwr-shutdown').onclick = () => { document.getElementById('desktop').style.display = 'none'; document.getElementById('black-screen').style.display = 'block'; };

/* ==========================================
   3. Window Manager & UI Handlers
   ========================================== */
let zIndex = 100;
let isDrag=false, curWin=null, oX, oY;

function openApp(id) {
  const win = document.getElementById(id);
  win.style.display = 'flex';
  document.getElementById('start-menu').style.display = 'none';
  document.getElementById('tb-' + id).style.display = 'flex';
  bringToFront(id);
  document.querySelectorAll('.taskbar-icon').forEach(i => i.classList.remove('active'));
  document.getElementById('tb-' + id).classList.add('active');
  if(id === 'app-cmd') document.getElementById('term-input').focus();
}

function closeApp(id) { document.getElementById(id).style.display = 'none'; document.getElementById('tb-' + id).style.display = 'none'; }
function toggleApp(id) { const w = document.getElementById(id); if(w.style.display === 'flex' && w.style.zIndex == zIndex) { minApp(id); } else { openApp(id); } }
function minApp(id) { document.getElementById(id).style.display = 'none'; document.getElementById('tb-' + id).classList.remove('active'); }
function maxApp(id) {
  const w = document.getElementById(id);
  if(w.dataset.max === '1') { w.style.width=w.dataset.w; w.style.height=w.dataset.h; w.style.top=w.dataset.t; w.style.left=w.dataset.l; w.dataset.max='0'; }
  else { 
    w.dataset.w=w.style.width; w.dataset.h=w.style.height; w.dataset.t=w.style.top; w.dataset.l=w.style.left; 
    w.style.width='100%'; w.style.height='calc(100% - var(--taskbar-height))'; 
    w.style.top = document.body.classList.contains('theme-ubuntu') ? 'var(--taskbar-height)' : '0';
    w.style.left='0'; w.dataset.max='1'; 
  }
}
function bringToFront(id) { zIndex++; document.getElementById(id).style.zIndex = zIndex; }

// Bind Window Controls
document.querySelectorAll('.title-bar').forEach(bar => {
  const id = bar.getAttribute('data-win');
  bar.onmousedown = (e) => {
    if(e.target.classList.contains('ctrl-btn')) return;
    isDrag=true; curWin=document.getElementById(id); bringToFront(id);
    const r=curWin.getBoundingClientRect(); oX=e.clientX-r.left; oY=e.clientY-r.top;
  };
  bar.querySelector('.close').onclick = () => closeApp(id);
  if(bar.querySelector('.max')) bar.querySelector('.max').onclick = () => maxApp(id);
  if(bar.querySelector('.min')) bar.querySelector('.min').onclick = () => minApp(id);
});

document.addEventListener('mousemove', (e) => { if(isDrag && curWin && curWin.dataset.max!=='1') { curWin.style.left=(e.clientX-oX)+'px'; curWin.style.top=(e.clientY-oY)+'px'; } });
document.addEventListener('mouseup', () => { isDrag=false; curWin=null; });

// Start Menu & Global Click Listening
document.getElementById('start-btn').onclick = (e) => { e.stopPropagation(); const m = document.getElementById('start-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; document.getElementById('power-menu').style.display = 'none'; };
document.getElementById('start-pwr').onclick = (e) => { e.stopPropagation(); const m=document.getElementById('power-menu'); m.style.display = m.style.display === 'flex' ? 'none' : 'flex'; };
document.getElementById('start-set').onclick = () => openApp('app-settings');
document.getElementById('start-acc').onclick = () => { openApp('app-settings'); document.querySelector('[data-tab="set-account"]').click(); };

document.addEventListener('click', (e) => {
  if(!e.target.closest('#start-menu') && !e.target.closest('#start-btn')) {
    document.getElementById('start-menu').style.display = 'none';
    document.getElementById('power-menu').style.display = 'none';
  }
  if(!e.target.closest('#context-menu')) document.getElementById('context-menu').style.display = 'none';
});

// Desktop Context Menu
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if(e.target.closest('.window') || e.target.closest('#taskbar') || e.target.closest('#start-menu')) return;
  const m = document.getElementById('context-menu');
  m.style.display = 'block'; m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px';
});
document.getElementById('cm-refresh').onclick = () => location.reload();
document.getElementById('cm-theme').onclick = () => { openApp('app-settings'); document.querySelector('[data-tab="set-theme"]').click(); };
document.getElementById('cm-fs').onclick = () => openApp('app-explorer');

/* ==========================================
   4. Render Desktop & App Store
   ========================================== */
function getAppName(app) { return (app.name) ? app.name : (curLang === 'zh' ? app.nameZh : app.nameEn); }
function getAllApps() { return [...coreApps, ...storeRegistry.filter(a => installedApps.includes(a.id))]; }

function renderDesktop() {
  const desk = document.getElementById('desktop-icons');
  const startList = document.getElementById('start-app-list');
  const startTiles = document.getElementById('start-tiles');
  const tb = document.getElementById('taskbar-apps');
  desk.innerHTML = ''; startList.innerHTML = ''; startTiles.innerHTML = ''; tb.innerHTML = '';

  getAllApps().forEach(app => {
    let name = getAppName(app);
    desk.innerHTML += `<div class="icon" ondblclick="openApp('${app.id}')"><img src="${app.icon}"><span>${name}</span></div>`;
    startList.innerHTML += `<div class="start-app-item" onclick="openApp('${app.id}')"><img src="${app.icon}"><span>${name}</span></div>`;
    startTiles.innerHTML += `<div class="tile" onclick="openApp('${app.id}')"><img src="${app.icon}"><span>${name}</span></div>`;
    tb.innerHTML += `<div class="taskbar-icon" id="tb-${app.id}" onclick="toggleApp('${app.id}')" title="${name}" style="display:none;"><img src="${app.icon}"></div>`;
  });
}

function renderStore() {
  const grid = document.getElementById('store-grid'); grid.innerHTML = '';
  storeRegistry.forEach(app => {
    const isInst = installedApps.includes(app.id);
    const btn = isInst ? `<button class="store-btn installed" onclick="uninstallApp('${app.id}')">Uninstall</button>` 
                       : `<button class="store-btn" onclick="installApp('${app.id}')">Install (Free)</button>`;
    grid.innerHTML += `<div class="store-card"><img src="${app.icon}"><div style="flex:1;"><div style="font-weight:bold; font-size:16px;">${getAppName(app)}</div></div>${btn}</div>`;
  });
}
function installApp(id) { installedApps.push(id); localStorage.setItem('os_apps', JSON.stringify(installedApps)); renderDesktop(); renderStore(); }
function uninstallApp(id) { installedApps = installedApps.filter(a=>a!==id); localStorage.setItem('os_apps', JSON.stringify(installedApps)); closeApp(id); renderDesktop(); renderStore(); }

/* ==========================================
   5. Virtual File System (VFS)
   ========================================== */
let vfs = JSON.parse(localStorage.getItem('os_vfs')) || { 
  'README.txt': 'WebOS Virtual File System.\nAll files and scripts are persistent in your browser LocalStorage.' 
};
function saveVFS() { localStorage.setItem('os_vfs', JSON.stringify(vfs)); }

function renderFS() {
  const grid = document.getElementById('fs-grid'); grid.innerHTML = '';
  for(let filename in vfs) {
    let icon = filename.endsWith('.txt') ? 'https://cdn-icons-png.flaticon.com/512/3224/3224410.png' : 'https://cdn-icons-png.flaticon.com/512/3767/3767084.png';
    grid.innerHTML += `<div class="fs-item" onclick="openFile('${filename}')" oncontextmenu="delFile('${filename}'); return false;" title="Right-click to delete"><img src="${icon}"><div class="fs-item-name">${filename}</div></div>`;
  }
}
document.getElementById('fs-btn-new').onclick = () => { let name = prompt("File name:", "NewFile.txt"); if(name && !vfs[name]) { vfs[name] = ""; saveVFS(); renderFS(); } };
document.getElementById('fs-upload').onchange = (e) => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => { vfs[file.name] = evt.target.result; saveVFS(); renderFS(); };
  reader.readAsDataURL(file);
};
document.getElementById('fs-btn-clear').onclick = () => { if(confirm("Format VFS? All files will be lost.")) { vfs = {}; saveVFS(); renderFS(); } };
window.openFile = (name) => {
  if(name.endsWith('.txt')) { openApp('app-notepad'); document.getElementById('np-text').value = vfs[name]; }
  else { alert("Preview not supported. Data size: " + vfs[name].length + " bytes."); }
};
window.delFile = (name) => { if(confirm(`Delete ${name}?`)) { delete vfs[name]; saveVFS(); renderFS(); } };

/* ==========================================
   6. Paint App (100% Real Functionality)
   ========================================== */
let paintCanvas, ctx, painting = false;
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
    const scaleX = paintCanvas.width / rect.width;
    const scaleY = paintCanvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  paintCanvas.onmousedown = (e) => {
    painting = true;
    const pos = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    draw(e);
  };

  paintCanvas.onmouseup = () => {
    painting = false;
    ctx.beginPath();
  };

  paintCanvas.onmouseleave = () => {
    painting = false;
    ctx.beginPath();
  };

  paintCanvas.onmousemove = draw;

  function draw(e) {
    if (!painting) return;
    const pos = getCanvasCoords(e);
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? '#ffffff' : paintColor;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  // Paint Toolbar Handlers
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
    document.getElementById('p-brush-val').innerText = brushSize + 'px';
  };

  const colorInput = document.getElementById('p-color-picker');
  colorInput.onchange = () => {
    paintColor = colorInput.value;
    isEraser = false;
    document.getElementById('p-tool-pen').classList.add('active');
    document.getElementById('p-tool-eraser').classList.remove('active');
  };

  document.getElementById('p-clear').onclick = () => {
    if(confirm("確定要清除整張畫布？")) {
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

/* ==========================================
   7. Real Command Prompt (CMD) Implementation
   ========================================== */
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
    document.getElementById('term-container').scrollTop = document.getElementById('term-container').scrollHeight;
  }
};

function executeCommand(cmdStr, rawLine) {
  cmdOutput.innerHTML += `<div>${currentPath}&gt; ${rawLine}</div>`;
  if (!cmdStr) return;

  // 支援輸出重定向: echo text > filename
  if (cmdStr.includes('>')) {
    const parts = cmdStr.split('>');
    const left = parts[0].trim();
    const right = parts[1].trim();
    if (left.toLowerCase().startsWith('echo ') && right) {
      const content = left.substring(5);
      vfs[right] = content;
      saveVFS(); renderFS();
      return;
    }
  }

  const tokens = cmdStr.split(' ');
  const cmd = tokens[0].toLowerCase();
  const args = tokens.slice(1);

  switch (cmd) {
    case 'help':
      cmdOutput.innerHTML += `
<div style="color:#aaa;">
有關特定命令的詳細資訊，請參閱使用者手冊。<br>
CD             顯示當前目錄的名稱或變更當前目錄。<br>
CLS            清除螢幕。<br>
COLOR          設定終端機色彩。<br>
DATE           顯示當前系統日期。<br>
DEL            刪除虛擬檔案系統中之檔案。<br>
DIR            顯示目錄中的檔案與子目錄清單。<br>
ECHO           顯示訊息，或將輸出重新定向到檔案。<br>
EXIT           退出 CMD 命令列。<br>
HELP           提供 Windows 命令的說明資訊。<br>
MD / MKDIR     建立目錄。<br>
TIME           顯示當前系統時間。<br>
TYPE           顯示文字檔案的內容。<br>
VER            顯示 Windows 作業系統版本。<br>
</div>`;
      break;

    case 'dir':
    case 'ls':
      const files = Object.keys(vfs);
      const now = new Date();
      const dateStr = now.toLocaleDateString('zh-HK');
      let dirHTML = `
<div>磁碟區 C 中的磁碟是 WebOS_System</div>
<div>磁碟區序號是 4A21-7B89</div>
<br>
<div> ${currentPath} 的目錄</div>
<br>`;
      dirHTML += `<div>${dateStr}  &lt;DIR&gt;          .</div>`;
      dirHTML += `<div>${dateStr}  &lt;DIR&gt;          ..</div>`;
      let totalBytes = 0;
      files.forEach(f => {
        const len = vfs[f].length;
        totalBytes += len;
        dirHTML += `<div>${dateStr}               ${len.toString().padStart(6, ' ')} ${f}</div>`;
      });
      dirHTML += `<br><div>               ${files.length} 個檔案       ${totalBytes} 位元組</div><br>`;
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
      cmdOutput.innerHTML += `<div>Microsoft Windows [版本 10.0.19045.3086]</div>`;
      break;

    case 'date':
      cmdOutput.innerHTML += `<div>當前系統日期: ${new Date().toLocaleDateString('zh-HK')}</div>`;
      break;

    case 'time':
      cmdOutput.innerHTML += `<div>當前系統時間: ${new Date().toLocaleTimeString('zh-HK')}</div>`;
      break;

    case 'echo':
      cmdOutput.innerHTML += `<div>${args.join(' ')}</div>`;
      break;

    case 'type':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>命令語法不正確。請指定檔案名稱。</div>`;
      } else if (vfs[args[0]] !== undefined) {
        cmdOutput.innerHTML += `<div>${vfs[args[0]]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>系統找不到指定的檔案。</div>`;
      }
      break;

    case 'del':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>命令語法不正確。請指定要刪除的檔案名稱。</div>`;
      } else if (vfs[args[0]] !== undefined) {
        delete vfs[args[0]];
        saveVFS(); renderFS();
        cmdOutput.innerHTML += `<div>已刪除檔案: ${args[0]}</div>`;
      } else {
        cmdOutput.innerHTML += `<div>找不到 ${args[0]}。</div>`;
      }
      break;

    case 'md':
    case 'mkdir':
      if (!args[0]) {
        cmdOutput.innerHTML += `<div>命令語法不正確。</div>`;
      } else {
        vfs[`[DIR]_${args[0]}`] = "";
        saveVFS(); renderFS();
        cmdOutput.innerHTML += `<div>已建立子目錄: ${args[0]}</div>`;
      }
      break;

    case 'color':
      if (args[0]) {
        const code = args[0].toLowerCase();
        const term = document.getElementById('term-container');
        if (code === '0a') term.style.color = '#00ff00';
        else if (code === '0c') term.style.color = '#ff4444';
        else if (code === '0f') term.style.color = '#ffffff';
        else if (code === '0e') term.style.color = '#ffff00';
        else term.style.color = '#cccccc';
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

/* ==========================================
   8. User Guide Handlers
   ========================================== */
function initGuide() {
  document.querySelectorAll('.guide-nav-item').forEach(item => {
    item.onclick = () => {
      document.querySelectorAll('.guide-nav-item').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.guide-section').forEach(el => el.style.display = 'none');
      item.classList.add('active');
      const tabId = item.getAttribute('data-tab');
      document.getElementById(tabId).style.display = 'block';
    };
  });
}

/* ==========================================
   9. Settings & Adaptive Theming
   ========================================== */
document.querySelectorAll('.set-nav-item').forEach(item => {
  item.onclick = (e) => {
    document.querySelectorAll('.set-nav-item').forEach(el=>el.classList.remove('active'));
    document.querySelectorAll('.settings-main > div').forEach(el=>el.style.display='none');
    item.classList.add('active');
    document.getElementById(item.getAttribute('data-tab')).style.display='block';
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
  localStorage.setItem('os_user', document.getElementById('set-username').value); 
  localStorage.setItem('os_pw', document.getElementById('set-password').value); 
  localStorage.setItem('os_avatar', document.getElementById('set-avatar').value); 
  alert("帳戶資料已儲存！下次登入生效。"); 
};
document.getElementById('btn-reset').onclick = () => { if(confirm("確定要重設？所有設定與虛擬磁碟將被抹除。")) { localStorage.clear(); location.reload(); } };
document.getElementById('btn-lang-zh').onclick = () => setLang('zh');
document.getElementById('btn-lang-en').onclick = () => setLang('en');

/* ==========================================
   10. Browser, Weather, Calc, Notepad
   ========================================== */
// Browser
let mdmMode = false;
document.getElementById('mdm-toggle-btn').onclick = () => {
  mdmMode = !mdmMode; const btn = document.getElementById('mdm-toggle-btn');
  if(mdmMode) { btn.classList.add('active'); btn.innerText = "MDM Proxy: ON"; } 
  else { btn.classList.remove('active'); btn.innerText = "MDM Proxy: OFF"; }
};
window.navBrowser = () => {
  let url = document.getElementById('url-input').value;
  if(!url.startsWith('http')) url = 'https://' + url;
  if(mdmMode) { 
    url = `https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=${encodeURIComponent(url)}`; 
  } else if(url.includes('google.com')) { 
    url = 'https://www.google.com/webhp?igu=1'; 
  } 
  document.getElementById('browser-frame').src = url;
};
document.getElementById('b-reload').onclick = navBrowser;
document.getElementById('b-back').onclick = () => document.getElementById('browser-frame').contentWindow.history.back();

// Weather
async function fetchWeather(lat, lon, cityName) {
  document.getElementById('w-city').innerText = cityName; 
  document.getElementById('w-temp').innerText = "...";
  try {
    const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const data = await res.json();
    document.getElementById('w-temp').innerText = data.current_weather.temperature + '°C';
    document.getElementById('w-desc').innerText = 'Satellite Link OK';
  } catch(e) { document.getElementById('w-desc').innerText = "連線失敗"; }
}
document.getElementById('w-search').onclick = () => {
  const val = document.getElementById('weather-city').value.split(',');
  const name = document.getElementById('weather-city').options[document.getElementById('weather-city').selectedIndex].text;
  fetchWeather(val[0], val[1], name);
};
document.getElementById('w-gps').onclick = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude, "📍 當前 GPS 定位"),
      () => alert("無法取得定位權限。")
    );
  }
};

// Calc
let calcV = "";
window.calcIn = (k) => {
  const d = document.getElementById('calc-display');
  if(k === 'C') { calcV = ""; d.value = "0"; }
  else if(k === '=') { try{ calcV = eval(calcV).toString(); d.value = calcV; }catch{ d.value="Error"; calcV=""; } }
  else { calcV += k; d.value = calcV; }
};
function initCalc() {
  const grid = document.getElementById('calc-grid'); grid.innerHTML = '';
  const btns = ['7','8','9','/','4','5','6','*','1','2','3','-','C','0','=','+'];
  btns.forEach(b => {
    let style = "font-size:22px; border:none; border-radius:6px; cursor:pointer; box-shadow:0 1px 3px rgba(0,0,0,0.1);";
    if(b==='='||b==='/'||b==='*'||b==='-'||b==='+') style += "background:#e0e0e0; font-weight:bold;";
    else if(b==='=') style += "background:var(--win-blue); color:white;";
    else style += "background:#fff;";
    grid.innerHTML += `<button style="${style}" onclick="calcIn('${b}')">${b}</button>`;
  });
}

// Clock
function updateTime() {
  const now = new Date();
  const tStr = now.toLocaleTimeString(curLang==='zh'?'zh-HK':'en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  const dStr = now.toLocaleDateString(curLang==='zh'?'zh-HK':'en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  document.getElementById('tb-time').innerText = tStr; document.getElementById('tb-date').innerText = dStr;
  document.getElementById('lock-huge-time').innerText = tStr; document.getElementById('lock-huge-date').innerText = dStr;
}

// Bootstrap
window.addEventListener('DOMContentLoaded', initOS);
