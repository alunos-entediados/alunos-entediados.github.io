'use strict';

const STORAGE_KEY = 'meu-friv-retro-games-v1';

// ---------------------------------------------------------------------------
// Configurações fáceis de mudar
// ---------------------------------------------------------------------------
// true  = sites sem ícone próprio mostram o ícone (favicon) do próprio site,
//         buscado no serviço gratuito de favicons do Google.
//         Atenção: o navegador envia o domínio de cada site para o Google.
// false = nunca busca nada de fora; mostra só as iniciais do nome.
const AUTO_ICONS = true;
const FAVICON_URL = 'https://www.google.com/s2/favicons?sz=128&domain=';

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
const iconHelp = document.querySelector('#icon-help');
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
const resetButton = document.querySelector('#reset-button');
const confirmReset = document.querySelector('#confirm-reset');
const hideBlockedToggle = document.querySelector('#hide-blocked-toggle');
const gameBlockedInput = document.querySelector('#game-blocked');
const EMPTY_DEFAULT_TEXT = emptyState.querySelector('p').textContent;

let editingId = null;
let games = loadGames();
let hideBlocked = loadHideBlocked();
let visibleGames = []; // o que está aparecendo agora (depende da busca)

iconHelp.textContent = AUTO_ICONS
  ? 'Em branco usa o ícone do próprio site. Escreva imglocal para usar img/NOME DO JOGO.png.'
  : 'Sem ícone, mostra as iniciais. Escreva imglocal para usar img/NOME DO JOGO.png.';

// ---------------------------------------------------------------------------
// Dados: carregar, salvar e validar
// ---------------------------------------------------------------------------
function isValidGame(game) {
  return Boolean(game && typeof game.name === 'string' && typeof game.url === 'string');
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

function normalizeLoadedGame(game, index, prefix = 'default') {
  return {
    id: typeof game.id === 'string' && game.id ? game.id : `${prefix}-${index + 1}`,
    name: game.name,
    url: game.url,
    icon: typeof game.icon === 'string' ? game.icon : '',
    color: getTileColor(game, index),
    blocked: typeof game.blocked === 'boolean' ? game.blocked : legacyBlocked(game.url)
  };
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

// Escrever "imglocal" no campo do ícone usa a imagem img/<nome do jogo>.png da pasta do projeto.
const LOCAL_ICON_WORD = 'imglocal';
function isLocalIcon(value) {
  return String(value || '').trim().toLowerCase() === LOCAL_ICON_WORD;
}
function localIconPath(game) {
  return `img/${encodeURIComponent(game.name.trim())}.png`;
}
// Valida o campo do ícone: "" (vazio), "imglocal" ou um endereço http(s). Devolve null se for inválido.
function parseIconValue(value) {
  if (isLocalIcon(value)) return LOCAL_ICON_WORD;
  return safeHttpUrl(value, true);
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

  const link = document.createElement('a');
  link.className = 'game-card';
  link.href = game.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.title = `${game.name} — ${getDomain(game.url)}`;
  link.setAttribute('aria-label', `Abrir ${game.name} em uma nova aba`);

  const art = document.createElement('div');
  art.className = 'tile-art';
  art.style.setProperty('--tile-color', getTileColor(game, index));

  if (game.icon) {
    // Com um ícone próprio, remove as formas e as iniciais padrão.
    // As partes transparentes de PNG/WebP mostram a cor sólida configurada acima.
    art.classList.add('has-icon');
    const image = document.createElement('img');
    image.src = isLocalIcon(game.icon) ? localIconPath(game) : game.icon;
    image.alt = '';
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
    // As iniciais aparecem na hora; se o ícone do site carregar, ele toma o lugar delas.
    art.append(createPlaceholder(game.name));
    if (AUTO_ICONS) art.append(createAutoIcon(game, art));
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

// Ícone automático: fica invisível até a imagem carregar de verdade.
// Se der erro (site sem ícone, sem internet...), as iniciais continuam lá.
function createAutoIcon(game, art) {
  const badge = document.createElement('span');
  badge.className = 'tile-favicon';
  badge.setAttribute('aria-hidden', 'true');

  const image = document.createElement('img');
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  image.referrerPolicy = 'no-referrer';
  image.addEventListener('load', () => {
    // Ícones minúsculos (16–32px) ficam melhores ampliados "em pixels" — combina com o tema retrô.
    if (image.naturalWidth < 48) badge.classList.add('is-small');
    art.classList.add('favicon-ready');
  }, { once: true });
  image.addEventListener('error', () => badge.remove(), { once: true });
  image.src = FAVICON_URL + encodeURIComponent(getDomain(game.url));

  badge.append(image);
  return badge;
}

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
  showFormMessage('');
  addPanel.hidden = false;
  addToggle.setAttribute('aria-expanded', 'true');
  gameNameInput.focus();
}

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
    blocked: Boolean(game.blocked)
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
    const url = safeHttpUrl(entry.url);
    if (!url) throw new Error(`O endereço do item ${index + 1} precisa começar com http:// ou https://.`);
    const icon = parseIconValue(entry.icon);
    if (icon === null) throw new Error(`O ícone do item ${index + 1} precisa ser uma URL válida, \"imglocal\" ou ficar vazio.`);
    const color = normalizeHexColor(entry.color, COLORS[index % COLORS.length]);
    if (entry.blocked !== undefined && typeof entry.blocked !== 'boolean') {
      throw new Error(`O campo "blocked" do item ${index + 1} precisa ser true ou false (sem aspas).`);
    }
    return {
      id: `text-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      url,
      icon,
      color,
      blocked: entry.blocked === true
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
  const url = safeHttpUrl(gameUrlInput.value);
  const iconInput = gameIconInput.value.trim();
  const icon = parseIconValue(iconInput);
  const color = normalizeHexColor(gameColorInput.value, COLORS[games.length % COLORS.length]);
  const blocked = gameBlockedInput.checked;

  if (!name) return showFormMessage('Digite um nome para o site.', true);
  if (name.length > 64) return showFormMessage('O nome pode ter no máximo 64 caracteres.', true);
  if (!url) return showFormMessage('Digite um endereço válido começando com http:// ou https://.', true);
  if (icon === null) return showFormMessage('O ícone precisa ser um endereço válido, a palavra imglocal, ou ficar vazio.', true);

  const normalizedName = name.toLocaleLowerCase('pt-BR');
  const normalizedUrl = url.replace(/\/$/, '').toLocaleLowerCase('pt-BR');
  const duplicate = games.some((game) => {
    if (editingId && game.id === editingId) return false;
    return game.name.toLocaleLowerCase('pt-BR') === normalizedName ||
      game.url.replace(/\/$/, '').toLocaleLowerCase('pt-BR') === normalizedUrl;
  });
  if (duplicate) return showFormMessage('Esse nome ou endereço já está na coleção.', true);

  const previous = games;

  if (editingId) {
    const index = games.findIndex((game) => game.id === editingId);
    if (index < 0) return showFormMessage('Este quadradinho não foi encontrado. Feche e tente novamente.', true);
    games = games.map((game, i) => (i === index ? { ...game, name, url, icon, color, blocked } : game));
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
    blocked
  }];
  if (!saveGames()) {
    games = previous;
    return showFormMessage(SAVE_ERROR, true);
  }
  gameForm.reset();
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

// Atalhos de teclado: "/" vai para a busca, Esc fecha painéis, Enter na busca abre o primeiro resultado.
document.addEventListener('keydown', (event) => {
  if (resetDialog.open) return; // o próprio <dialog> já fecha com Esc

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
    window.open(visibleGames[0].url, '_blank', 'noopener,noreferrer');
  } else if (event.key === 'Escape' && searchInput.value) {
    // Primeiro Esc limpa a busca; o segundo (já vazia) fecha painéis.
    searchInput.value = '';
    renderGames();
    event.stopPropagation();
  }
});

renderGames({ animate: true });
