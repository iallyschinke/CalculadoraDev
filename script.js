// Esse bloco de código é responsável por controlar a lógica da calculadora
// Ele lida com a entrada do usuário, atualiza o display e realiza os cálculos
const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let currentValue = "";
let lastValue = "";
let justCalculated = false;

// Função para atualizar o display da calculadora com o valor atual.
// Se o valor for vazio, exibe o "0".
function updateDisplay(value) {
  display.textContent = value || "0";
}

// Função para limpar todos os valores e resetar a calculadora
function clearAll() {
  currentValue = "";
  lastValue = "";
  justCalculated = false;
  updateDisplay("0");
}

// Função para deletar o último caractere digitado.
// Se a última ação foi um cálculo, limpo tudo.
function deleteLast() {
  if (justCalculated) {
    clearAll();
    return;
  }
  currentValue = currentValue.slice(0, -1);
  updateDisplay(currentValue || "0");
}

// Função para adicionar um número ou ponto ao valor atual
function appendValue(value) {
  if (justCalculated && /[0-9.]/.test(value)) {
    currentValue = "";
    justCalculated = false;
  }

  if (value === ".") {
    if (currentValue === "") {
      currentValue = "0";
    } else if (!currentValue.includes(".")) {
      currentValue += ".";
    }
    updateDisplay(currentValue);
    return;
  }

  if (/[0-9]/.test(value)) {
    currentValue += value;
    updateDisplay(currentValue);
  }
}

// Função para adicionar um operador a expressão atual. +, -, *, /
function appendOperator(operator) {
  if (!currentValue && !lastValue) {
    return;
  }

  if (justCalculated) {
    justCalculated = false;
  }

  if (/[+\-*]$/.test(lastValue) && !currentValue) {
    lastValue = lastValue.slice(0, -1) + operator;
    return;
  }

  if (currentValue) {
    lastValue += currentValue;
    currentValue = "";
  }
  lastValue += operator;
  updateDisplay(operator);
}

// Função para calcular o resultado da expressão atual.
function calculateResult() {
  if (!currentValue && !lastValue) {
    return;
  }

  lastValue += currentValue;
  let result = "";

  try {
    result = eval(lastValue.replace(/÷/g, "/"));
    if (result === Infinity || Number.isNaN(result)) {
      result = "Erro";
    } else {
      result = Number(result.toFixed(12)).toString();
    }
  } catch {
    result = "Erro";
  }
  updateDisplay(result);
  currentValue = result === "Erro" ? "" : result;
  lastValue = "";
  justCalculated = true;
}

// Adicionar um event listener a cada botão da calculadora para
// lidar com os cliques do usuário.
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
      clearAll();
      return;
    }

    if (action === "delete") {
      deleteLast();
      return;
    }

    if (action === "calculate") {
      calculateResult();
    }

    if (button.classList.contains("operator")) {
      appendOperator(value);
      return;
    }

    appendValue(value);
  });
});
