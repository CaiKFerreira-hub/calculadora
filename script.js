document.addEventListener('DOMContentLoaded', () => {
  const tela = document.querySelector('.tela');
  const btnLiga = document.querySelector('#liga');
  const btnDesliga = document.querySelector('#desliga');
  const botoesNumeros = document.querySelectorAll('.botoes_numeros button');
  
  // Operadores
  const btnSomar = document.querySelector('#somar');
  const btnSubtrair = document.querySelector('#subtrair');
  const btnMultiplicar = document.querySelector('#multiplicar');
  const btnDividir = document.querySelector('#dividir');
  const btnIgual = document.querySelector('#igual');
  const btnPorcento = document.querySelector('#porcento');
  const btnRaiz = document.querySelector('#raiz');
  const btnCe = document.querySelector('#ce');
  
  // Memória
  const btnMmais = document.querySelector('#mmais');
  const btnMmenos = document.querySelector('#mmenos');
  const btnMr = document.querySelector('#mr');
  const btnMc = document.querySelector('#mc');
  
  if (!tela || !btnLiga) return;
  
  let ligada = false;
  let valorAtual = '';
  let valorAnterior = '';
  let operacao = null;
  let novoNumero = true;
  let memoria = 0;
  
  function atualizarEstado() {
    const botoesBloqueados = [
      ...botoesNumeros,
      btnSomar, btnSubtrair, btnMultiplicar, btnDividir, 
      btnIgual, btnPorcento, btnRaiz, btnCe,
      btnMmais, btnMmenos, btnMr, btnMc
    ];
    botoesBloqueados.forEach(botao => {
      if (botao) botao = !ligada; //.disabled
    });
    
  }
  
  function atualizarTela() {
    tela.value = valorAtual || '';
  }
  
  function calcular() {
    const anterior = parseFloat(valorAnterior.replace(',', '.'));
    const atual = parseFloat(valorAtual.replace(',', '.'));
    
    if (isNaN(anterior) || isNaN(atual)) return;
    
    let resultado = 0;
    switch(operacao) {
      case '+': resultado = anterior + atual; break;
      case '-': resultado = anterior - atual; break;
      case '×': resultado = anterior * atual; break;
      case '÷': 
        if (atual === 0) {
          valorAtual = 'Erro';
          operacao = null;
          valorAnterior = '';
          novoNumero = true;
          return;
        }
        resultado = anterior / atual; 
        break;
    }
    
    valorAtual = resultado.toString().replace('.', ',');
    operacao = null;
    valorAnterior = '';
    novoNumero = true;
  }
  
  // ON/AC liga
  btnLiga.addEventListener('click', () => {
    ligada = true;
    valorAtual = '0';
    valorAnterior = '';
    operacao = null;
    novoNumero = true;
    atualizarTela();
    atualizarEstado();
  });
  
  // F desliga
  btnDesliga.addEventListener('click', () => {
    ligada = false;
    valorAtual = '';
    valorAnterior = '';
    operacao = null;
    novoNumero = true;
    console.log('CLICOU NO OFF');
    atualizarTela();
    atualizarEstado();
  });
  
  // Números 0-9, A, virgula
  botoesNumeros.forEach(botao => {
    botao.addEventListener('click', () => {
      if (!ligada) return;
      
      const valor = botao.textContent;
      
      if (valor === 'A') {
        valorAtual = '0';
        valorAnterior = '';
        operacao = null;
        novoNumero = true;
      } else if (valor === ',') {
        if (novoNumero) {
          valorAtual = '0,';
          novoNumero = false;
        } else if (!valorAtual.includes(',')) {
          valorAtual += ',';
        }
      } else {
        if (novoNumero || valorAtual === '0') {
          valorAtual = valor;
          novoNumero = false;
        } else if (valorAtual.length < 12) {
          valorAtual += valor;
        }
      }
      
      atualizarTela();
    });
  });
  
  // Operações +, -, ×, ÷
  function clicarOperador(op) {
    if (!ligada || valorAtual === 'Erro') return;
    
    if (operacao !== null && !novoNumero) {
      calcular();
    }
    
    valorAnterior = valorAtual;
    operacao = op;
    novoNumero = true;
  }
  
  btnSomar?.addEventListener('click', () => clicarOperador('+'));
  btnSubtrair?.addEventListener('click', () => clicarOperador('-'));
  btnMultiplicar?.addEventListener('click', () => clicarOperador('×'));
  btnDividir?.addEventListener('click', () => clicarOperador('÷'));
  
  // Igual
  btnIgual?.addEventListener('click', () => {
    if (!ligada || operacao === null) return;
    calcular();
    atualizarTela();
  });
  
  // CE - Apaga último dígito
  btnCe?.addEventListener('click', () => {
    if (!ligada || novoNumero) return;
    
    if (valorAtual.length > 1) {
      valorAtual = valorAtual.slice(0, -1);
    } else {
      valorAtual = '0';
      novoNumero = true;
    }
    atualizarTela();
  });
  
  // Porcentagem
  btnPorcento?.addEventListener('click', () => {
    if (!ligada) return;
    const atual = parseFloat(valorAtual.replace(',', '.'));
    const resultado = atual / 100;
    valorAtual = resultado.toString().replace('.', ',');
    novoNumero = true;
    atualizarTela();
  });
  
  // Raiz quadrada
  btnRaiz?.addEventListener('click', () => {
    if (!ligada) return;
    const atual = parseFloat(valorAtual.replace(',', '.'));
    if (atual < 0) {
      valorAtual = 'Erro';
    } else {
      const resultado = Math.sqrt(atual);
      valorAtual = resultado.toString().replace('.', ',');
    }
    novoNumero = true;
    atualizarTela();
  });
  
  // Memória
  btnMmais?.addEventListener('click', () => {
    if (!ligada) return;
    memoria += parseFloat(valorAtual.replace(',', '.')) || 0;
  });
  
  btnMmenos?.addEventListener('click', () => {
    if (!ligada) return;
    memoria -= parseFloat(valorAtual.replace(',', '.')) || 0;
  });
  
  btnMr?.addEventListener('click', () => {
    if (!ligada) return;
    valorAtual = memoria.toString().replace('.', ',');
    novoNumero = true;
    atualizarTela();
  });
  
  btnMc?.addEventListener('click', () => {
    if (!ligada) return;
    memoria = 0;
  });
  
  atualizarEstado();
  atualizarTela();
});