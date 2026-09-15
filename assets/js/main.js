/* ==========================================================================
   Davi Aulas de Bateria — interações do site
   Sem dependências externas. Tudo degrada bem se o JS não carregar.
   ========================================================================== */
(function () {
  'use strict';

  /* AJUSTAR: número do WhatsApp que recebe as mensagens do formulário.
     Formato internacional, só dígitos: 55 + DDD + número. */
  var WHATSAPP = '5500000000000';

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- menu */
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('navMenu');

  function fecharMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var aberto = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(aberto));
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fecharMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        fecharMenu();
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------- sombra do cabeçalho */
  var header = document.querySelector('.site-header');
  if (header) {
    var aoRolar = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
  }

  /* ------------------------------------------- animação ao entrar na tela */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduzMovimento) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var obsReveal = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        obsReveal.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { obsReveal.observe(el); });
  }

  /* ----------------------------------------- link ativo na navegação */
  var secoes = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var linksNav = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.btn)'));

  if ('IntersectionObserver' in window && secoes.length && linksNav.length) {
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        var id = entrada.target.id;
        linksNav.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { obsNav.observe(s); });
  }

  /* --------------------------------------------- contagem dos números */
  var numeros = document.querySelectorAll('.stat-num[data-count]');
  if (numeros.length) {
    if (reduzMovimento || !('IntersectionObserver' in window)) {
      // valores já estão no HTML; nada a fazer
    } else {
      var obsNum = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          contar(entrada.target);
          obsNum.unobserve(entrada.target);
        });
      }, { threshold: 0.5 });
      numeros.forEach(function (el) { obsNum.observe(el); });
    }
  }

  function contar(el) {
    var alvo = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(alvo)) return;
    var duracao = 900;
    var inicio = null;
    el.textContent = '0';

    function passo(agora) {
      if (inicio === null) inicio = agora;
      var t = Math.min((agora - inicio) / duracao, 1);
      var suave = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(alvo * suave));
      if (t < 1) requestAnimationFrame(passo);
    }
    requestAnimationFrame(passo);
  }

  /* ------------------------------------------------------ metrônomo */
  var metroPlay = document.getElementById('metroPlay');
  var metroLabel = document.getElementById('metroPlayLabel');
  var metroBpm = document.getElementById('metroBpm');
  var metroOut = document.getElementById('metroBpmOut');
  var metroPulse = document.getElementById('metroPulse');

  if (metroBpm && metroOut) {
    var mostrarBpm = function () { metroOut.textContent = metroBpm.value + ' BPM'; };
    mostrarBpm();
    metroBpm.addEventListener('input', mostrarBpm);
  }

  if (metroPlay && metroBpm && metroPulse) {
    var luzes = Array.prototype.slice.call(metroPulse.querySelectorAll('span'));
    var audioCtx = null;
    var timer = null;
    var tempoAtual = 0;
    var tocando = false;

    function clique(acentuado) {
      if (!audioCtx) return;
      var osc = audioCtx.createOscillator();
      var ganho = audioCtx.createGain();
      var agora = audioCtx.currentTime;

      osc.frequency.value = acentuado ? 1500 : 1000;
      ganho.gain.setValueAtTime(acentuado ? 0.5 : 0.28, agora);
      ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.05);

      osc.connect(ganho).connect(audioCtx.destination);
      osc.start(agora);
      osc.stop(agora + 0.06);
    }

    function bater() {
      var acentuado = tempoAtual === 0;
      clique(acentuado);

      luzes.forEach(function (luz, i) {
        luz.classList.toggle('is-on', i === tempoAtual);
        luz.classList.toggle('is-downbeat', i === tempoAtual && acentuado);
      });

      tempoAtual = (tempoAtual + 1) % luzes.length;
      timer = window.setTimeout(bater, 60000 / Number(metroBpm.value));
    }

    function parar() {
      tocando = false;
      window.clearTimeout(timer);
      timer = null;
      tempoAtual = 0;
      luzes.forEach(function (luz) { luz.classList.remove('is-on', 'is-downbeat'); });
      metroPlay.setAttribute('aria-pressed', 'false');
      if (metroLabel) metroLabel.textContent = 'Tocar';
    }

    metroPlay.addEventListener('click', function () {
      if (tocando) { parar(); return; }

      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return; // navegador sem Web Audio: botão simplesmente não faz nada
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      tocando = true;
      tempoAtual = 0;
      metroPlay.setAttribute('aria-pressed', 'true');
      if (metroLabel) metroLabel.textContent = 'Parar';
      bater();
    });

    // trocar o andamento com o metrônomo rodando reinicia o intervalo
    metroBpm.addEventListener('change', function () {
      if (!tocando) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(bater, 60000 / Number(metroBpm.value));
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && tocando) parar();
    });
  }

  /* --------------------------------------- formulário -> WhatsApp */
  var form = document.getElementById('formContato');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var status = document.getElementById('formStatus');
      var nome = form.elements.nome;
      var telefone = form.elements.telefone;
      var valido = true;

      function validar(campo, ok) {
        var erro = form.querySelector('[data-error-for="' + campo.name + '"]');
        campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (erro) erro.hidden = ok;
        if (!ok && valido) campo.focus();
        if (!ok) valido = false;
      }

      validar(nome, nome.value.trim().length >= 2);
      validar(telefone, telefone.value.replace(/\D/g, '').length >= 10);

      if (!valido) {
        if (status) status.textContent = '';
        return;
      }

      var linhas = [
        'Olá, Davi! Quero agendar a aula experimental.',
        '',
        'Nome: ' + nome.value.trim(),
        'WhatsApp: ' + telefone.value.trim(),
        'Nível: ' + form.elements.nivel.value,
        'Modalidade: ' + form.elements.modalidade.value
      ];

      var objetivo = form.elements.mensagem.value.trim();
      if (objetivo) linhas.push('Objetivo: ' + objetivo);

      var url = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(linhas.join('\n'));
      window.open(url, '_blank', 'noopener');

      if (status) status.textContent = 'Tudo certo! Abrimos o WhatsApp com sua mensagem.';
      form.reset();
    });
  }

  /* --------------------------------------- máscara simples de telefone */
  var tel = document.getElementById('telefone');
  if (tel) {
    tel.addEventListener('input', function () {
      var d = tel.value.replace(/\D/g, '').slice(0, 11);
      if (d.length > 6) {
        var corte = d.length > 10 ? 7 : 6;
        tel.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, corte) + '-' + d.slice(corte);
      } else if (d.length > 2) {
        tel.value = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      } else {
        tel.value = d;
      }
    });
  }

  /* ------------------------------------------------------- ano no rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
