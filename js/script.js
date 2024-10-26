const text = "REVOLUCIONANDO A MANUTENÇÃO AUTOMOTIVA";
let index = 0;
const speed = 100; // Velocidade da digitação (em milissegundos)

function typeWriter() {
  const typingElement = document.getElementById("typing");

  if (index < text.length) {
    typingElement.innerHTML += text.charAt(index);
    index++;
    setTimeout(typeWriter, speed); // Chama a função novamente até terminar
  } else {
    // Remove o cursor piscante depois que a digitação termina
    typingElement.classList.remove("blink");
    typingElement.style.borderRight = "none";
  }
}

// Adiciona a classe 'blink' para o cursor piscante durante a digitação
document.getElementById("typing").classList.add("blink");

// Inicia o efeito de digitação ao carregar a página
window.onload = typeWriter;





const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const imagem = document.getElementById('imagem');
const tirarFotoBtn = document.getElementById('enviar_foto');
const diagnosticoElement = document.getElementById('diagnostico');
const solucaoElement = document.getElementById('solucao');
const orcamentoElement = document.getElementById('orcamento');
let isCameraActive = false; // Estado para controlar o fluxo de cliques
let stream = null; // Armazenar o stream da câmera

// Função para iniciar a câmera
// Função para iniciar a câmera traseira
function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { exact: 'environment' } } })
        .then((mediaStream) => {
            video.style.display = 'block'; // Exibir o vídeo quando a câmera estiver ativa
            imagem.style.display = 'none'; // Ocultar a imagem quando a câmera for ativada
            video.srcObject = mediaStream;
            stream = mediaStream; // Armazenar o stream para controle futuro
        })
        .catch((error) => {
            console.error('Erro ao acessar a câmera: ', error);
            alert('Não foi possível acessar a câmera. Verifique as permissões.');
        });
}


// Função para parar a câmera
function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Parar todas as tracks de vídeo
        stream = null; // Limpar o stream
    }
}

// Função para tirar foto e realizar predição
async function tirarFoto() {
    // Verificar se o vídeo está pronto
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Definir o tamanho do canvas como o mesmo do vídeo
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Desenhar o frame atual do vídeo no canvas
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Converter a imagem do canvas em dados de URL e colocar na tag <img>
        const dataUrl = canvas.toDataURL('image/png');
        imagem.src = dataUrl;

        // Ocultar o vídeo após tirar a foto (opcional)
        video.style.display = 'none';
        imagem.style.display = 'block'; // Mostrar a imagem após a foto ser tirada
        tirarFotoBtn.textContent = 'Abrir câmera'; // Resetar o botão para abrir a câmera novamente
        isCameraActive = false; // Resetar o estado

        // Parar a câmera após tirar a foto
        stopCamera(); 

        // Fazer a predição com a imagem tirada
        await predictImage(dataUrl);
    } else {
        alert('A câmera ainda não está pronta. Tente novamente em instantes.');
    }
}

// Função para realizar predição com a imagem tirada
async function predictImage(imageUrl) {
    const img = new Image();
    img.src = imageUrl;

    img.onload = async () => {
        // Fazer a predição com a imagem carregada
        const prediction = await model.predict(img);
        for (let i = 0; i < maxPredictions; i++) {
            if (prediction[i].probability.toFixed(2) > 0.4) { // Exemplo de threshold para predizer o problema
                getProblemMessage(prediction[i].className);
            }
        }
    };
}

// Evento de clique no botão
tirarFotoBtn.addEventListener('click', () => {
    if (!isCameraActive) {
        // Primeiro clique: abrir a câmera
        startCamera();
        tirarFotoBtn.textContent = 'Tirar foto'; // Mudar o texto do botão
        isCameraActive = true; // Atualizar o estado
    } else {
        // Segundo clique: tirar a foto
        tirarFoto();
        init();
    }
});

// Função para gerar diagnóstico, solução e orçamento
function getProblemMessage(predictedClass) {
    switch (predictedClass) {
        case 'LuzBateria':
            diagnosticoElement.textContent = "A luz de bateria acesa indica um problema no sistema de carregamento, relacionado ao alternador, à bateria ou à correia, podendo causar falhas elétricas e impedir o funcionamento do carro.";
            solucaoElement.textContent = "Recomendamos verificar o alternador, a bateria e a correia, substituindo a peça danificada, se necessário, para garantir o funcionamento do sistema de carregamento.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 700 (se necessário)";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 50";
            document.getElementById('orcamento-total').textContent = "Total: R$ 750 (se necessário)";
            break;

        case 'LuzOleo':
            diagnosticoElement.textContent = "A luz de óleo do motor indica baixa pressão ou nível insuficiente de óleo, o que pode causar sérios danos ao motor se não resolvido rapidamente.";
            solucaoElement.textContent = "Recomendamos verificar o nível de óleo e completar ou trocar o óleo do motor. Além disso, é importante verificar o filtro de óleo e, se necessário, substituí-lo.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 110 (Troca de óleo: R$ 80, Filtro de óleo: R$ 30)";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 50";
            document.getElementById('orcamento-total').textContent = "Total: R$ 160";
            break;

        case 'LuzFreioMao':
            diagnosticoElement.textContent = "A luz de freio de mão acesa pode indicar que o freio de estacionamento está ativado ou que há um problema no sistema de freio, como baixo nível de fluido de freio.";
            solucaoElement.textContent = "Recomendamos verificar se o freio de mão está completamente desativado. Caso o problema persista, verifique o nível de fluido de freio e o sistema de frenagem em geral.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 100 (se necessário)";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 80";
            document.getElementById('orcamento-total').textContent = "Total: R$ 180 (se necessário)";
            break;
            

        case 'LuzMotor':
            diagnosticoElement.textContent = "A luz de injeção elétrica acesa indica um problema no sistema de injeção eletrônica do veículo, que pode afetar o desempenho do motor e a eficiência de combustível.";
            solucaoElement.textContent = "Recomendamos realizar um diagnóstico completo para identificar a falha. Caso seja necessário substituir a unidade de controle do motor (ECU), o serviço estará incluído.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 800 (ECU)";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 100 (Diagnóstico)";
            document.getElementById('orcamento-total').textContent = "Total: R$ 900 (se a substituição da ECU for necessária)";
            break;

        case 'LuzMotor':
            diagnosticoElement.textContent = "A luz de injeção elétrica acesa indica um problema no sistema de injeção eletrônica do veículo, que pode afetar o desempenho do motor e a eficiência de combustível.";
            solucaoElement.textContent = "Recomendamos realizar um diagnóstico completo para identificar a falha. Caso seja necessário substituir a unidade de controle do motor (ECU), o serviço estará incluído.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 800 (ECU)";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 100 (Diagnóstico)";
            document.getElementById('orcamento-total').textContent = "Total: R$ 900 (se a substituição da ECU for necessária)";
            break;

        case 'LuzAirbag':
            diagnosticoElement.textContent = "A luz do airbag indica um problema no sistema de airbag, o que pode comprometer sua ativação em caso de acidente, sendo um risco à segurança.";
            solucaoElement.textContent = "Recomendamos uma inspeção detalhada do sistema de airbag para identificar e corrigir falhas, que podem incluir sensores, chicotes elétricos ou a própria unidade do airbag.";
            document.getElementById('orcamento-peças').textContent = "Peças: R$ 1800";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: R$ 600";
            document.getElementById('orcamento-total').textContent = "Total: R$ 2400";
            break;
            

        default:
            diagnosticoElement.textContent = "Não foi possível identificar o problema.";
            solucaoElement.textContent = "Consulte um mecânico para um diagnóstico mais detalhado.";
            document.getElementById('orcamento-peças').textContent = "Peças: Não disponível.";
            document.getElementById('orcamento-mao-obra').textContent = "Mão de Obra: Não disponível.";
            document.getElementById('orcamento-total').textContent = "Total: Não disponível.";
            break;
    }
}

// Função para inicializar o modelo do Teachable Machine
async function init() {
    // Carregar o modelo e os metadados
    const modelURL = "./teachablemachine/model.json";
    const metadataURL = "./teachablemachine/metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses(); // Obter o número total de classes
    console.log('Modelo carregado com sucesso!');
}



// Aguarde até o Watson Assistant estar carregado
window.watsonAssistantChatOptions = {
    integrationID: "b66b7cf7-3de3-4613-956c-5e84f8730328", // ID da integração
    region: "us-south", // Região onde está hospedado
    serviceInstanceID: "942fb06d-b814-4868-bc74-e2e68ebb16f7", // ID da instância de serviço
    onLoad: async (instance) => {
      await instance.render();
  
      // Obtém o botão e adiciona o evento de clique para abrir o chatbot
      const chatButton = document.getElementById("chat");
      chatButton.addEventListener("click", () => {
        instance.openWindow(); // Abre o chatbot no clique do botão
      });
    },
  };
  
  // Carrega o Watson Assistant Chat
  setTimeout(function () {
    const t = document.createElement("script");
    t.src =
      "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
      (window.watsonAssistantChatOptions.clientVersion || "latest") +
      "/WatsonAssistantChatEntry.js";
    document.head.appendChild(t);
  });
  