let senhaAtual = 0;
let ultimaSenhaNormal = 0;
let ultimaSenhaPrioritaria = 0;
let filaNormal = [];
let filaPrioritaria = [];
let ultimaSenhaChamada = null;

function Menu() {
    const menu = document.getElementById("menu");
    const toggleButton = document.querySelector(".BotaoMenu");

    const isHidden = menu.classList.toggle("hidden");
    menu.classList.toggle("visible", !isHidden);
    toggleButton.classList.toggle("menu-visible", !isHidden);
    toggleButton.setAttribute("aria-expanded", !isHidden);
    toggleButton.setAttribute("aria-label", isHidden ? "Abrir controle de senhas" : "Fechar controle de senhas");
    menu.setAttribute("aria-hidden", isHidden);
}

function formatarSenha(numero, tipo) {
    return `${tipo}${numero.toString().padStart(3, '0')}`;
}

function retirarSenha(tipo) {
    let novaSenha;
    if (tipo === 'normal') {
        ultimaSenhaNormal++;
        novaSenha = formatarSenha(ultimaSenhaNormal, 'N');
        filaNormal.push(novaSenha);
        document.getElementById('ultimaSenhaNormal').innerText = novaSenha;
    } else if (tipo === 'prioritario') {
        ultimaSenhaPrioritaria++;
        novaSenha = formatarSenha(ultimaSenhaPrioritaria, 'P');
        filaPrioritaria.push(novaSenha);
        document.getElementById('ultimaSenhaPrioritaria').innerText = novaSenha;
    }

    alert(`Sua senha é ${novaSenha}`);
    atualizarTempoEspera();
    reativarBotoes();
}

function chamarProximaSenha() {
    let proximaSenha = filaPrioritaria.length ? filaPrioritaria.shift() : filaNormal.shift();

    if (proximaSenha) {
        senhaAtual++;
        ultimaSenhaChamada = proximaSenha;
        document.getElementById('senhaAtendida').innerText = proximaSenha;
        adicionarHistorico(proximaSenha);
        document.getElementById('proximoAtendimento').innerText = filaPrioritaria[0] || filaNormal[0] || '000';
        atualizarTempoEspera();
        new Audio('midia/somdechamada.mp3').play();
        piscarSenha(proximaSenha);
        falarSenha(proximaSenha);

        document.getElementById('btnChamarSenhaNovamente').disabled = false;
        document.getElementById('btnChamarSenhaNovamente').innerText = 'Chamar senha novamente';
    } else {
        document.getElementById('btnChamarProximaSenha').disabled = true;
        document.getElementById('btnChamarProximaSenha').innerText = 'Sem senha a ser chamada';
    }

    if (ultimaSenhaChamada === '000') {
        document.getElementById('btnChamarSenhaNovamente').disabled = true;
        document.getElementById('btnChamarSenhaNovamente').innerText = 'Sem senha a ser chamada';
    }
}

let blinkTimeout;

function chamarSenhaNovamente() {
    if (ultimaSenhaChamada) {
        new Audio('midia/somdechamada.mp3').play();
        piscarSenha(ultimaSenhaChamada);
        falarSenha(ultimaSenhaChamada);
    }
}


function falarSenha(senha) {
    var speech = new SpeechSynthesisUtterance("Senha " + senha.split('').join(' . '));
    var voices = window.speechSynthesis.getVoices();
    speech.voice = voices.find(voice => voice.lang === 'pt-BR') || voices[0];
    speech.rate = 1.5;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();

function piscarSenha(senha) {
    const senhaAtendida = document.getElementById('senhaAtendida');
    senhaAtendida.classList.add('blink');

    if (blinkTimeout) clearTimeout(blinkTimeout);

    blinkTimeout = setTimeout(() => senhaAtendida.classList.remove('blink'), 5000);
}

function reativarBotoes() {
    const hasSenhas = filaPrioritaria.length || filaNormal.length;
    document.getElementById('btnChamarProximaSenha').disabled = !hasSenhas;
    document.getElementById('btnChamarProximaSenha').innerText = hasSenhas ? 'Chamar próxima senha' : 'Sem senha a ser chamada';
}

window.onload = function() {
    document.getElementById('btnChamarProximaSenha').disabled = true;
    document.getElementById('btnChamarProximaSenha').innerText = 'Sem senha a ser chamada';
    document.getElementById('btnChamarSenhaNovamente').disabled = true;
    document.getElementById('btnChamarSenhaNovamente').innerText = 'Sem senha a ser chamada';
};

function atualizarDataHora() {
    var now = new Date();
    var dataHoraFormatada = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
    document.getElementById('horaData').textContent = dataHoraFormatada;
}

setInterval(atualizarDataHora, 1000);

function atualizarTempoEspera() {
    const totalSenhas = filaNormal.length + filaPrioritaria.length;
    const tempoMedio = totalSenhas ? totalSenhas * 2 : 0;
    document.getElementById('tempoEspera').innerText = tempoMedio;
}

function adicionarHistorico(senha) {
    const historico = document.getElementById('historicoSenhas');
    const novaEntrada = document.createElement('li');
    novaEntrada.classList.add('list-group-item');
    novaEntrada.textContent = senha;
    novaEntrada.setAttribute("aria-hidden", "false");
    historico.prepend(novaEntrada);

    if (historico.children.length > 10) {
        historico.lastElementChild.setAttribute("aria-hidden", "true");
        historico.removeChild(historico.lastElementChild);
    }
}

var player;

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        videoId: '8G6Mj9DaNF8',
        playerVars: { 'autoplay': 0, 'controls': 0, 'mute': 1 },
        events: { 'onReady': onPlayerReady }
    });
}

function onPlayerReady(event) {
    event.target.seekTo(0);
    event.target.unMute();
    event.target.playVideo();
    event.target.setVolume(10);
    document.querySelector('.video-text').classList.add('visually-hidden');
}
