# Arq Pong

Um **Pong clássico** com um desafio extra: estudar **Arquitetura Computacional**!

Sua raquete é a **CPU**, a do adversário é a **Memória** e a bola é um **dado**
trafegando pelo barramento. Deixou o dado passar? Responda uma pergunta sobre o
conteúdo para recuperá-lo, ou o ponto vai para o adversário.

**Jogue agora:** [arq-pong](https://paulodesouza-dev.github.io/arq-pong/)

## Objetivo

Projeto da disciplina de Arquitetura Computacional da **SPTech**, criado para
ajudar estudantes a revisar o conteúdo para a prova de um jeito mais divertido
que um quiz tradicional.

## Conteúdos abordados

- Microprocessadores x microcontroladores
- Arquitetura do Arduino
- CPU: Unidade de Controle (UC), Unidade Lógica e Aritmética (ULA) e registradores
- Ciclo de execução de instruções (busca, decodificação e execução)
- Barramentos (dados, endereços e controle)
- Hierarquia de memória (registradores, cache, RAM e armazenamento)

## Como jogar

| Ação            | Teclado      | Mouse / Celular          |
|-----------------|--------------|--------------------------|
| Mover a raquete | ↑ ↓ ou W S   | Arrastar na tela         |
| Responder       | 1, 2 ou 3    | Clicar / tocar na opção  |

- Vence quem fizer **7 pontos** primeiro.
- Quando a Memória marca um ponto em você, aparece uma **pergunta** com 10 segundos para responder:
  - **Acertou:** o dado é recuperado e o ponto é anulado.
  - **Errou:** o ponto vale e o jogo mostra a resposta certa com uma explicação.
- **3 acertos seguidos** deixam sua raquete maior por um tempo.
- No fim da partida, uma **tela de revisão** mostra tudo o que você errou.

## Tecnologias

- HTML5 (Canvas)
- CSS3
- JavaScript puro, sem bibliotecas nem instalação

## Uso de IA

Este jogo foi desenvolvido com o auxílio de agentes de inteligência artificial,
que ajudaram na programação, no visual e na escrita das perguntas. O conteúdo
foi revisado com base no material da disciplina.

## Como rodar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/paulodesouza-dev/arq-pong.git
   ```
2. Abra o arquivo `index.html` no navegador. Pronto, não precisa instalar nada!

## Estrutura

```
index.html     → estrutura da página e das telas
style.css      → visual do jogo
game.js        → lógica do Pong, IA da Memória e fluxo de perguntas
questions.js   → banco de perguntas (fácil de editar e ampliar)
```
