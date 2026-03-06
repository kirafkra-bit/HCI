// nav
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  document.getElementById('nav-' + page)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('mobileNav')?.classList.remove('open');
}

// dark mode
let dark = false;
function toggleTheme() {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  const sun  = 'M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 5a7 7 0 100 14A7 7 0 0012 5z';
  const moon = 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z';
  document.querySelectorAll('.theme-icon-path').forEach(p => p.setAttribute('d', dark ? sun : moon));
  const dt = document.getElementById('darkToggle');
  if (dt) { dt.classList.toggle('on', dark); dt.setAttribute('aria-checked', dark); }
}

// nav mobile
function toggleMobileNav() {
  document.getElementById('mobileNav')?.classList.toggle('open');
}

// sidebar and nav mobile builder
const NAV_ITEMS = [
  { id: 'home',          label: 'Home',          ic: 'ic-home',    sym: 'ico-home'     },
  { id: 'dashboard',     label: 'Dashboard',     ic: 'ic-dash',    sym: 'ico-dashboard'},
  { id: 'tasks',         label: 'Tasks',         ic: 'ic-tasks',   sym: 'ico-tasks'    },
  { id: 'schedule',      label: 'Schedule',      ic: 'ic-sched',   sym: 'ico-schedule' },
  { id: 'notifications', label: 'Notifications', ic: 'ic-notif',   sym: 'ico-notif', badge: 3 },
];
const ACCT_ITEMS = [
  { id: 'profile', label: 'Profile',     ic: 'ic-profile', sym: 'ico-profile' },
  { id: 'help',    label: 'Help Center', ic: 'ic-help',    sym: 'ico-help'    },
];

function navItemHTML(item, isMobile = false) {
  const click = isMobile ? `navigate('${item.id}');toggleMobileNav()` : `navigate('${item.id}')`;
  const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
  return `<div class="nav-item${item.id==='home'?' active':''}" id="${isMobile?'m':''}nav-${item.id}"
    onclick="${click}" role="menuitem" tabindex="0"
    onkeydown="if(event.key==='Enter')${click}">
    <div class="nav-icon-wrap ${item.ic}"><svg width="17" height="17"><use href="#${item.sym}"/></svg></div>
    <span class="nav-item-label">${item.label}</span>${badge}
  </div>`;
}

function buildNav() {
  const sbMain  = document.getElementById('sb-nav-main');
  const sbAcct  = document.getElementById('sb-nav-acct');
  const mobNav  = document.getElementById('mobileNav');
  if (sbMain)  sbMain.innerHTML  = NAV_ITEMS.map(n => navItemHTML(n)).join('');
  if (sbAcct)  sbAcct.innerHTML  = ACCT_ITEMS.map(n => navItemHTML(n)).join('');
  if (mobNav) {
    const all = [...NAV_ITEMS, ...ACCT_ITEMS];
    mobNav.innerHTML = all.map(n => navItemHTML(n, true)).join('')
      + `<button class="mobile-theme-btn" onclick="toggleTheme()">
           <svg width="14" height="14"><use href="#ico-moon"/></svg> Toggle Dark Mode
         </button>`;
  }
}

// task manager
let tasks = [
  { id:1, title:'HCI FINAL EXAM', subject:'HCI01', due:'2025-03-04', priority:'high',   done:true  },
  { id:2, title:'PT1 FINALS',  subject:'PT01', due:'2025-03-04', priority:'high',   done:false },
  { id:3, title:'HCI STUDENT MANAGEMENT SYSTEM FINAL PROJECT',   subject:'HCI01', due:'2025-03-06', priority:'medium', done:false },
  { id:4, title:'MS01 FINALS',      subject:'MS01',   due:'2025-03-08', priority:'medium', done:false },
  { id:5, title:'ICCT HACKATHON PREP',    subject:'N/A', due:'2025-03-10', priority:'low',    done:false },
  { id:6, title:'ICCT SKOLARIS ORIENTATION', subject:'N/A', due:'2025-03-12', priority:'medium', done:false },
];
let taskFilter = 'all', nextId = 7;

const editSVG  = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
const trashSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`;

function fmtDate(d) {
  return d ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' }) : '—';
}

function renderTasks() {
  const q = (document.getElementById('taskSearch')?.value || '').toLowerCase();
  const list = document.getElementById('taskList');
  if (!list) return;
  const rows = tasks
    .filter(t => taskFilter==='pending'?!t.done : taskFilter==='done'?t.done : taskFilter==='high'?t.priority==='high':true)
    .filter(t => t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
  if (!rows.length) { list.innerHTML = '<div style="text-align:center;padding:60px 0;color:var(--muted);font-size:.88rem">No tasks found.</div>'; return; }
  list.innerHTML = rows.map(t => `
    <div class="task-row" id="task-${t.id}">
      <div class="task-check ${t.done?'done':''}" onclick="toggleTask(${t.id})" role="checkbox" aria-checked="${t.done}" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' ')toggleTask(${t.id})">
        ${t.done ? `<svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="2,6 5,9 10,3"/></svg>` : ''}
      </div>
      <div style="min-width:0"><div class="task-row-title" style="${t.done?'text-decoration:line-through;color:var(--muted)':''}">${t.title}</div><div class="task-row-sub">${t.subject}</div></div>
      <div style="font-size:.78rem;color:var(--muted);font-family:var(--font-display)">${t.subject}</div>
      <div style="font-size:.78rem;font-family:var(--font-display);font-weight:600">${fmtDate(t.due)}</div>
      <div style="display:flex;align-items:center;gap:6px">
        <div class="priority-dot p-${t.priority==='high'?'high':t.priority==='medium'?'med':'low'}"></div>
        <span style="font-size:.76rem;color:var(--muted);text-transform:capitalize">${t.priority}</span>
      </div>
      <div class="task-actions">
        <div class="action-btn" onclick="editTask(${t.id})" tabindex="0" title="Edit">${editSVG}</div>
        <div class="action-btn delete" onclick="deleteTask(${t.id})" tabindex="0" title="Delete">${trashSVG}</div>
      </div>
    </div>`).join('');
}

function toggleTask(id) { const t = tasks.find(t => t.id===id); if (t) { t.done=!t.done; renderTasks(); } }
function deleteTask(id) { if (confirm('Delete this task?')) { tasks=tasks.filter(t=>t.id!==id); renderTasks(); toast('Task deleted.'); } }
function editTask(id)   { const t=tasks.find(t=>t.id===id); if(!t) return; const v=prompt('Edit task name:',t.title); if(v?.trim()) { t.title=v.trim(); renderTasks(); toast('Task updated!'); } }
function filterTasks()  { renderTasks(); }
function setFilter(f, el) {
  taskFilter = f;
  document.querySelectorAll('#page-tasks .filter-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  el.classList.add('active'); el.setAttribute('aria-selected','true');
  renderTasks();
}
function toggleTaskForm() {
  const f = document.getElementById('taskForm');
  f.style.display = (f.style.display === 'block') ? 'none' : 'block';
  if (f.style.display === 'block') document.getElementById('taskTitle')?.focus();
}
function addTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const subject = document.getElementById('taskSubject').value;
  const due = document.getElementById('taskDue').value;
  const err = document.getElementById('formError');
  if (!title || !due) { if (err) err.style.display='flex'; setTimeout(()=>{ if(err) err.style.display='none'; }, 4000); return; }
  if (err) err.style.display = 'none';
  tasks.unshift({ id:nextId++, title, subject, due, priority:'medium', done:false });
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskDue').value   = '';
  renderTasks(); toggleTaskForm(); toast('Task added!');
}
function toast(msg) {
  const t = document.getElementById('toast'), m = document.getElementById('toastMsg');
  if (!t || !m) return;
  m.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// notifications
function dismissNotif(el) {
  const item = el.closest('.notif-item');
  Object.assign(item.style, { transition:'all .28s ease', opacity:'0', transform:'translateX(18px)' });
  setTimeout(() => { item.remove(); updateUnread(); checkEmpty(); }, 280);
}
function markAllRead()  { document.querySelectorAll('.notif-unread-dot').forEach(d=>d.remove()); document.querySelectorAll('.notif-item').forEach(i=>i.classList.add('read')); updateUnread(); }
function clearNotifs()  { if(confirm('Clear all notifications?')) { document.getElementById('notifList').innerHTML=''; document.getElementById('emptyNotif').style.display='block'; updateUnread(); } }
function updateUnread() { const c=document.querySelectorAll('.notif-unread-dot').length, b=document.getElementById('unreadCount'); if(b){b.textContent=c?c+' unread':'All read'; b.style.background=c?'var(--accent)':'#2ab464';} }
function checkEmpty()   { const e=document.getElementById('emptyNotif'); if(e) e.style.display=document.querySelectorAll('#notifList .notif-item').length?'none':'block'; }
function setNotifFilter(f, el) {
  document.querySelectorAll('#page-notifications .filter-tab').forEach(t=>{t.classList.remove('active'); t.setAttribute('aria-selected','false');});
  el.classList.add('active'); el.setAttribute('aria-selected','true');
  document.querySelectorAll('.notif-item').forEach(i => i.style.display = (f==='all'||i.dataset.type===f) ? 'flex' : 'none');
}

// faq
function toggleFaq(btn) {
  const item = btn.closest('.faq-item'), open = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(f => { f.classList.remove('open'); f.querySelector('.faq-q')?.setAttribute('aria-expanded','false'); });
  if (!open) { item.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
}

// profile
function saveProfile() { const m=document.getElementById('profileSuccess'); if(m){m.classList.add('show'); setTimeout(()=>m.classList.remove('show'),3500);} }
function submitContact() {
  const name=document.getElementById('contactName').value.trim(), email=document.getElementById('contactEmail').value.trim(), msg=document.getElementById('contactMsg').value.trim();
  const err=document.getElementById('contactError'), suc=document.getElementById('contactSuccess');
  if (!name||!email||!msg) { if(err)err.style.display='flex'; setTimeout(()=>{if(err)err.style.display='none';},4000); return; }
  if (err) err.style.display='none'; if(suc) suc.classList.add('show');
  ['contactName','contactEmail','contactMsg'].forEach(id => document.getElementById(id).value='');
  setTimeout(() => suc?.classList.remove('show'), 5000);
}

// init
buildNav();
renderTasks();