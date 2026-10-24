'use strict';

const STORAGE_KEY = 'meu-friv-retro-games-v1';

// ---------------------------------------------------------------------------
// Configurações fáceis de mudar
// ---------------------------------------------------------------------------

// Tamanho (em px) dos quadradinhos. Com poucos sites, a grade cabe inteira na
// tela. Se os quadradinhos ficariam menores que MIN_TILE, a página passa a rolar.
const MIN_TILE = 84;
const MAX_TILE = 170;

// A lista padrão fica no arquivo games.js (carregado antes deste script).
let defaultsFailed = false;
function getDefaultGames() {
  if (typeof DEFAULT_GAMES !== 'undefined' && Array.isArray(DEFAULT_GAMES)) return DEFAULT_GAMES;
  defaultsFailed = true;
  console.error('Não consegui ler DEFAULT_GAMES. Confira se o games.js existe e não tem erro de vírgula ou aspas.');
  return [];
}
const DEFAULT_LIST = getDefaultGames();

// Guarda se o botão "Ocultar bloqueados" está ligado (vale só para este navegador).
const HIDE_BLOCKED_KEY = 'meu-friv-retro-hide-blocked-v1';
function loadHideBlocked() {
  try { return localStorage.getItem(HIDE_BLOCKED_KEY) === '1'; }
  catch { return false; }
}
function saveHideBlocked(value) {
  try { localStorage.setItem(HIDE_BLOCKED_KEY, value ? '1' : '0'); }
  catch (error) { console.warn('Não foi possível salvar a preferência:', error); }
}

const COLORS = [
  '#ffd85a', '#f9a7b0', '#9fd8ff', '#b6e4b1', '#c8b6ff', '#ffbd85',
  '#8ee1d2', '#ffcfec', '#c9e6a4', '#b6caff', '#ffb7a6', '#f6e69a'
];

const topbar = document.querySelector('.topbar');
const pageShell = document.querySelector('.page-shell');
const grid = document.querySelector('#game-grid');
const searchInput = document.querySelector('#search-input');
const gameCount = document.querySelector('#game-count');
const emptyState = document.querySelector('#empty-state');
const addToggle = document.querySelector('#add-toggle');
const addPanel = document.querySelector('#add-panel');
const closePanel = document.querySelector('#close-panel');
const gameForm = document.querySelector('#game-form');
const formTitle = document.querySelector('#form-title');
const formSubmit = document.querySelector('#form-submit');
const formMessage = document.querySelector('#form-message');
const gameNameInput = document.querySelector('#game-name');
const gameUrlInput = document.querySelector('#game-url');
const gameIconInput = document.querySelector('#game-icon');
const gameColorInput = document.querySelector('#game-color');
const textToggle = document.querySelector('#text-toggle');
const textPanel = document.querySelector('#text-panel');
const closeTextPanelButton = document.querySelector('#close-text-panel');
const closeTextCancelButton = document.querySelector('#close-text-cancel');
const codeEditor = document.querySelector('#code-editor');
const copyCodeButton = document.querySelector('#copy-code');
const applyCodeButton = document.querySelector('#apply-code');
const textMessage = document.querySelector('#text-message');
const resetDialog = document.querySelector('#reset-dialog');
const moreToggle = document.querySelector('#more-toggle');
const moreDialog = document.querySelector('#more-dialog');
const moreList = document.querySelector('#more-list');
const resetButton = document.querySelector('#reset-button');
const confirmReset = document.querySelector('#confirm-reset');
const hideBlockedToggle = document.querySelector('#hide-blocked-toggle');
const gameBlockedInput = document.querySelector('#game-blocked');
const urlField = document.querySelector('#url-field');
const blockedField = document.querySelector('#blocked-field');
const multiInput = document.querySelector('#game-multi');
const sitesEditor = document.querySelector('#sites-editor');
const sitesList = document.querySelector('#sites-list');
const addSiteButton = document.querySelector('#add-site');
const chooseDialog = document.querySelector('#choose-dialog');
const chooseGame = document.querySelector('#choose-game');
const chooseList = document.querySelector('#choose-list');
const EMPTY_DEFAULT_TEXT = emptyState.querySelector('p').textContent;

let editingId = null;
let games = loadGames();
let hideBlocked = loadHideBlocked();
let visibleGames = []; // o que está aparecendo agora (depende da busca)


// ---------------------------------------------------------------------------
// Dados: carregar, salvar e validar
// ---------------------------------------------------------------------------
function isValidGame(game) {
  return Boolean(game && typeof game.name === 'string' &&
    (typeof game.url === 'string' || (Array.isArray(game.sites) && game.sites.length > 0)));
}

function normalizeHexColor(value, fallback = '#ffd85a') {
  const color = String(value || '').trim();
  if (/^#[\da-f]{6}$/i.test(color)) return color.toLowerCase();
  if (/^#[\da-f]{3}$/i.test(color)) {
    return `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase();
  }
  return fallback;
}

function getTileColor(game, index) {
  return normalizeHexColor(game.color, COLORS[index % COLORS.length]);
}

function urlKey(url) {
  return String(url).trim().replace(/\/$/, '').toLowerCase();
}

// Coleções salvas antes do campo "blocked" existir não têm essa informação:
// nesse caso vale o que a lista padrão (games.js) diz sobre o mesmo endereço.
function legacyBlocked(url) {
  const key = urlKey(url);
  const match = DEFAULT_LIST.find((entry) => entry && typeof entry.url === 'string' && urlKey(entry.url) === key);
  return Boolean(match && match.blocked === true);
}

// Um jogo pode rodar em vários sites. Nesse caso ele tem a lista "sites" (com 2 ou mais itens,
// cada um com nome, endereço e se o firewall bloqueia). Sem "sites", é um jogo comum de um site só.
// Para o resto do código, "url" é o endereço do primeiro site e "blocked" só é true
// se TODOS os sites do jogo forem bloqueados (aí o quadradinho some em "Ocultar bloqueados").
function cleanSites(rawSites) {
  if (!Array.isArray(rawSites)) return [];
  return rawSites
    .map((site) => {
      const url = site ? safeHttpUrl(site.url) : null;
      const name = site && typeof site.name === 'string' ? site.name.trim().slice(0, 64) : '';
      return { name: name || (url ? getDomain(url) : ''), url, blocked: Boolean(site && site.blocked === true) };
    })
    .filter((site) => site.url);
}

function isMultiSite(game) {
  return Array.isArray(game.sites) && game.sites.length > 1;
}

// Lista de sites do jogo (um jogo comum conta como um jogo com um site).
function getGameSites(game) {
  return isMultiSite(game) ? game.sites : [{ name: game.name, url: game.url, blocked: Boolean(game.blocked) }];
}

// Os sites que podem ser usados agora (com "Ocultar bloqueados" ligado, os bloqueados saem).
function getAvailableSites(game) {
  return getGameSites(game).filter((site) => !(hideBlocked && site.blocked));
}

function normalizeLoadedGame(game, index, prefix = 'default') {
  const sites = cleanSites(game.sites);
  const base = {
    id: typeof game.id === 'string' && game.id ? game.id : `${prefix}-${index + 1}`,
    name: game.name,
    icon: typeof game.icon === 'string' && game.icon.trim().toLowerCase() !== 'imglocal' ? game.icon : '',
    color: getTileColor(game, index)
  };
  if (sites.length > 1) {
    return { ...base, url: sites[0].url, blocked: sites.every((site) => site.blocked), sites };
  }
  const url = sites.length === 1 ? sites[0].url : game.url;
  const blocked = sites.length === 1
    ? sites[0].blocked
    : (typeof game.blocked === 'boolean' ? game.blocked : legacyBlocked(game.url));
  return { ...base, url, blocked };
}

function loadDefaultGames() {
  return DEFAULT_LIST.filter(isValidGame).map((game, index) => normalizeLoadedGame(game, index));
}

function loadGames() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter(isValidGame).map((game, index) => normalizeLoadedGame(game, index, 'saved'));
      }
    }
  } catch (error) {
    console.warn('Não foi possível ler a coleção salva:', error);
  }
  return loadDefaultGames();
}

// Devolve true se salvou. Quem chama decide onde mostrar o aviso de erro.
function saveGames() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    return true;
  } catch (error) {
    console.error('Não foi possível salvar a coleção:', error);
    return false;
  }
}

const SAVE_ERROR = 'O navegador não conseguiu salvar a alteração. Verifique as permissões de armazenamento.';

function safeHttpUrl(value, optional = false) {
  const trimmed = String(value || '').trim();
  if (!trimmed && optional) return '';
  try {
    const parsed = new URL(trimmed);
    return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
  } catch {
    return null;
  }
}

// Sem ícone no cadastro, o site procura a imagem img/<nome do jogo>.png na pasta do projeto.
function localIconPath(game) {
  return `img/${encodeURIComponent(game.name.trim())}.png`;
}

function getDomain(url) {
  try { return new URL(url).hostname.replace(/^www\./, ''); }
  catch { return url; }
}

// "Árvore" e "arvore" devem achar o mesmo resultado na busca.
function normalizeText(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('pt-BR');
}

function getInitials(name) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  // Array.from separa por caractere de verdade (não quebra emojis ao meio).
  const letters = words.length > 1
    ? [Array.from(words[0])[0], Array.from(words[1])[0]]
    : Array.from(words[0] || '?').slice(0, 2);
  return letters.join('').toLocaleUpperCase('pt-BR');
}

// ---------------------------------------------------------------------------
// Quadradinhos
// ---------------------------------------------------------------------------
function createGameCard(game, index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'game-card-wrap';
  wrapper.style.setProperty('--i', String(index % 30));

  wrapper.dataset.id = game.id;
  wrapper.draggable = true; // arrastar para reordenar

  const link = document.createElement('a');
  link.className = 'game-card';
  link.draggable = false; // senão o navegador arrasta o link em vez do quadradinho
  const multi = isMultiSite(game);
  link.href = (getAvailableSites(game)[0] || { url: game.url }).url; // vale para Ctrl+clique / clique do meio
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.title = multi ? `${game.name} — ${game.sites.length} sites` : `${game.name} — ${getDomain(game.url)}`;
  link.setAttribute('aria-label', multi ? `Abrir ${game.name} (escolher o site)` : `Abrir ${game.name} em uma nova aba`);
  if (multi) {
    // Clique normal: abre direto se só um site estiver disponível; senão pergunta qual.
    link.addEventListener('click', (event) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openGame(game);
    });
  }

  const art = document.createElement('div');
  art.className = 'tile-art';
  art.style.setProperty('--tile-color', getTileColor(game, index));

  if (game.icon) {
    // Com um ícone próprio (endereço colado), remove as formas e as iniciais padrão.
    // As partes transparentes de PNG/WebP mostram a cor sólida configurada acima.
    art.classList.add('has-icon');
    const image = document.createElement('img');
    image.src = game.icon;
    image.alt = '';
    image.draggable = false;
    image.loading = 'lazy';
    image.referrerPolicy = 'no-referrer';
    image.addEventListener('error', () => {
      // Ícone quebrado: volta para as iniciais em vez de deixar o quadradinho vazio.
      image.remove();
      art.classList.remove('has-icon');
      art.append(createPlaceholder(game.name));
    }, { once: true });
    art.append(image);
  } else {
    // Sem ícone: aparece o desenho padrão (iniciais). Em paralelo, tenta img/<nome>.png;
    // se o arquivo existir, a imagem toma o lugar do desenho. Se não existir, nada muda.
    const placeholder = createPlaceholder(game.name);
    art.append(placeholder);
    const local = document.createElement('img');
    local.alt = '';
    local.draggable = false;
    local.referrerPolicy = 'no-referrer';
    local.addEventListener('load', () => {
      placeholder.remove();
      art.classList.add('has-icon');
    }, { once: true });
    local.addEventListener('error', () => local.remove(), { once: true });
    local.src = localIconPath(game);
    art.append(local);
  }

  const label = document.createElement('span');
  label.className = 'tile-label';
  label.textContent = game.name;
  link.append(art, label);
  wrapper.append(link);

  const controls = document.createElement('div');
  controls.className = 'tile-actions';

  const edit = document.createElement('button');
  edit.className = 'tile-action edit-button';
  edit.type = 'button';
  edit.textContent = '✎';
  edit.title = `Editar ${game.name}`;
  edit.setAttribute('aria-label', `Editar ${game.name}`);
  edit.addEventListener('click', () => openEditPanel(game.id));
  controls.append(edit);

  const remove = document.createElement('button');
  remove.className = 'tile-action remove-button';
  remove.type = 'button';
  remove.textContent = '×';
  remove.title = `Remover ${game.name}`;
  remove.setAttribute('aria-label', `Remover ${game.name} da coleção`);
  remove.addEventListener('click', () => removeGame(game.id));
  controls.append(remove);

  wrapper.append(controls);
  return wrapper;
}

function createPlaceholder(name) {
  const placeholder = document.createElement('span');
  placeholder.className = 'tile-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.textContent = getInitials(name);
  return placeholder;
}

// Abre o jogo: um site só (ou só um disponível) abre direto; vários, pergunta em qual.
function openGame(game) {
  const available = getAvailableSites(game);
  if (available.length === 0) return;
  if (available.length === 1) {
    window.open(available[0].url, '_blank', 'noopener,noreferrer');
    return;
  }
  chooseGame.textContent = game.name;
  chooseList.replaceChildren();
  for (const site of available) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'more-link';
    link.href = site.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    const text = document.createElement('span');
    text.className = 'more-text';
    const name = document.createElement('span');
    name.className = 'more-name';
    name.textContent = site.name;
    const domain = document.createElement('span');
    domain.className = 'more-domain';
    domain.textContent = getDomain(site.url);
    text.append(name, domain);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    link.append(text, arrow);
    link.addEventListener('click', () => chooseDialog.close()); // o link abre a nova aba sozinho
    item.append(link);
    chooseList.append(item);
  }
  chooseDialog.showModal();
}
chooseDialog.addEventListener('click', (event) => {
  if (event.target === chooseDialog) chooseDialog.close(); // clicar no fundo escuro fecha
});

function renderGames({ animate = false } = {}) {
  const query = normalizeText(searchInput.value.trim());
  visibleGames = games.filter((game) => {
    if (hideBlocked && game.blocked) return false; // "Ocultar bloqueados" ligado
    return normalizeText(game.name).includes(query) ||
      normalizeText(getDomain(game.url)).includes(query);
  });

  // Botão "Ocultar bloqueados": só informa se está ligado.
  hideBlockedToggle.setAttribute('aria-pressed', String(hideBlocked));

  // A animação de entrada só toca na primeira carga, não a cada letra digitada.
  grid.classList.toggle('animate-in', animate);
  grid.replaceChildren();
  const fragment = document.createDocumentFragment();
  visibleGames.forEach((game, index) => fragment.append(createGameCard(game, index)));
  grid.append(fragment);

  gameCount.textContent = visibleGames.length === games.length
    ? String(games.length)
    : `${visibleGames.length} de ${games.length}`;
  updateTileSize(visibleGames.length);

  const isEmpty = visibleGames.length === 0;
  let emptyText = EMPTY_DEFAULT_TEXT;
  if (defaultsFailed && games.length === 0) {
    emptyText = 'Não consegui ler o games.js. Confira se o arquivo existe e se não tem erro de vírgula ou aspas.';
  } else if (hideBlocked && query === '') {
    emptyText = 'Todos os sites da coleção estão marcados como bloqueados e ocultos. Desligue “Ocultar bloqueados” para vê-los.';
  } else if (hideBlocked) {
    emptyText = 'Nenhum resultado entre os sites liberados. Os bloqueados estão ocultos; desligue “Ocultar bloqueados” para incluí-los na busca.';
  }
  emptyState.querySelector('p').textContent = emptyText;
  emptyState.hidden = !isEmpty;
  grid.hidden = isEmpty;
}

// Descobre quantas colunas e que tamanho de quadradinho aproveitam melhor a tela.
// A última fileira é centralizada pelo próprio CSS (flex + justify-content: center).
function updateTileSize(totalTiles) {
  const count = Math.max(totalTiles, 1);

  // A barra de cima é fixa e pode quebrar em duas linhas no celular: mede em vez de chutar.
  const topSpace = Math.ceil(topbar.getBoundingClientRect().bottom + 16);
  document.documentElement.style.setProperty('--topbar-space', `${topSpace}px`);

  const shellStyle = getComputedStyle(pageShell);
  const width = pageShell.clientWidth - parseFloat(shellStyle.paddingLeft) - parseFloat(shellStyle.paddingRight);
  const height = window.innerHeight - topSpace - 24;
  const gap = count > 300 ? 5 : count > 100 ? 7 : count > 40 ? 10 : 14;
  const labelSpace = 32;
  const maxColumns = Math.min(count, 32);

  let bestColumns = 1;
  let bestSize = -Infinity;

  for (let columns = 1; columns <= maxColumns; columns += 1) {
    const rows = Math.ceil(count / columns);
    const sizeByWidth = (width - gap * (columns - 1)) / columns;
    const sizeByHeight = (height - gap * (rows - 1)) / rows - labelSpace;
    const candidateSize = Math.floor(Math.min(MAX_TILE, sizeByWidth, sizeByHeight));
    // ">=": se duas opções empatam, fica a que tem mais colunas (evita empilhar 3 sites numa coluna só).
    if (candidateSize >= bestSize) {
      bestSize = candidateSize;
      bestColumns = columns;
    }
  }

  if (bestSize < MIN_TILE) {
    // Não cabe tudo na tela com tamanho confortável: usa o tamanho mínimo e deixa a página rolar.
    bestColumns = Math.max(1, Math.min(count, Math.floor((width + gap) / (MIN_TILE + gap))));
    bestSize = Math.min(MAX_TILE, Math.floor((width - gap * (bestColumns - 1)) / bestColumns));
  }

  grid.style.setProperty('--columns', String(bestColumns));
  grid.style.setProperty('--tile-size', `${Math.max(bestSize, 52)}px`);
  grid.style.setProperty('--grid-gap', `${gap}px`);
}

// requestAnimationFrame evita recalcular dezenas de vezes enquanto a janela é arrastada.
let resizeFrame = 0;
window.addEventListener('resize', () => {
  cancelAnimationFrame(resizeFrame);
  resizeFrame = requestAnimationFrame(() => updateTileSize(grid.children.length));
});

// Se a barra do topo mudar de altura (quebrou em mais linhas, fonte carregou...), recalcula o espaço dela.
if (typeof ResizeObserver === 'function') {
  new ResizeObserver(() => updateTileSize(grid.children.length)).observe(topbar);
}

// ---------------------------------------------------------------------------
// Painéis e mensagens
// ---------------------------------------------------------------------------
function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.style.color = isError ? '#b42335' : '#1e7549';
}

function showTextMessage(message, isError = false) {
  textMessage.textContent = message;
  textMessage.style.color = isError ? '#b42335' : '#1e7549';
}

function openAddPanel() {
  closeTextPanel();
  editingId = null;
  gameForm.reset();
  resetSitesEditor();
  formTitle.textContent = 'Adicionar um quadradinho';
  formSubmit.innerHTML = 'Adicionar <span aria-hidden="true">↗</span>';
  gameColorInput.value = COLORS[games.length % COLORS.length];
  showFormMessage('');
  addPanel.hidden = false;
  addToggle.setAttribute('aria-expanded', 'true');
  gameNameInput.focus();
}

function openEditPanel(id) {
  const game = games.find((entry) => entry.id === id);
  if (!game) return;
  closeTextPanel();
  editingId = id;
  formTitle.textContent = 'Editar quadradinho';
  formSubmit.textContent = 'Salvar alterações';
  gameNameInput.value = game.name;
  gameUrlInput.value = game.url;
  gameIconInput.value = game.icon || '';
  gameColorInput.value = getTileColor(game, games.indexOf(game));
  gameBlockedInput.checked = Boolean(game.blocked);
  if (isMultiSite(game)) {
    multiInput.checked = true;
    renderSiteRows(game.sites);
    setMultiMode(true);
  } else {
    resetSitesEditor();
  }
  showFormMessage('');
  addPanel.hidden = false;
  addToggle.setAttribute('aria-expanded', 'true');
  gameNameInput.focus();
}

// --- Editor de "mais de um site" dentro do formulário ---
function updateSiteRows() {
  const rows = [...sitesList.children];
  rows.forEach((row, index) => {
    row.querySelector('.site-name').setAttribute('aria-label', `Nome do site ${index + 1}`);
    row.querySelector('.site-url').setAttribute('aria-label', `Endereço do site ${index + 1}`);
    const remove = row.querySelector('.site-remove');
    remove.setAttribute('aria-label', `Remover o site ${index + 1}`);
    remove.disabled = rows.length <= 2; // com "mais de um site", o mínimo são 2
  });
}

function addSiteRow(site = {}) {
  const row = document.createElement('div');
  row.className = 'site-row';

  const name = document.createElement('input');
  name.className = 'site-name';
  name.type = 'text';
  name.maxLength = 64;
  name.required = true;
  name.placeholder = 'Nome do site (ex.: Lemon Web)';
  name.value = site.name || '';

  const url = document.createElement('input');
  url.className = 'site-url';
  url.type = 'url';
  url.required = true;
  url.placeholder = 'https://exemplo.com';
  url.value = site.url || '';

  const blockedLabel = document.createElement('label');
  blockedLabel.className = 'site-blocked';
  const blockedBox = document.createElement('input');
  blockedBox.type = 'checkbox';
  blockedBox.checked = Boolean(site.blocked);
  blockedLabel.append(blockedBox, ' Bloqueado');

  const remove = document.createElement('button');
  remove.className = 'site-remove';
  remove.type = 'button';
  remove.textContent = '×';
  remove.title = 'Remover este site';
  remove.addEventListener('click', () => {
    if (sitesList.children.length <= 2) return;
    row.remove();
    updateSiteRows();
  });

  row.append(name, url, blockedLabel, remove);
  sitesList.append(row);
  updateSiteRows();
  return row;
}

function renderSiteRows(sites) {
  sitesList.replaceChildren();
  sites.forEach((site) => addSiteRow(site));
  while (sitesList.children.length < 2) addSiteRow();
}

function readSiteRows() {
  return [...sitesList.children].map((row) => ({
    name: row.querySelector('.site-name').value,
    url: row.querySelector('.site-url').value,
    blocked: row.querySelector('.site-blocked input').checked
  }));
}

// Liga/desliga o modo "mais de um site": esconde o endereço único e mostra a lista.
function setMultiMode(on) {
  sitesEditor.hidden = !on;
  urlField.hidden = on;
  blockedField.hidden = on;
  gameUrlInput.required = !on; // campo escondido e obrigatório travaria o envio do formulário
}

function resetSitesEditor() {
  multiInput.checked = false;
  sitesList.replaceChildren();
  setMultiMode(false);
}

multiInput.addEventListener('change', () => {
  if (multiInput.checked) {
    // O endereço e o "bloqueado" já digitados viram o primeiro site da lista.
    renderSiteRows([{ name: '', url: gameUrlInput.value.trim(), blocked: gameBlockedInput.checked }]);
    setMultiMode(true);
  } else {
    const [first] = readSiteRows();
    if (first) {
      gameUrlInput.value = first.url;
      gameBlockedInput.checked = first.blocked;
    }
    sitesList.replaceChildren();
    setMultiMode(false);
  }
});

addSiteButton.addEventListener('click', () => {
  addSiteRow().querySelector('.site-name').focus();
});

function closeAddPanel() {
  addPanel.hidden = true;
  addToggle.setAttribute('aria-expanded', 'false');
  editingId = null;
  showFormMessage('');
}

function openTextPanel() {
  closeAddPanel();
  codeEditor.value = gamesAsJavaScript();
  showTextMessage('');
  textPanel.hidden = false;
  textToggle.setAttribute('aria-expanded', 'true');
  codeEditor.focus();
  // Ao focar, o navegador joga o cursor para o fim; volta para o começo da lista.
  codeEditor.setSelectionRange(0, 0);
  codeEditor.scrollTop = 0;
}

function closeTextPanel() {
  textPanel.hidden = true;
  textToggle.setAttribute('aria-expanded', 'false');
  showTextMessage('');
}

function removeGame(id) {
  const game = games.find((entry) => entry.id === id);
  if (!game) return;
  if (!window.confirm(`Remover “${game.name}” da coleção?`)) return;
  const previous = games;
  games = games.filter((entry) => entry.id !== id);
  if (saveGames()) {
    renderGames();
  } else {
    games = previous; // não salvou: desfaz para a tela continuar igual ao que está guardado
    window.alert(SAVE_ERROR);
  }
}

// ---------------------------------------------------------------------------
// Modo texto: a coleção como código
// ---------------------------------------------------------------------------
function gamesAsJavaScript() {
  const defaults = games.map((game, index) => ({
    name: game.name,
    url: game.url,
    icon: game.icon || '',
    color: getTileColor(game, index),
    blocked: Boolean(game.blocked),
    ...(isMultiSite(game) ? { sites: game.sites.map((site) => ({ name: site.name, url: site.url, blocked: site.blocked })) } : {})
  }));
  // JSON é também uma sintaxe válida dentro de uma declaração JavaScript.
  return `const DEFAULT_GAMES = ${JSON.stringify(defaults, null, 2)};`;
}

function readGamesFromCode(source) {
  // Aceita o conteúdo do games.js inteiro: tira as linhas de comentário (// ...) e o "const DEFAULT_GAMES =".
  let text = source.replace(/^\s*\/\/.*$/gm, '').trim();
  text = text.replace(/^(?:(?:const|let|var)\s+)?DEFAULT_GAMES\s*=\s*/, '');
  text = text.replace(/;\s*$/, '');

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(
      'o texto não está no formato certo. Confira se usou aspas duplas ("), vírgulas entre os itens ' +
      `e nenhuma vírgula depois do último. (Detalhe técnico: ${error.message})`
    );
  }
  if (!Array.isArray(parsed)) throw new Error('O conteúdo precisa ser uma lista entre colchetes [ ].');
  if (parsed.length > 2000) throw new Error('A lista está muito grande. O limite é de 2.000 sites.');

  return parsed.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw new Error(`O item ${index + 1} não é um objeto de jogo válido.`);
    }
    const name = typeof entry.name === 'string' ? entry.name.trim() : '';
    if (!name) throw new Error(`O item ${index + 1} precisa ter um nome.`);
    if (name.length > 64) throw new Error(`O nome do item ${index + 1} passa de 64 caracteres.`);
    let url;
    let sites = null;
    if (entry.sites !== undefined) {
      // Jogo com mais de um site: o endereço e o "blocked" do jogo vêm da lista.
      if (!Array.isArray(entry.sites) || entry.sites.length < 2) {
        throw new Error(`O campo "sites" do item ${index + 1} precisa ser uma lista com pelo menos 2 sites.`);
      }
      sites = entry.sites.map((site, siteIndex) => {
        const where = `O site ${siteIndex + 1} do item ${index + 1}`;
        if (!site || typeof site !== 'object' || Array.isArray(site)) throw new Error(`${where} não é um objeto válido.`);
        const siteName = typeof site.name === 'string' ? site.name.trim() : '';
        if (!siteName) throw new Error(`${where} precisa ter um nome.`);
        if (siteName.length > 64) throw new Error(`${where} tem nome com mais de 64 caracteres.`);
        const siteUrl = safeHttpUrl(site.url);
        if (!siteUrl) throw new Error(`${where} precisa ter um endereço começando com http:// ou https://.`);
        if (site.blocked !== undefined && typeof site.blocked !== 'boolean') {
          throw new Error(`O campo "blocked" do site ${siteIndex + 1} do item ${index + 1} precisa ser true ou false (sem aspas).`);
        }
        return { name: siteName, url: siteUrl, blocked: site.blocked === true };
      });
      url = sites[0].url;
    } else {
      url = safeHttpUrl(entry.url);
      if (!url) throw new Error(`O endereço do item ${index + 1} precisa começar com http:// ou https://.`);
    }
    const icon = safeHttpUrl(entry.icon, true);
    if (icon === null) throw new Error(`O ícone do item ${index + 1} precisa ser uma URL válida ou uma string vazia.`);
    const color = normalizeHexColor(entry.color, COLORS[index % COLORS.length]);
    if (!sites && entry.blocked !== undefined && typeof entry.blocked !== 'boolean') {
      throw new Error(`O campo "blocked" do item ${index + 1} precisa ser true ou false (sem aspas).`);
    }
    return {
      id: `text-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      url,
      icon,
      color,
      blocked: sites ? sites.every((site) => site.blocked) : entry.blocked === true,
      ...(sites ? { sites } : {})
    };
  });
}

// ---------------------------------------------------------------------------
// Eventos
// ---------------------------------------------------------------------------
addToggle.addEventListener('click', () => {
  if (addPanel.hidden) openAddPanel();
  else closeAddPanel();
});
closePanel.addEventListener('click', closeAddPanel);
searchInput.addEventListener('input', () => renderGames());

hideBlockedToggle.addEventListener('click', () => {
  hideBlocked = !hideBlocked;
  saveHideBlocked(hideBlocked);
  renderGames();
});

textToggle.addEventListener('click', () => {
  if (textPanel.hidden) openTextPanel();
  else closeTextPanel();
});
closeTextPanelButton.addEventListener('click', closeTextPanel);
closeTextCancelButton.addEventListener('click', closeTextPanel);

copyCodeButton.addEventListener('click', async () => {
  const content = codeEditor.value;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
    } else {
      codeEditor.focus();
      codeEditor.select();
      const copied = document.execCommand('copy');
      if (!copied) throw new Error('O navegador não permitiu copiar automaticamente. Selecione o texto e copie com Ctrl+C.');
    }
    showTextMessage('Código copiado. Cole no games.js, substituindo todo o conteúdo do arquivo.');
  } catch (error) {
    codeEditor.focus();
    codeEditor.select();
    showTextMessage(error.message || 'Não consegui copiar automaticamente. Selecione o texto e pressione Ctrl+C.', true);
  }
});

applyCodeButton.addEventListener('click', () => {
  let updatedGames;
  try {
    updatedGames = readGamesFromCode(codeEditor.value);
  } catch (error) {
    showTextMessage(`Não foi possível aplicar: ${error.message}`, true);
    return;
  }

  const previous = games;
  games = updatedGames;
  if (!saveGames()) {
    games = previous;
    showTextMessage('Não consegui salvar a coleção neste navegador. Confira as permissões de armazenamento.', true);
    return;
  }
  searchInput.value = '';
  renderGames({ animate: true });
  codeEditor.value = gamesAsJavaScript();
  showTextMessage(`Alterações aplicadas: ${games.length} quadradinho(s) na coleção deste navegador.`);
});

codeEditor.addEventListener('input', () => showTextMessage(''));

gameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = gameNameInput.value.trim();
  const iconInput = gameIconInput.value.trim();
  const icon = safeHttpUrl(iconInput, true);
  const color = normalizeHexColor(gameColorInput.value, COLORS[games.length % COLORS.length]);

  if (!name) return showFormMessage('Digite um nome para o site.', true);
  if (name.length > 64) return showFormMessage('O nome pode ter no máximo 64 caracteres.', true);
  if (icon === null) return showFormMessage('O endereço do ícone precisa ser uma URL válida ou ficar vazio.', true);

  let url;
  let blocked;
  let sites = null; // só existe quando "mais de um site" está marcado
  if (multiInput.checked) {
    const rows = readSiteRows();
    if (rows.length < 2) return showFormMessage('Coloque pelo menos dois sites ou desmarque “mais de um site”.', true);
    const seen = new Set();
    sites = [];
    for (const [index, row] of rows.entries()) {
      const siteName = row.name.trim();
      const siteUrl = safeHttpUrl(row.url);
      if (!siteName) return showFormMessage(`Digite o nome do site ${index + 1}.`, true);
      if (siteName.length > 64) return showFormMessage(`O nome do site ${index + 1} passa de 64 caracteres.`, true);
      if (!siteUrl) return showFormMessage(`O endereço do site ${index + 1} precisa começar com http:// ou https://.`, true);
      if (seen.has(urlKey(siteUrl))) return showFormMessage(`O site ${index + 1} repete um endereço já usado neste jogo.`, true);
      seen.add(urlKey(siteUrl));
      sites.push({ name: siteName, url: siteUrl, blocked: row.blocked });
    }
    url = sites[0].url;
    blocked = sites.every((site) => site.blocked);
  } else {
    url = safeHttpUrl(gameUrlInput.value);
    if (!url) return showFormMessage('Digite um endereço válido começando com http:// ou https://.', true);
    blocked = gameBlockedInput.checked;
  }

  const normalizedName = name.toLocaleLowerCase('pt-BR');
  const newKeys = (sites || [{ url }]).map((site) => urlKey(site.url));
  const duplicate = games.some((game) => {
    if (editingId && game.id === editingId) return false;
    return game.name.toLocaleLowerCase('pt-BR') === normalizedName ||
      getGameSites(game).some((site) => newKeys.includes(urlKey(site.url)));
  });
  if (duplicate) return showFormMessage('Esse nome ou endereço já está na coleção.', true);

  const previous = games;
  const sitesPart = sites ? { sites } : {};

  if (editingId) {
    const index = games.findIndex((game) => game.id === editingId);
    if (index < 0) return showFormMessage('Este quadradinho não foi encontrado. Feche e tente novamente.', true);
    games = games.map((game, i) => {
      if (i !== index) return game;
      const { sites: oldSites, ...rest } = game; // tira os sites antigos; os novos (se houver) entram abaixo
      return { ...rest, name, url, icon, color, blocked, ...sitesPart };
    });
    if (!saveGames()) {
      games = previous;
      return showFormMessage(SAVE_ERROR, true);
    }
    renderGames();
    closeAddPanel();
    return;
  }

  games = [...games, {
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    url,
    icon,
    color,
    blocked,
    ...sitesPart
  }];
  if (!saveGames()) {
    games = previous;
    return showFormMessage(SAVE_ERROR, true);
  }
  gameForm.reset();
  resetSitesEditor();
  gameColorInput.value = COLORS[games.length % COLORS.length];
  searchInput.value = '';
  renderGames();
  showFormMessage(blocked && hideBlocked
    ? 'Salvo! Como o site é bloqueado, ele fica oculto enquanto “Ocultar bloqueados” estiver ligado.'
    : 'Quadradinho adicionado e salvo neste navegador!');
  gameNameInput.focus();
});

resetButton.addEventListener('click', () => {
  if (typeof resetDialog.showModal === 'function') resetDialog.showModal();
  else if (window.confirm('Apagar as alterações locais e restaurar a coleção inicial?')) resetCollection();
});
confirmReset.addEventListener('click', (event) => {
  event.preventDefault();
  resetCollection();
  resetDialog.close();
});

function resetCollection() {
  games = loadDefaultGames();
  try { localStorage.removeItem(STORAGE_KEY); }
  catch (error) { console.warn('Não foi possível limpar a coleção salva:', error); }
  searchInput.value = '';
  renderGames({ animate: true });
  closeAddPanel();
  closeTextPanel();
}

// ---------------------------------------------------------------------------
// Reordenar arrastando (e, no teclado, Shift + setas)
// ---------------------------------------------------------------------------
let draggedId = null;
let dropMark = null; // { element, after }: em qual quadradinho o traço amarelo está aparecendo

function clearDropMark() {
  if (dropMark) dropMark.element.classList.remove('drop-before', 'drop-after');
  dropMark = null;
}

// Põe o jogo "id" antes (after = false) ou depois (after = true) do jogo "targetId".
// Funciona mesmo com a busca ou o "Ocultar bloqueados" ligados, porque mexe na lista inteira.
// Devolve true se a ordem mudou.
function moveGame(id, targetId, after) {
  if (id === targetId) return false;
  const next = games.filter((game) => game.id !== id);
  const moving = games.find((game) => game.id === id);
  const targetIndex = next.findIndex((game) => game.id === targetId);
  if (!moving || targetIndex < 0) return false;
  next.splice(targetIndex + (after ? 1 : 0), 0, moving);
  if (next.every((game, index) => game === games[index])) return false; // caiu no mesmo lugar

  const previous = games;
  games = next;
  if (!saveGames()) {
    games = previous;
    window.alert(SAVE_ERROR);
    return false;
  }
  renderGames();
  return true;
}

function cardFromEvent(event) {
  return event.target instanceof Element ? event.target.closest('.game-card-wrap') : null;
}

grid.addEventListener('dragstart', (event) => {
  const card = cardFromEvent(event);
  if (!card) return;
  draggedId = card.dataset.id;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', draggedId); // o Firefox só começa a arrastar se houver algum dado
  card.classList.add('dragging');
});

grid.addEventListener('dragover', (event) => {
  if (!draggedId) return;
  const card = cardFromEvent(event);
  if (!card || card.dataset.id === draggedId) { clearDropMark(); return; }
  event.preventDefault(); // sem isso o navegador não deixa soltar aqui
  event.dataTransfer.dropEffect = 'move';
  const box = card.getBoundingClientRect();
  const after = event.clientX > box.left + box.width / 2; // metade direita = depois; esquerda = antes
  if (!dropMark || dropMark.element !== card || dropMark.after !== after) {
    clearDropMark();
    card.classList.add(after ? 'drop-after' : 'drop-before');
    dropMark = { element: card, after };
  }
});

grid.addEventListener('drop', (event) => {
  if (!draggedId || !dropMark) return;
  event.preventDefault();
  const { element, after } = dropMark;
  const id = draggedId;
  clearDropMark();
  draggedId = null; // o quadradinho é recriado em renderGames, então o "dragend" não chega aqui
  moveGame(id, element.dataset.id, after);
});

// Soltou fora de qualquer quadradinho, ou apertou Esc: limpa tudo.
grid.addEventListener('dragend', () => {
  draggedId = null;
  clearDropMark();
  grid.querySelectorAll('.dragging').forEach((card) => card.classList.remove('dragging'));
});

// Teclado: com um quadradinho em foco, Shift + seta esquerda/direita move uma casa.
grid.addEventListener('keydown', (event) => {
  if (!event.shiftKey || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return;
  const card = cardFromEvent(event);
  if (!card) return;
  const cards = [...grid.children];
  const toRight = event.key === 'ArrowRight';
  const neighbor = cards[cards.indexOf(card) + (toRight ? 1 : -1)];
  if (!neighbor) return;
  event.preventDefault();
  const id = card.dataset.id;
  if (moveGame(id, neighbor.dataset.id, toRight)) {
    const moved = [...grid.children].find((item) => item.dataset.id === id);
    if (moved) moved.querySelector('.game-card').focus(); // o quadradinho foi recriado: devolve o foco
  }
});

// ---------------------------------------------------------------------------
// Janela "Mais jogos" (os links ficam no arquivo links.js)
// ---------------------------------------------------------------------------
function getMoreSites() {
  const list = typeof MORE_GAMES_SITES !== 'undefined' && Array.isArray(MORE_GAMES_SITES) ? MORE_GAMES_SITES : [];
  return list
    .map((site) => ({
      name: site && typeof site.name === 'string' ? site.name.trim() : '',
      url: site ? safeHttpUrl(site.url) : null,
      description: site && typeof site.description === 'string' ? site.description.trim() : ''
    }))
    .filter((site) => site.name && site.url);
}

function renderMoreSites() {
  moreList.replaceChildren();
  const sites = getMoreSites();
  if (sites.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'more-empty';
    empty.textContent = 'Ainda não há links aqui. Adicione no arquivo links.js.';
    moreList.append(empty);
    return;
  }
  for (const site of sites) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'more-link';
    link.href = site.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const text = document.createElement('span');
    text.className = 'more-text';
    const name = document.createElement('span');
    name.className = 'more-name';
    name.textContent = site.name;
    const detail = document.createElement('span');
    detail.className = 'more-domain';
    detail.textContent = site.description || getDomain(site.url);
    text.append(name, detail);

    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';

    link.append(text, arrow);
    item.append(link);
    moreList.append(item);
  }
}

moreToggle.addEventListener('click', () => {
  renderMoreSites();
  moreDialog.showModal();
});
// Clicar fora da janela (no fundo escuro) também fecha.
moreDialog.addEventListener('click', (event) => {
  if (event.target === moreDialog) moreDialog.close();
});

// Atalhos de teclado: "/" vai para a busca, Esc fecha painéis, Enter na busca abre o primeiro resultado.
document.addEventListener('keydown', (event) => {
  if (resetDialog.open || moreDialog.open || chooseDialog.open) return; // o próprio <dialog> já fecha com Esc

  if (event.key === 'Escape') {
    if (!addPanel.hidden) { closeAddPanel(); addToggle.focus(); }
    else if (!textPanel.hidden) { closeTextPanel(); textToggle.focus(); }
    return;
  }

  const target = event.target;
  const isTyping = target instanceof HTMLElement && target.matches('input, textarea, select, [contenteditable]');
  if (event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey) {
    event.preventDefault();
    searchInput.focus();
  }
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && searchInput.value.trim() && visibleGames[0]) {
    openGame(visibleGames[0]);
  } else if (event.key === 'Escape' && searchInput.value) {
    // Primeiro Esc limpa a busca; o segundo (já vazia) fecha painéis.
    searchInput.value = '';
    renderGames();
    event.stopPropagation();
  }
});

renderGames({ animate: true });
