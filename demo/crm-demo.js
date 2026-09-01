const COLUMNS = [
  { title: 'Prospecção', cards: [
    { name: 'Clínica Aurora Estética', value: 'R$ 1.590', meta: 'Estética · Florianópolis', color: '#4ADE80',
      note: 'Primeira apresentação enviada há 3 dias. Aguardando retorno sobre horário de reunião.' },
    { name: 'Mercado Dois Irmãos', value: 'R$ 890', meta: 'Varejo local · Curitiba', color: '#86EFAC',
      note: 'Contato feito via indicação. Interesse em automação de pedidos por WhatsApp.' },
  ]},
  { title: 'Reunião agendada', cards: [
    { name: 'Studio Fit Pro', value: 'R$ 2.100', meta: 'Fitness · Blumenau', color: '#22C55E',
      note: 'Reunião marcada pra quinta-feira, 15h. Foco: painel de gestão de matrículas.' },
    { name: 'Odonto Vitalle', value: 'R$ 1.590', meta: 'Odontologia · Joinville', color: '#16A34A',
      note: 'Segunda reunião de descoberta concluída. Escopo em definição.' },
  ]},
  { title: 'Proposta enviada', cards: [
    { name: 'Grupo Bella Vitta', value: 'R$ 3.450', meta: 'Estética avançada · Floripa', color: '#4ADE80',
      note: 'Proposta enviada com prazo de 3 dias. Sinal quente, perguntou sobre parcelamento.' },
  ]},
  { title: 'Fechado', cards: [
    { name: 'Padaria Bom Trigo', value: 'R$ 1.290', meta: 'Alimentação · Florianópolis', color: '#22C55E',
      note: 'Contrato assinado. Início de implementação na próxima semana.' },
    { name: 'Escritório JM Advocacia', value: 'R$ 1.590', meta: 'Jurídico · Curitiba', color: '#86EFAC',
      note: 'Site + automação de agendamento entregues. Cliente satisfeito, pediu indicação.' },
  ]},
];

const board = document.getElementById('board');
const detail = document.getElementById('detail');
const detailTitle = document.getElementById('detail-title');
const detailNote = document.getElementById('detail-note');
let activeCard = null;

function initials(name){
  return name.split(' ').filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();
}

COLUMNS.forEach(col => {
  const colEl = document.createElement('div');
  colEl.className = 'column';
  colEl.innerHTML = `<div class="column-head"><span>${col.title}</span><span class="column-count">${col.cards.length}</span></div>`;

  col.cards.forEach(c => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.innerHTML = `
      <div class="card-top">
        <div class="avatar" style="background:${c.color}">${initials(c.name)}</div>
        <div class="card-name">${c.name}</div>
      </div>
      <div class="card-meta"><span>${c.meta}</span><span class="card-value">${c.value}</span></div>
    `;
    cardEl.addEventListener('click', () => {
      if (activeCard) activeCard.classList.remove('active');
      cardEl.classList.add('active');
      activeCard = cardEl;
      detailTitle.textContent = c.name;
      detailNote.textContent = c.note;
      detail.classList.add('show');
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    colEl.appendChild(cardEl);
  });

  board.appendChild(colEl);
});

document.getElementById('detail-close').addEventListener('click', () => {
  detail.classList.remove('show');
  if (activeCard) activeCard.classList.remove('active');
  activeCard = null;
});
