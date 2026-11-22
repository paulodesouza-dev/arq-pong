// Banco de perguntas baseado na Aula 13 (Tópicos de Arquitetura Computacional)
// e nos 16 termos da atividade: CPU, ULA, UC, registradores, RAM, ROM, EEPROM,
// Flash, cache, memória de massa, DMA, address bus, data bus, microcontrolador,
// dual core e quad core.
// Cada pergunta tem 3 opções, o índice da correta e uma explicação.
const QUESTIONS = [
  // ---------- Microprocessador x microcontrolador ----------
  {
    topic: "Microprocessador x Microcontrolador",
    q: "Chip que reúne CPU, memória e periféricos de entrada/saída em um único circuito:",
    options: ["Microcontrolador", "Microprocessador", "Memória de massa"],
    answer: 0,
    explain: "O microcontrolador é um 'computador em um chip': CPU, memórias (Flash, RAM, EEPROM) e E/S no mesmo circuito."
  },
  {
    topic: "Microprocessador x Microcontrolador",
    q: "Um microprocessador, sozinho, consegue funcionar como computador completo?",
    options: [
      "Sim, ele já tem memória e periféricos embutidos",
      "Não, ele precisa de memória e dispositivos de E/S externos",
      "Sim, desde que seja quad core"
    ],
    answer: 1,
    explain: "O microprocessador é basicamente a CPU. Para funcionar, depende de RAM, armazenamento e periféricos ligados a ele pelos barramentos."
  },
  {
    topic: "Microprocessador x Microcontrolador",
    q: "Qual é um uso típico de um microcontrolador?",
    options: [
      "Rodar um sistema operacional completo em um notebook",
      "Controlar uma tarefa específica, como um sensor ou um eletrodoméstico",
      "Processar gráficos 3D em um computador gamer"
    ],
    answer: 1,
    explain: "Microcontroladores são usados em sistemas embarcados: dedicados a uma tarefa, com baixo custo e baixo consumo de energia."
  },
  {
    topic: "Microprocessador x Microcontrolador",
    q: "Comparado ao microprocessador de um PC, o microcontrolador costuma ter:",
    options: [
      "Mais desempenho e maior consumo de energia",
      "Menor custo, menor consumo e menos poder de processamento",
      "Mais memória RAM e mais núcleos"
    ],
    answer: 1,
    explain: "O microcontrolador prioriza custo e eficiência energética; o microprocessador prioriza desempenho."
  },

  // ---------- Arduino ----------
  {
    topic: "Arquitetura do Arduino",
    q: "O Arduino Uno é baseado em qual tipo de componente?",
    options: ["Um microprocessador quad core", "Um microcontrolador (ATmega328P)", "Uma memória cache"],
    answer: 1,
    explain: "O coração do Arduino Uno é o ATmega328P, um microcontrolador com CPU, Flash, SRAM e EEPROM no mesmo chip."
  },
  {
    topic: "Arquitetura do Arduino",
    q: "No Arduino, em qual memória fica gravado o programa (sketch) enviado pelo computador?",
    options: ["Flash", "RAM (SRAM)", "Cache"],
    answer: 0,
    explain: "O sketch fica na memória Flash, que é não volátil: o programa continua lá mesmo sem energia."
  },
  {
    topic: "Arquitetura do Arduino",
    q: "No Arduino, as variáveis usadas enquanto o programa roda ficam em qual memória?",
    options: ["EEPROM", "Flash", "RAM (SRAM)"],
    answer: 2,
    explain: "A SRAM é a RAM do Arduino: volátil, guarda as variáveis durante a execução e perde tudo ao desligar."
  },
  {
    topic: "Arquitetura do Arduino",
    q: "Qual memória do Arduino guarda pequenos dados do usuário (como configurações) mesmo sem energia?",
    options: ["EEPROM", "SRAM", "Registradores"],
    answer: 0,
    explain: "A EEPROM é não volátil e pode ser lida e gravada pelo próprio programa, ideal para guardar configurações."
  },
  {
    topic: "Arquitetura do Arduino",
    q: "Os pinos digitais e analógicos do Arduino servem para:",
    options: [
      "Aumentar a memória cache",
      "Fazer a entrada e saída de sinais, ligando sensores, LEDs e motores",
      "Conectar um segundo núcleo ao processador"
    ],
    answer: 1,
    explain: "Os pinos são a interface de E/S do microcontrolador com o mundo físico."
  },

  // ---------- CPU: UC, ULA e registradores ----------
  {
    topic: "CPU",
    q: "Quais são os três componentes principais da CPU?",
    options: [
      "UC, ULA e registradores",
      "RAM, ROM e Flash",
      "Address bus, data bus e cache"
    ],
    answer: 0,
    explain: "A CPU é formada pela Unidade de Controle (UC), pela ULA e pelos registradores."
  },
  {
    topic: "CPU",
    q: "Parte da CPU que faz as contas e as operações lógicas:",
    options: ["UC", "ULA", "DMA"],
    answer: 1,
    explain: "A ULA (Unidade Lógica e Aritmética) realiza somas, subtrações, comparações e operações lógicas."
  },
  {
    topic: "CPU",
    q: "Parte da CPU que coordena as outras, interpretando instruções e enviando sinais de controle:",
    options: ["ULA", "Cache", "UC"],
    answer: 2,
    explain: "A UC (Unidade de Controle) é o 'maestro': busca e decodifica as instruções e comanda ULA, registradores e barramentos."
  },
  {
    topic: "CPU",
    q: "Pequenas memórias dentro da CPU, as mais rápidas de todo o computador:",
    options: ["Registradores", "Memória de massa", "RAM"],
    answer: 0,
    explain: "Os registradores ficam dentro da CPU e guardam os dados e endereços em uso naquele instante."
  },
  {
    topic: "CPU",
    q: "Qual é o papel da CPU no computador?",
    options: [
      "Guardar arquivos de forma permanente",
      "Processar as instruções dos programas",
      "Exibir as imagens na tela"
    ],
    answer: 1,
    explain: "A CPU é o 'cérebro' do computador: busca, interpreta e executa as instruções dos programas."
  },
  {
    topic: "CPU",
    q: "Processador com dois núcleos, capaz de executar duas tarefas ao mesmo tempo:",
    options: ["Quad core", "Dual core", "Microcontrolador"],
    answer: 1,
    explain: "Dual core = dois núcleos de processamento no mesmo chip, trabalhando em paralelo."
  },
  {
    topic: "CPU",
    q: "Um processador quad core possui:",
    options: ["Quatro núcleos de processamento", "Quatro memórias cache externas", "Quatro barramentos de dados"],
    answer: 0,
    explain: "Quad core = quatro núcleos. Cada núcleo pode executar instruções de forma independente."
  },
  {
    topic: "CPU",
    q: "Qual a vantagem de ter mais núcleos (dual core, quad core)?",
    options: [
      "Aumentar a capacidade de armazenamento",
      "Executar mais tarefas em paralelo",
      "Deixar a memória RAM não volátil"
    ],
    answer: 1,
    explain: "Com mais núcleos, a CPU divide o trabalho e executa várias tarefas simultaneamente."
  },

  // ---------- Fluxo de execução de instruções ----------
  {
    topic: "Execução de instruções",
    q: "Qual é a ordem correta do ciclo de execução de uma instrução?",
    options: [
      "Execução, busca e decodificação",
      "Busca, decodificação e execução",
      "Decodificação, execução e busca"
    ],
    answer: 1,
    explain: "A CPU busca a instrução na memória, decodifica para entender o que fazer e então executa."
  },
  {
    topic: "Execução de instruções",
    q: "Na etapa de busca, de onde a CPU traz a instrução?",
    options: ["Da memória", "Da ULA", "Do teclado"],
    answer: 0,
    explain: "Na busca, a CPU coloca o endereço no address bus e a instrução volta da memória pelo data bus."
  },
  {
    topic: "Execução de instruções",
    q: "Quem interpreta (decodifica) a instrução buscada?",
    options: ["A ULA", "A memória de massa", "A UC"],
    answer: 2,
    explain: "A Unidade de Controle decodifica a instrução e decide quais sinais enviar para executá-la."
  },
  {
    topic: "Execução de instruções",
    q: "Na execução de uma instrução de soma, quem faz o cálculo?",
    options: ["A UC", "A ULA", "O address bus"],
    answer: 1,
    explain: "Na etapa de execução, a ULA realiza a operação e o resultado vai para um registrador ou para a memória."
  },

  // ---------- Barramentos ----------
  {
    topic: "Barramentos",
    q: "Barramento por onde a CPU indica qual posição de memória quer acessar:",
    options: ["Data bus", "Address bus", "DMA"],
    answer: 1,
    explain: "O address bus (barramento de endereço) leva o endereço da CPU até a memória. É unidirecional."
  },
  {
    topic: "Barramentos",
    q: "Barramento que transporta as informações em si, nos dois sentidos:",
    options: ["Data bus", "Address bus", "Cache"],
    answer: 0,
    explain: "O data bus (barramento de dados) é bidirecional: leva dados da CPU para a memória e da memória para a CPU."
  },
  {
    topic: "Barramentos",
    q: "Por que o address bus é unidirecional?",
    options: [
      "Porque só a CPU envia endereços para a memória e os periféricos",
      "Porque ele só funciona em processadores dual core",
      "Porque ele transporta apenas dados gravados na ROM"
    ],
    answer: 0,
    explain: "É a CPU quem decide qual endereço acessar; o endereço sempre sai da CPU em direção à memória."
  },
  {
    topic: "Barramentos",
    q: "Quanto mais linhas (bits) o address bus tiver...",
    options: [
      "Mais rápida fica a ULA",
      "Mais posições de memória a CPU consegue endereçar",
      "Menos energia o computador consome"
    ],
    answer: 1,
    explain: "Cada bit a mais no barramento de endereço dobra a quantidade de endereços possíveis."
  },
  {
    topic: "Barramentos",
    q: "Quanto mais largo (mais bits) o data bus...",
    options: [
      "Mais dados são transferidos de uma só vez",
      "Mais núcleos o processador ganha",
      "Mais endereços de memória existem"
    ],
    answer: 0,
    explain: "Um data bus de 8 bits transfere 1 byte por vez; um de 64 bits transfere 8 bytes por vez."
  },
  {
    topic: "Barramentos",
    q: "Recurso que permite um dispositivo transferir dados direto para a memória, sem ocupar a CPU:",
    options: ["ULA", "Cache", "DMA"],
    answer: 2,
    explain: "DMA (Acesso Direto à Memória) libera a CPU: o dispositivo lê e grava na memória sozinho e só avisa ao terminar."
  },
  {
    topic: "Barramentos",
    q: "Qual a principal vantagem do DMA?",
    options: [
      "Aumentar o número de núcleos da CPU",
      "Liberar a CPU de copiar dados entre dispositivos e memória",
      "Tornar a RAM não volátil"
    ],
    answer: 1,
    explain: "Sem DMA, a CPU teria que copiar cada dado; com DMA ela fica livre para outras tarefas durante a transferência."
  },

  // ---------- Hierarquia de memória ----------
  {
    topic: "Hierarquia de memória",
    q: "Qual é a ordem da memória mais rápida para a mais lenta?",
    options: [
      "RAM, cache, registradores, memória de massa",
      "Registradores, cache, RAM, memória de massa",
      "Cache, memória de massa, registradores, RAM"
    ],
    answer: 1,
    explain: "Quanto mais perto da CPU, mais rápida, menor e mais cara: registradores, cache, RAM e memória de massa."
  },
  {
    topic: "Hierarquia de memória",
    q: "Ao descer na hierarquia (dos registradores até a memória de massa):",
    options: [
      "A velocidade aumenta e a capacidade diminui",
      "A capacidade aumenta, a velocidade diminui e o custo por byte cai",
      "Tudo continua igual"
    ],
    answer: 1,
    explain: "Memórias mais baixas na hierarquia são maiores e mais baratas, porém mais lentas."
  },
  {
    topic: "Hierarquia de memória",
    q: "Memória pequena e muito rápida, entre a CPU e a RAM, que guarda os dados mais usados:",
    options: ["Cache", "ROM", "Memória de massa"],
    answer: 0,
    explain: "A cache evita que a CPU espere pela RAM, mantendo por perto os dados e instruções usados com frequência."
  },
  {
    topic: "Hierarquia de memória",
    q: "Memória principal, volátil, onde ficam os programas em execução:",
    options: ["ROM", "RAM", "EEPROM"],
    answer: 1,
    explain: "A RAM é a memória principal. É volátil: ao desligar o computador, seu conteúdo é perdido."
  },
  {
    topic: "Hierarquia de memória",
    q: "Memória somente de leitura, gravada de fábrica, que não perde os dados sem energia:",
    options: ["RAM", "Cache", "ROM"],
    answer: 2,
    explain: "A ROM (memória somente de leitura) guarda instruções fixas, como o firmware de inicialização."
  },
  {
    topic: "Hierarquia de memória",
    q: "Memória não volátil que pode ser apagada e regravada eletricamente, byte a byte:",
    options: ["EEPROM", "RAM", "Cache"],
    answer: 0,
    explain: "A EEPROM é uma ROM que pode ser apagada e regravada eletricamente, sem retirar o chip do circuito."
  },
  {
    topic: "Hierarquia de memória",
    q: "Memória não volátil, regravável em blocos, usada em pendrives, SSDs e no Arduino:",
    options: ["Flash", "ROM", "Registradores"],
    answer: 0,
    explain: "A Flash é derivada da EEPROM, mas apaga e grava em blocos, o que a torna mais rápida para grandes volumes."
  },
  {
    topic: "Hierarquia de memória",
    q: "HDs e SSDs, que guardam grandes quantidades de dados de forma permanente, são chamados de:",
    options: ["Memória cache", "Memória de massa", "Registradores"],
    answer: 1,
    explain: "A memória de massa (armazenamento) tem grande capacidade e é não volátil, mas é a mais lenta da hierarquia."
  },
  {
    topic: "Hierarquia de memória",
    q: "Qual destas memórias é volátil?",
    options: ["Flash", "RAM", "EEPROM"],
    answer: 1,
    explain: "RAM, cache e registradores são voláteis. ROM, EEPROM, Flash e memória de massa mantêm os dados sem energia."
  }
];
