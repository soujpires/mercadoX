/* ═══════════════════════════════════════════════════════════════
   MERCADO X — app.js
   Prudential do Brasil · Life Planner CRM
═══════════════════════════════════════════════════════════════ */

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const STATUSES = [
  { key: 'Lead',               label: 'Lead',               bg: '#E6F1FB', color: '#0C447C', dot: '#378ADD'  },
  { key: 'Em abordagem',       label: 'Em abordagem',       bg: '#FAEEDA', color: '#633806', dot: '#EF9F27'  },
  { key: 'Cliente ativo',      label: 'Cliente ativo',      bg: '#EAF3DE', color: '#27500A', dot: '#1D9E75'  },
  { key: 'Aguardando retorno', label: 'Aguardando retorno', bg: '#EEEDFE', color: '#3C3489', dot: '#7F77DD'  },
  { key: 'Não convertido',     label: 'Não convertido',     bg: '#FCEBEB', color: '#791F1F', dot: '#E24B4A'  },
  { key: 'OI',                 label: 'OI',                 bg: '#E1F5EE', color: '#085041', dot: '#1D9E75'  },
  { key: 'DELAY',              label: 'DELAY',              bg: '#F1EFE8', color: '#444441', dot: '#888780'  },
  { key: 'NC',                 label: 'Não houve contato',  bg: '#F1EFE8', color: '#5F5E5A', dot: '#B4B2A9'  },
  { key: 'LF',                 label: 'Ligar no futuro',    bg: '#FBEAF0', color: '#72243E', dot: '#D4537E'  },
  { key: 'SI',                 label: 'Sem interesse',      bg: '#FCEBEB', color: '#A32D2D', dot: '#E24B4A'  },
  { key: 'CP',                 label: 'Já é cliente POB',   bg: '#E1F5EE', color: '#0F6E56', dot: '#1D9E75'  },
  { key: 'LP',                 label: 'Já foi abordado',    bg: '#EEEDFE', color: '#534AB7', dot: '#7F77DD'  },
];
const S = {};
STATUSES.forEach(s => S[s.key] = s);

const ROLES = ['Life Planner', 'MFA', 'Corretor de Seguros', 'Consultor Financeiro', 'Assessor Financeiro'];

const SEED_CONTACTS = [
  { id:1, nome:'Carlos Mendes',    genero:'m', rec:'',              ref:'amigo',             tel:'(62) 99123-4567', prof:'Médico',      empresa:'Hospital São Lucas',   cidade:'Goiânia',                es:'GO', filhos:'Pedro',           semana:'1', status:'Em abordagem',    end:'Rua das Flores, 45', obs:'Tem interesse em previdência', notas:[{dt:'2024-05-10T09:15:00',txt:'Primeiro contato, demonstrou interesse em previdência.'},{dt:'2024-05-20T14:32:00',txt:'Ligou, ficou de pensar e retorna amanhã.'}], createdAt:'2024-05-01' },
  { id:2, nome:'Ana Paula Ramos',  genero:'f', rec:'Carlos Mendes', ref:'colega de trabalho',tel:'(62) 98765-3210', prof:'Advogada',    empresa:'Ramos & Cia',          cidade:'Goiânia',                es:'GO', filhos:'',                semana:'2', status:'Lead',             end:'', obs:'', notas:[], createdAt:'2024-05-03' },
  { id:3, nome:'Roberto Lima',     genero:'m', rec:'Carlos Mendes', ref:'familiar',          tel:'(62) 91234-5678', prof:'Empresário',  empresa:'Lima Construtora',     cidade:'Aparecida de Goiânia',   es:'GO', filhos:'Lucas',           semana:'1', status:'Cliente ativo',    end:'Av. Brasil, 200', obs:'Fechou WL30', notas:[{dt:'2024-05-15T10:00:00',txt:'Cliente convertido — assinou WL30.'}], createdAt:'2024-05-05' },
  { id:4, nome:'Fernanda Costa',   genero:'f', rec:'Ana Paula Ramos',ref:'amiga',            tel:'(62) 99988-7766', prof:'Dentista',    empresa:'Clínica Sorriso',      cidade:'Goiânia',                es:'GO', filhos:'',                semana:'3', status:'Aguardando retorno',end:'', obs:'Ligar quinta-feira', notas:[], createdAt:'2024-05-07' },
  { id:5, nome:'Marcos Oliveira',  genero:'m', rec:'Roberto Lima',  ref:'sócio',             tel:'(62) 93344-5566', prof:'Engenheiro',  empresa:'MO Engenharia',        cidade:'Anápolis',               es:'GO', filhos:'Thiago',          semana:'2', status:'Lead',             end:'', obs:'', notas:[], createdAt:'2024-05-08' },
  { id:6, nome:'Juliana Martins',  genero:'f', rec:'Carlos Mendes', ref:'vizinha',           tel:'(62) 97788-1122', prof:'Arquiteta',   empresa:'JM Arquitetura',       cidade:'Goiânia',                es:'GO', filhos:'Sofia, Beatriz',  semana:'1', status:'OI',               end:'', obs:'', notas:[], createdAt:'2024-05-09' },
  { id:7, nome:'Alexandre Borges', genero:'m', rec:'Marcos Oliveira',ref:'amigo',            tel:'(62) 94455-6677', prof:'Contador',    empresa:'Borges Contabilidade', cidade:'Anápolis',               es:'GO', filhos:'',                semana:'2', status:'Lead',             end:'', obs:'', notas:[], createdAt:'2024-05-10' },
];

const SEED_PROFILE = {
  nome: 'Ricardo Souza',
  role: 'Life Planner',
  empresa: 'Prudential do Brasil',
  foto: null,
};

/* ─── STATE ──────────────────────────────────────────────────── */
let contacts  = JSON.parse(localStorage.getItem('mx_contacts')) || SEED_CONTACTS;
let profile   = JSON.parse(localStorage.getItem('mx_profile'))  || SEED_PROFILE;
let nextId    = Math.max(...contacts.map(c => c.id), 0) + 1;

let activePage    = 'home';
let activeFilter  = '';
let openAccId     = null;
let editingId     = null;
let selectedGender = 'm';
let statusTargetId = null;
let selectedRole  = profile.role || 'Life Planner';

/* ─── PERSIST ─────────────────────────────────────────────────── */
function persist() {
  localStorage.setItem('mx_contacts', JSON.stringify(contacts));
}
function persistProfile() {
  localStorage.setItem('mx_profile', JSON.stringify(profile));
}

/* ─── HELPERS ─────────────────────────────────────────────────── */
function getRefs(nome) {
  return contacts.filter(c => c.rec === nome);
}
function fmtDate(iso) {
  const d = new Date(iso), now = new Date();
  const pad = n => String(n).padStart(2, '0');
  const time = `${d.getHours()}h${pad(d.getMinutes())}`;
  if (d.toDateString() === now.toDateString()) return `Hoje, ${time}`;
  const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Ontem, ${time}`;
  return `${pad(d.getDate())}/${pad(d.getMonth()+1)}, ${time}`;
}
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function highlight(text, query) {
  if (!query) return escHtml(text);
  const escaped = escHtml(text);
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return escaped.replace(re, '<mark>$1</mark>');
}

/* ─── STATS ──────────────────────────────────────────────────── */
function updateStats() {
  document.getElementById('s-total').textContent  = contacts.length;
  document.getElementById('s-ativos').textContent = contacts.filter(c => c.status === 'Cliente ativo').length;
  document.getElementById('s-leads').textContent  = contacts.filter(c => c.status === 'Lead').length;
}

/* ─── NAVIGATION ─────────────────────────────────────────────── */
function navigate(page) {
  activePage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.querySelectorAll('.drawer-item').forEach(i => i.classList.remove('active'));
  const navEl = document.getElementById(`nav-${page}`);
  if (navEl) navEl.classList.add('active');
  closeDrawer();

  if (page === 'dashboard') renderDashboard();
  if (page === 'ranking')   renderRanking();
  if (page === 'reports')   renderReports();
  if (page === 'profile')   renderProfile();

  // show/hide FAB
  document.querySelector('.fab').classList.toggle('hidden', page !== 'home');
}

/* ─── DRAWER ─────────────────────────────────────────────────── */
function toggleDrawer() {
  document.getElementById('drawer').classList.toggle('open');
  document.getElementById('drawer-overlay').classList.toggle('hidden');
}
function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.add('hidden');
}

/* ─── FILTER ─────────────────────────────────────────────────── */
function toggleFilter() {
  const panel = document.getElementById('filter-panel');
  const btn   = document.getElementById('filter-toggle');
  const open  = panel.classList.toggle('hidden');
  btn.classList.toggle('active', !open);
  if (!open) buildFilterChips();
}
function buildFilterChips() {
  const el = document.getElementById('filter-chips');
  const opts = [{ key: '', label: 'Todos' }, ...STATUSES];
  el.innerHTML = opts.map(o =>
    `<button class="fchip${activeFilter === o.key ? ' on' : ''}" onclick="setFilter('${o.key}')">${o.label}</button>`
  ).join('');
}
function setFilter(key) {
  activeFilter = key;
  const dot = document.getElementById('filter-dot');
  dot.classList.toggle('hidden', !key);
  buildFilterChips();
  renderList();
}

/* ─── LIST ───────────────────────────────────────────────────── */
function renderList() {
  const q    = (document.getElementById('search-input').value || '').toLowerCase().trim();
  const list = contacts.filter(c => {
    const mq = !q ||
      c.nome.toLowerCase().includes(q) ||
      (c.prof   || '').toLowerCase().includes(q) ||
      (c.empresa|| '').toLowerCase().includes(q) ||
      (c.cidade || '').toLowerCase().includes(q);
    const mf = !activeFilter || c.status === activeFilter;
    return mq && mf;
  });

  const countEl = document.getElementById('list-count');
  countEl.textContent = `${list.length} contato${list.length !== 1 ? 's' : ''}`;

  const el = document.getElementById('contact-list');
  if (!list.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-user-search"></i><p>Nenhum contato encontrado</p><small>Tente ajustar o filtro ou a busca</small></div>`;
    return;
  }
  el.innerHTML = list.map(c => buildRow(c, q)).join('');
  updateStats();
}

function buildRow(c, q = '') {
  const s    = S[c.status] || S['Lead'];
  const refs = getRefs(c.nome);
  const isOpen = openAccId === c.id;
  const profLine = [c.prof, c.empresa].filter(Boolean).join(' — ');

  return `
<div class="row-wrap${isOpen ? ' expanded' : ''}" id="wrap-${c.id}">
  <div class="contact-row" onclick="toggleAcc(${c.id})">
    <div class="avatar ${c.genero === 'f' ? 'av-f' : 'av-m'}">
      <i class="ti ti-user" aria-hidden="true"></i>
    </div>
    <div class="contact-info">
      <div class="contact-name">${highlight(c.nome, q)}</div>
      <div class="contact-prof">${highlight(profLine || '—', q)}</div>
    </div>
    <span class="status-tag" style="background:${s.bg};color:${s.color}">
      <i class="ti ti-tag"></i> ${s.label}
    </span>
    <div class="row-actions">
      <button class="row-action-btn green" onclick="event.stopPropagation();openRefModal(${c.id})" title="Nova indicação" aria-label="Nova indicação">
        <i class="ti ti-user-plus"></i>
      </button>
      <button class="row-action-btn" onclick="event.stopPropagation();openStatusSheet(${c.id})" title="Mudar status" aria-label="Mudar status">
        <i class="ti ti-refresh-alert"></i>
      </button>
    </div>
  </div>
  <div class="accordion${isOpen ? ' open' : ''}" id="acc-${c.id}">
    ${buildAccordion(c, refs)}
  </div>
</div>`;
}

function buildAccordion(c, refs) {
  const fieldsContact = [
    c.tel    ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-phone"></i> Telefone</span>${escHtml(c.tel)}</div>` : '',
    c.cidade ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-map-pin"></i> Cidade</span>${escHtml(c.cidade)}${c.es ? ' — ' + escHtml(c.es) : ''}</div>` : '',
    c.end    ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-home"></i> Endereço</span>${escHtml(c.end)}</div>` : '',
  ].filter(Boolean).join('');

  const fieldsOrigem = [
    `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-share"></i> Recomendante</span>${escHtml(c.rec) || '—'}</div>`,
    c.ref    ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-link"></i> Relação</span>${escHtml(c.ref)}</div>` : '',
    c.filhos ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-baby-carriage"></i> Filho(s)</span>${escHtml(c.filhos)}</div>` : '',
    c.semana ? `<div class="acc-field"><span class="acc-field-lbl"><i class="ti ti-calendar-week"></i> Semana</span>${escHtml(c.semana)}</div>` : '',
  ].filter(Boolean).join('');

  const refsHtml = refs.length ? `
    <div class="acc-section">Indicações geradas (${refs.length})</div>
    <div class="acc-refs">
      ${refs.map(r => {
        const rs = S[r.status] || S['Lead'];
        return `<div class="acc-ref"><span class="acc-ref-name">${escHtml(r.nome)}</span><span style="font-size:10px;color:${rs.color}">${rs.label}</span></div>`;
      }).join('')}
    </div>` : '';

  const obsHtml = c.obs ? `
    <div class="acc-section">Observações</div>
    <div style="font-size:12px;color:var(--text-soft)">${escHtml(c.obs)}</div>` : '';

  return `
    <div class="acc-section">Contato</div>
    <div class="acc-fields">${fieldsContact || '<div class="acc-field" style="color:var(--gray)">Sem dados de contato</div>'}</div>
    <div class="acc-section">Origem</div>
    <div class="acc-fields">${fieldsOrigem}</div>
    ${refsHtml}
    ${obsHtml}
    <div class="notes-toggle" onclick="toggleNotes(${c.id})">
      <div class="notes-toggle-left">
        <i class="ti ti-notes"></i>
        Anotações
        ${c.notas.length ? `<span class="notes-badge">${c.notas.length}</span>` : ''}
      </div>
      <i class="ti ti-chevron-down notes-chevron" id="nchev-${c.id}"></i>
    </div>
    <div class="notes-body" id="nbody-${c.id}">
      <div class="note-input-area">
        <textarea id="ninput-${c.id}" placeholder="Escrever anotação..."></textarea>
        <button class="note-save-btn" onclick="saveNote(${c.id})">Salvar</button>
      </div>
      <div class="timeline" id="ntl-${c.id}">${buildTimeline(c)}</div>
    </div>
    <div class="acc-actions">
      <button class="acc-action sec" onclick="openEditModal(${c.id})">
        <i class="ti ti-edit"></i> Editar
      </button>
      <button class="acc-action pri" onclick="openRefModal(${c.id})">
        <i class="ti ti-user-plus"></i> Nova indicação
      </button>
    </div>`;
}

function buildTimeline(c) {
  if (!c.notas.length) {
    return '<div style="padding:8px 10px 10px;font-size:12px;color:var(--gray)">Nenhuma anotação ainda.</div>';
  }
  return [...c.notas].reverse().map((n, i, arr) => `
    <div class="tl-item">
      <div class="tl-dot-col">
        <div class="tl-dot${i > 0 ? ' old' : ''}"></div>
        ${i < arr.length - 1 ? '<div class="tl-line"></div>' : ''}
      </div>
      <div>
        <div class="tl-date">${fmtDate(n.dt)}</div>
        <div class="tl-text">${escHtml(n.txt)}</div>
      </div>
    </div>`).join('');
}

function toggleAcc(id) {
  openAccId = openAccId === id ? null : id;
  renderList();
  if (openAccId) {
    setTimeout(() => {
      const el = document.getElementById(`acc-${id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);
  }
}

function toggleNotes(id) {
  const body = document.getElementById(`nbody-${id}`);
  const chev = document.getElementById(`nchev-${id}`);
  const open = body.classList.toggle('open');
  if (chev) chev.classList.toggle('open', open);
}

function saveNote(id) {
  const inp = document.getElementById(`ninput-${id}`);
  const txt = (inp.value || '').trim();
  if (!txt) return;
  const c = contacts.find(x => x.id === id);
  if (!c) return;
  c.notas.push({ dt: new Date().toISOString(), txt });
  persist();
  inp.value = '';
  const tl = document.getElementById(`ntl-${id}`);
  if (tl) tl.innerHTML = buildTimeline(c);
  // update badge
  const toggle = document.querySelector(`#wrap-${id} .notes-toggle-left`);
  if (toggle) {
    let badge = toggle.querySelector('.notes-badge');
    if (!badge) { badge = document.createElement('span'); badge.className = 'notes-badge'; toggle.appendChild(badge); }
    badge.textContent = c.notas.length;
  }
  updateStats();
}

/* ─── STATUS SHEET ────────────────────────────────────────────── */
function openStatusSheet(id) {
  statusTargetId = id;
  const c = contacts.find(x => x.id === id);
  document.getElementById('status-sheet-title').textContent = `Status — ${c.nome}`;
  document.getElementById('status-options').innerHTML = STATUSES.map(s => `
    <button class="status-opt${c.status === s.key ? ' current' : ''}" onclick="applyStatus('${s.key}')">
      <div class="status-opt-dot" style="background:${s.dot}"></div>
      <span>${s.label}</span>
      ${c.status === s.key ? '<i class="ti ti-check status-opt-check"></i>' : ''}
    </button>`).join('');
  document.getElementById('status-overlay').classList.remove('hidden');
  document.getElementById('status-sheet').classList.remove('hidden');
}
function closeStatusSheet() {
  document.getElementById('status-overlay').classList.add('hidden');
  document.getElementById('status-sheet').classList.add('hidden');
}
function applyStatus(key) {
  const c = contacts.find(x => x.id === statusTargetId);
  if (c) { c.status = key; persist(); renderList(); }
  closeStatusSheet();
}

/* ─── MODAL ──────────────────────────────────────────────────── */
function openModal() {
  editingId = null;
  selectedGender = 'm';
  document.getElementById('modal-title').textContent = 'Novo contato';
  clearForm();
  populateStatusSelect('Lead');
  selGender('m');
  showModal();
}
function openRefModal(parentId) {
  const parent = contacts.find(x => x.id === parentId);
  openModal();
  if (parent) {
    document.getElementById('modal-title').textContent = `Nova indicação de ${parent.nome}`;
    document.getElementById('f-rec').value = parent.nome;
  }
}
function openEditModal(id) {
  const c = contacts.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  selectedGender = c.genero || 'm';
  document.getElementById('modal-title').textContent = 'Editar contato';
  document.getElementById('f-nome').value    = c.nome    || '';
  document.getElementById('f-rec').value     = c.rec     || '';
  document.getElementById('f-ref').value     = c.ref     || '';
  document.getElementById('f-tel').value     = c.tel     || '';
  document.getElementById('f-prof').value    = c.prof    || '';
  document.getElementById('f-empresa').value = c.empresa || '';
  document.getElementById('f-cidade').value  = c.cidade  || '';
  document.getElementById('f-es').value      = c.es      || '';
  document.getElementById('f-end').value     = c.end     || '';
  document.getElementById('f-filhos').value  = c.filhos  || '';
  document.getElementById('f-semana').value  = c.semana  || '';
  document.getElementById('f-obs').value     = c.obs     || '';
  populateStatusSelect(c.status);
  selGender(c.genero || 'm');
  showModal();
}
function showModal() {
  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('contact-modal').classList.remove('hidden');
  setTimeout(() => document.getElementById('f-nome').focus(), 100);
}
function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('contact-modal').classList.add('hidden');
  document.getElementById('rec-dropdown').classList.add('hidden');
}
function clearForm() {
  ['nome','rec','ref','tel','prof','empresa','cidade','es','end','filhos','obs'].forEach(f => {
    document.getElementById('f-' + f).value = '';
  });
  document.getElementById('f-semana').value = '';
}
function populateStatusSelect(current) {
  document.getElementById('f-status').innerHTML = STATUSES.map(s =>
    `<option value="${s.key}"${current === s.key ? ' selected' : ''}>${s.label}</option>`
  ).join('');
}
function selGender(g) {
  selectedGender = g;
  document.getElementById('g-m').classList.toggle('active', g === 'm');
  document.getElementById('g-f').classList.toggle('active', g === 'f');
}
function saveContact() {
  const nome = (document.getElementById('f-nome').value || '').trim();
  if (!nome) { alert('Informe o nome do contato.'); return; }
  const data = {
    nome,
    genero:  selectedGender,
    rec:     document.getElementById('f-rec').value.trim(),
    ref:     document.getElementById('f-ref').value.trim(),
    tel:     document.getElementById('f-tel').value.trim(),
    prof:    document.getElementById('f-prof').value.trim(),
    empresa: document.getElementById('f-empresa').value.trim(),
    cidade:  document.getElementById('f-cidade').value.trim(),
    es:      document.getElementById('f-es').value.trim().toUpperCase(),
    end:     document.getElementById('f-end').value.trim(),
    filhos:  document.getElementById('f-filhos').value.trim(),
    semana:  document.getElementById('f-semana').value.trim(),
    status:  document.getElementById('f-status').value,
    obs:     document.getElementById('f-obs').value.trim(),
  };
  if (editingId) {
    const idx = contacts.findIndex(c => c.id === editingId);
    contacts[idx] = { ...contacts[idx], ...data };
  } else {
    data.id = nextId++;
    data.notas = [];
    data.createdAt = new Date().toISOString().slice(0, 10);
    contacts.push(data);
  }
  persist();
  closeModal();
  renderList();
  updateStats();
}

/* ─── RECOMENDANTE AUTOCOMPLETE ──────────────────────────────── */
function searchRec(q) {
  const dropdown = document.getElementById('rec-dropdown');
  const val = q.trim().toLowerCase();

  const results = contacts
    .filter(c => c.id !== editingId)
    .filter(c => !val || c.nome.toLowerCase().includes(val))
    .slice(0, 8);

  if (!results.length && val) {
    dropdown.innerHTML = `<div class="rec-empty">Nenhum contato encontrado</div>`;
    dropdown.classList.remove('hidden');
    return;
  }
  if (!results.length) { dropdown.classList.add('hidden'); return; }

  dropdown.innerHTML = results.map(c =>
    `<div class="rec-option" onclick="selectRec('${escHtml(c.nome)}')">${highlight(c.nome, val)} <span style="font-size:11px;color:var(--gray)">— ${escHtml(c.prof || '')}</span></div>`
  ).join('');
  dropdown.classList.remove('hidden');
}
function selectRec(nome) {
  document.getElementById('f-rec').value = nome;
  document.getElementById('rec-dropdown').classList.add('hidden');
}
document.addEventListener('click', e => {
  const wrap = document.querySelector('.fg.full[style*="position"]');
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById('rec-dropdown').classList.add('hidden');
  }
});

/* ─── DASHBOARD ──────────────────────────────────────────────── */
function renderDashboard() {
  const total   = contacts.length;
  const ativos  = contacts.filter(c => c.status === 'Cliente ativo').length;
  const leads   = contacts.filter(c => c.status === 'Lead').length;
  const recs    = [...new Set(contacts.filter(c => c.rec).map(c => c.rec))].length;

  const statCards = [
    { icon: 'ti-users',           iconBg: '#E6F1FB', iconColor: '#185FA5', num: total,  lbl: 'Total de contatos'  },
    { icon: 'ti-user-check',      iconBg: '#EAF3DE', iconColor: '#27500A', num: ativos, lbl: 'Clientes ativos'    },
    { icon: 'ti-user-star',       iconBg: '#FAEEDA', iconColor: '#633806', num: leads,  lbl: 'Leads ativos'       },
    { icon: 'ti-network',         iconBg: '#EEEDFE', iconColor: '#3C3489', num: recs,   lbl: 'Recomendantes'      },
  ];

  // ranking top 3
  const rankMap = {};
  contacts.forEach(c => { if (c.rec) rankMap[c.rec] = (rankMap[c.rec] || 0) + 1; });
  const ranked = Object.entries(rankMap).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxRank = ranked[0]?.[1] || 1;
  const posClass = i => ['gold','silver','bronze','other','other'][i] || 'other';

  // status breakdown
  const statusBreakdown = STATUSES.map(s => ({
    ...s,
    count: contacts.filter(c => c.status === s.key).length
  })).filter(s => s.count > 0);
  const maxCount = Math.max(...statusBreakdown.map(s => s.count), 1);

  document.getElementById('dash-grid').innerHTML = `
    <div class="dash-stats">
      ${statCards.map(sc => `
        <div class="dash-stat-card">
          <div class="dash-stat-icon" style="background:${sc.iconBg};color:${sc.iconColor}">
            <i class="ti ${sc.icon}"></i>
          </div>
          <div>
            <div class="dash-stat-num">${sc.num}</div>
            <div class="dash-stat-lbl">${sc.lbl}</div>
          </div>
        </div>`).join('')}
    </div>

    <div class="dash-card">
      <div class="dash-card-header"><i class="ti ti-trophy"></i> Top recomendantes</div>
      <div class="dash-card-body">
        ${ranked.length ? ranked.map(([name, count], i) => `
          <div class="rank-item">
            <div class="rank-pos ${posClass(i)}">${i + 1}</div>
            <div class="rank-name">${escHtml(name)}</div>
            <div class="rank-bar-wrap"><div class="rank-bar" style="width:${Math.round(count/maxRank*100)}%"></div></div>
            <div class="rank-count">${count} ind.</div>
          </div>`).join('')
          : '<div style="font-size:13px;color:var(--gray);padding:8px 0">Nenhum recomendante ainda</div>'}
      </div>
    </div>

    <div class="dash-card">
      <div class="dash-card-header"><i class="ti ti-chart-bar"></i> Contatos por status</div>
      <div class="dash-card-body">
        ${statusBreakdown.map(s => `
          <div class="status-bar-item">
            <div class="status-bar-label">${s.label}</div>
            <div class="status-bar-track">
              <div class="status-bar-fill" style="width:${Math.round(s.count/maxCount*100)}%;background:${s.dot}"></div>
            </div>
            <div class="status-bar-num">${s.count}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ─── RANKING ─────────────────────────────────────────────────── */
function renderRanking() {
  const rankMap = {};
  contacts.forEach(c => { if (c.rec) rankMap[c.rec] = (rankMap[c.rec] || 0) + 1; });
  const ranked = Object.entries(rankMap).sort((a, b) => b[1] - a[1]);
  const maxVal = ranked[0]?.[1] || 1;
  const posClass = i => ['gold','silver','bronze'][i] || 'other';

  const el = document.getElementById('ranking-list');
  if (!ranked.length) {
    el.innerHTML = `<div class="empty-state"><i class="ti ti-trophy"></i><p>Nenhum recomendante ainda</p><small>Cadastre indicações para ver o ranking</small></div>`;
    return;
  }
  el.innerHTML = `<div class="ranking-list-full">
    ${ranked.map(([name, count], i) => `
      <div class="ranking-full-item">
        <div class="rank-pos ${posClass(i)}">${i + 1}</div>
        <div class="rank-name">${escHtml(name)}</div>
        <div class="rank-bar-wrap"><div class="rank-bar" style="width:${Math.round(count/maxVal*100)}%"></div></div>
        <div class="rank-count">${count} ind.</div>
      </div>`).join('')}
  </div>`;
}

/* ─── REPORTS ─────────────────────────────────────────────────── */
function renderReports() {
  document.getElementById('reports-grid').innerHTML = `
    <div class="report-card">
      <div class="report-card-header"><i class="ti ti-adjustments"></i> Configurar exportação</div>
      <div class="report-card-body">
        <div class="filter-section">
          <label>Filtrar por status</label>
          <select id="rep-filter-status">
            <option value="">Todos os status</option>
            ${STATUSES.map(s => `<option value="${s.key}">${s.label}</option>`).join('')}
          </select>
        </div>
        <div class="filter-section">
          <label>Colunas a incluir</label>
          <select id="rep-cols">
            <option value="all">Todas as colunas</option>
            <option value="basic">Básico (nome, tel, status)</option>
            <option value="full">Completo (todos os campos)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="report-card">
      <div class="report-card-header"><i class="ti ti-download"></i> Exportar</div>
      <div class="report-card-body">
        <div class="report-options">
          <button class="report-option" onclick="exportXLSX()">
            <i class="ti ti-file-spreadsheet" style="color:#1D6F42"></i>
            <div class="report-option-info">
              <div class="report-option-title">Exportar como XLSX</div>
              <div class="report-option-sub">Planilha Excel com todos os dados</div>
            </div>
            <span class="report-badge badge-xlsx">XLSX</span>
          </button>
          <button class="report-option" onclick="exportCSV()">
            <i class="ti ti-file-text" style="color:#2980b9"></i>
            <div class="report-option-info">
              <div class="report-option-title">Exportar como CSV</div>
              <div class="report-option-sub">Compatível com Google Sheets</div>
            </div>
            <span class="report-badge" style="background:#2980b9;color:#fff">CSV</span>
          </button>
        </div>
        <div style="margin-top:12px;padding:10px 12px;background:var(--offwhite);border-radius:var(--radius-sm);font-size:11px;color:var(--gray)">
          <i class="ti ti-info-circle" style="font-size:13px;vertical-align:-2px;margin-right:4px"></i>
          Total de registros: <strong style="color:var(--text)">${contacts.length} contatos</strong>
        </div>
      </div>
    </div>`;
}

function getFilteredForExport() {
  const statusFilter = (document.getElementById('rep-filter-status') || {}).value || '';
  return statusFilter ? contacts.filter(c => c.status === statusFilter) : contacts;
}
function getColsMode() {
  return (document.getElementById('rep-cols') || {}).value || 'all';
}

function exportCSV() {
  const data = getFilteredForExport();
  const mode = getColsMode();
  const headers = mode === 'basic'
    ? ['Nome','Telefone','Profissão','Status']
    : ['Nome','Gênero','Recomendante','Relação','Telefone','Profissão','Empresa','Cidade','Estado','Filho(s)','Semana','Status','Endereço','Observações','Criado em'];

  const rows = data.map(c => {
    if (mode === 'basic') return [c.nome, c.tel, c.prof, c.status];
    return [c.nome, c.genero === 'f' ? 'Feminino' : 'Masculino', c.rec, c.ref, c.tel, c.prof, c.empresa, c.cidade, c.es, c.filhos, c.semana, c.status, c.end, c.obs, c.createdAt];
  });

  const csv = [headers, ...rows].map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
  const bom = '\uFEFF';
  downloadFile(bom + csv, 'mercado-x.csv', 'text/csv;charset=utf-8');
}

function exportXLSX() {
  // Simple HTML table → XLS (opens in Excel)
  const data = getFilteredForExport();
  const mode = getColsMode();
  const headers = mode === 'basic'
    ? ['Nome','Telefone','Profissão','Status']
    : ['Nome','Gênero','Recomendante','Relação','Telefone','Profissão','Empresa','Cidade','Estado','Filho(s)','Semana','Status','Endereço','Observações','Criado em'];

  const rows = data.map(c => {
    if (mode === 'basic') return [c.nome, c.tel, c.prof, c.status];
    return [c.nome, c.genero === 'f' ? 'Feminino' : 'Masculino', c.rec, c.ref, c.tel, c.prof, c.empresa, c.cidade, c.es, c.filhos, c.semana, c.status, c.end, c.obs, c.createdAt];
  });

  const ths = headers.map(h => `<th style="background:#0D1B40;color:#C9A84C;padding:6px 10px;font-weight:600">${h}</th>`).join('');
  const trs = rows.map(r => `<tr>${r.map(v => `<td style="padding:5px 10px;border:1px solid #E2E6F0">${escHtml(String(v||''))}</td>`).join('')}</tr>`).join('');
  const html = `<html><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;font-size:12px}</style></head><body><table border="1" cellspacing="0"><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></body></html>`;

  downloadFile(html, 'mercado-x.xls', 'application/vnd.ms-excel;charset=utf-8');
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ─── PROFILE ─────────────────────────────────────────────────── */
function renderProfile() {
  const el = document.getElementById('profile-content');
  el.innerHTML = `
    <div class="profile-card">
      <div class="profile-hero">
        <div class="profile-avatar-wrap">
          <div class="profile-avatar" id="profile-avatar-display">
            ${profile.foto ? `<img src="${profile.foto}" alt="Foto de perfil">` : '<i class="ti ti-user"></i>'}
          </div>
          <button class="profile-avatar-edit" onclick="document.getElementById('photo-input').click()" title="Trocar foto">
            <i class="ti ti-camera"></i>
          </button>
          <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="handlePhoto(this)">
        </div>
        <div class="profile-name" id="profile-name-display">${escHtml(profile.nome)}</div>
        <div class="profile-role-badge" id="profile-role-display">${escHtml(profile.role)}</div>
      </div>
      <div class="profile-body">
        <div class="profile-field">
          <label>Nome completo</label>
          <input type="text" id="prof-nome" value="${escHtml(profile.nome)}" placeholder="Seu nome completo">
        </div>
        <div class="profile-field">
          <label>Credencial / Cargo</label>
          <div class="role-chips">
            ${ROLES.map(r => `<button class="role-chip${selectedRole === r ? ' active' : ''}" onclick="selectRole('${r}')">${r}</button>`).join('')}
          </div>
        </div>
        <div class="profile-field">
          <label>Empresa</label>
          <input type="text" id="prof-empresa" value="${escHtml(profile.empresa || 'Prudential do Brasil')}" placeholder="Nome da empresa">
        </div>
        <button class="btn-profile-save" onclick="saveProfile()">
          <i class="ti ti-check" style="font-size:14px;margin-right:6px"></i> Salvar perfil
        </button>
      </div>
    </div>`;
}

function selectRole(role) {
  selectedRole = role;
  document.querySelectorAll('.role-chip').forEach(el => {
    el.classList.toggle('active', el.textContent === role);
  });
}

function saveProfile() {
  profile.nome    = document.getElementById('prof-nome').value.trim() || profile.nome;
  profile.role    = selectedRole;
  profile.empresa = document.getElementById('prof-empresa').value.trim() || profile.empresa;
  persistProfile();
  applyProfile();
  renderProfile();
}

function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    profile.foto = e.target.result;
    persistProfile();
    applyProfile();
    renderProfile();
  };
  reader.readAsDataURL(file);
}

function applyProfile() {
  document.getElementById('hero-name').textContent = profile.nome;
  document.getElementById('hero-role').textContent = `${profile.role} · ${profile.empresa || 'Prudential do Brasil'}`;
  document.getElementById('drawer-name').textContent = profile.nome;
  document.getElementById('drawer-role').textContent = profile.role;

  // topbar avatar
  const tbAv = document.getElementById('tb-avatar');
  tbAv.innerHTML = profile.foto
    ? `<img src="${profile.foto}" alt="Avatar">`
    : '<i class="ti ti-user"></i>';

  // drawer avatar
  const drAv = document.getElementById('drawer-avatar-img');
  drAv.innerHTML = profile.foto
    ? `<img src="${profile.foto}" alt="Avatar">`
    : '<i class="ti ti-user"></i>';
}

/* ─── INIT ───────────────────────────────────────────────────── */
function init() {
  applyProfile();
  renderList();
  updateStats();

  // Close rec dropdown on outside click
  document.addEventListener('click', e => {
    const dd = document.getElementById('rec-dropdown');
    const inp = document.getElementById('f-rec');
    if (dd && inp && !dd.contains(e.target) && e.target !== inp) {
      dd.classList.add('hidden');
    }
  });
}

init();
