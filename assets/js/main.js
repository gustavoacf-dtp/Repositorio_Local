/* ==========================================================================
   Just Drums — Davi Ramos
   Vanilla JS, sem dependências.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     CONFIGURAÇÃO — os dois pontos que você pode querer ajustar
     ====================================================================== */

  /* 1) Vídeos da galeria.
        Coloque os arquivos em assets/video/ e liste-os aqui.
        Um vídeo que não existir é removido da página automaticamente,
        então pode deixar entradas sobrando sem quebrar nada.
        'capa' é opcional (imagem mostrada antes de dar play). */
  var VIDEOS = [
    { arquivo: 'assets/video/video-1.mp4', titulo: 'Groove e condução',  capa: '' },
    { arquivo: 'assets/video/video-2.mp4', titulo: 'Viradas',            capa: '' },
    { arquivo: 'assets/video/video-3.mp4', titulo: 'Treino de técnica',  capa: '' },
    { arquivo: 'assets/video/video-4.mp4', titulo: 'Tocando na igreja',  capa: '' }
  ];

  /* 2) Envio do formulário.
        - Deixando FORMSPREE vazio, o site abre o e-mail do aluno com a
          mensagem já pronta para daviwrrf@gmail.com (funciona sem cadastro).
        - Preenchendo com o endpoint do Formspree (https://formspree.io —
          conta gratuita, cadastrar o e-mail daviwrrf@gmail.com), o envio
          acontece em segundo plano, sem abrir nada.
          Exemplo: 'https://formspree.io/f/abcdwxyz' */
  var FORMSPREE = '';
  var EMAIL_DESTINO = 'daviwrrf@gmail.com';

  /* ====================================================================== */

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------- menu */
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

  /* ------------------------------------------------ sombra do cabeçalho */
  var header = document.querySelector('.site-header');
  if (header) {
    var aoRolar = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
  }

  /* ------------------------------------------- animação ao entrar na tela */
  function observarReveals(alvos) {
    if (!('IntersectionObserver' in window) || reduzMovimento) {
      alvos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('is-visible');
        obs.unobserve(entrada.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { obs.observe(el); });
  }
  observarReveals(Array.prototype.slice.call(document.querySelectorAll('.reveal')));

  /* --------------------------------------------- link ativo na navegação */
  var secoes = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var linksNav = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]:not(.btn)'));

  if ('IntersectionObserver' in window && secoes.length && linksNav.length) {
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        linksNav.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entrada.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach(function (s) { obsNav.observe(s); });
  }

  /* -------------------------------------------------- galeria de vídeos */
  var grid = document.getElementById('videoGrid');
  var vazio = document.getElementById('videoVazio');

  if (grid) {
    var restantes = VIDEOS.length;

    function conferirGaleria() {
      if (!vazio) return;
      vazio.hidden = grid.children.length > 0;
    }

    VIDEOS.forEach(function (item) {
      var card = document.createElement('figure');
      card.className = 'video-card reveal';

      var video = document.createElement('video');
      video.src = item.arquivo;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      if (item.capa) video.poster = item.capa;

      // usa a proporção real do arquivo, sem cortar a imagem
      video.addEventListener('loadedmetadata', function () {
        if (!video.videoWidth || !video.videoHeight) return;
        card.style.setProperty('--proporcao', video.videoWidth + ' / ' + video.videoHeight);
        card.setAttribute('data-proporcao', '');
      });

      // arquivo inexistente: o card simplesmente não aparece
      video.addEventListener('error', function () {
        card.remove();
        restantes -= 1;
        conferirGaleria();
      });

      // só um vídeo toca por vez
      video.addEventListener('play', function () {
        grid.querySelectorAll('video').forEach(function (outro) {
          if (outro !== video) outro.pause();
        });
      });

      var legenda = document.createElement('figcaption');
      legenda.textContent = item.titulo || '';

      card.appendChild(video);
      if (item.titulo) card.appendChild(legenda);
      grid.appendChild(card);
      observarReveals([card]);
    });

    conferirGaleria();
    if (!VIDEOS.length && vazio) vazio.hidden = false;
  }

  /* ------------------------------------------- máscara de telefone */
  var tel = document.getElementById('telefone');

  function formatarTelefone(valor) {
    var d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length > 6) {
      var corte = d.length > 10 ? 7 : 6;
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, corte) + '-' + d.slice(corte);
    }
    if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    return d;
  }

  if (tel) {
    tel.addEventListener('input', function () {
      tel.value = formatarTelefone(tel.value);
    });
  }

  /* ------------------------------------------------------- formulário */
  var form = document.getElementById('formContato');
  var sucesso = document.getElementById('formSucesso');
  var erroGeral = document.getElementById('formErroGeral');
  var btnEnviar = document.getElementById('btnEnviar');
  var btnNovo = document.getElementById('btnNovoEnvio');

  var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
  var RE_TEL = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;

  function marcar(campo, mensagem) {
    var alvo = form.querySelector('[data-error-for="' + campo.name + '"]');
    var ok = !mensagem;
    campo.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (alvo) {
      alvo.textContent = mensagem || '';
      alvo.hidden = ok;
    }
    return ok;
  }

  function validar() {
    var c = form.elements;
    var erros = [];

    if (!marcar(c.nome, c.nome.value.trim().length >= 2 ? '' : 'Informe seu nome.')) erros.push(c.nome);
    if (!marcar(c.sexo, c.sexo.value ? '' : 'Selecione uma opção.')) erros.push(c.sexo);

    var idade = Number(c.idade.value);
    var idadeOk = c.idade.value !== '' && Number.isInteger(idade) && idade >= 1 && idade <= 120;
    if (!marcar(c.idade, idadeOk ? '' : 'Informe uma idade válida.')) erros.push(c.idade);

    if (!marcar(c.email, RE_EMAIL.test(c.email.value.trim()) ? '' : 'Informe um e-mail válido.')) erros.push(c.email);

    // telefone é opcional: só valida o formato se tiver sido preenchido
    var telValor = c.telefone.value.trim();
    var telOk = telValor === '' || RE_TEL.test(telValor);
    if (!marcar(c.telefone, telOk ? '' : 'Use o formato (61) 99999-9999.')) erros.push(c.telefone);

    return erros;
  }

  function montarDados() {
    var c = form.elements;
    var nomeCompleto = (c.nome.value.trim() + ' ' + c.sobrenome.value.trim()).trim();
    return {
      nome: c.nome.value.trim(),
      sobrenome: c.sobrenome.value.trim(),
      nomeCompleto: nomeCompleto,
      sexo: c.sexo.value,
      idade: c.idade.value,
      telefone: c.telefone.value.trim(),
      email: c.email.value.trim(),
      interesse: c.interesse.checked ? 'Sim' : 'Não'
    };
  }

  function corpoMensagem(d) {
    return [
      'Novo contato pelo site Just Drums',
      '',
      'Nome: ' + d.nomeCompleto,
      'Sexo: ' + d.sexo,
      'Idade: ' + d.idade,
      'Telefone: ' + (d.telefone || 'não informado'),
      'E-mail: ' + d.email,
      'Tenho interesse: ' + d.interesse
    ].join('\n');
  }

  function mostrarSucesso() {
    if (!sucesso) return;
    form.hidden = true;
    sucesso.hidden = false;
    sucesso.classList.add('is-visible');
    if (typeof sucesso.scrollIntoView === 'function') {
      sucesso.scrollIntoView({ behavior: reduzMovimento ? 'auto' : 'smooth', block: 'center' });
    }
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (erroGeral) erroGeral.hidden = true;

      var erros = validar();
      if (erros.length) {
        erros[0].focus();
        return;
      }

      var dados = montarDados();

      if (FORMSPREE) {
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando…';

        fetch(FORMSPREE, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: dados.nomeCompleto,
            sexo: dados.sexo,
            idade: dados.idade,
            telefone: dados.telefone,
            email: dados.email,
            interesse: dados.interesse,
            _subject: 'Novo contato pelo site Just Drums — ' + dados.nomeCompleto
          })
        }).then(function (r) {
          if (!r.ok) throw new Error('falha no envio');
          form.reset();
          mostrarSucesso();
        }).catch(function () {
          if (erroGeral) {
            erroGeral.textContent = 'Não consegui enviar agora. Tente novamente ou me chame no WhatsApp (61) 99514-9266.';
            erroGeral.hidden = false;
          }
        }).then(function () {
          btnEnviar.disabled = false;
          btnEnviar.textContent = 'Enviar';
        });
        return;
      }

      // sem Formspree: abre o e-mail com a mensagem pronta
      var assunto = 'Novo contato pelo site Just Drums — ' + dados.nomeCompleto;
      window.location.href = 'mailto:' + EMAIL_DESTINO +
        '?subject=' + encodeURIComponent(assunto) +
        '&body=' + encodeURIComponent(corpoMensagem(dados));

      form.reset();
      mostrarSucesso();
    });

    // limpa o erro do campo assim que a pessoa começa a corrigir
    Array.prototype.forEach.call(form.elements, function (campo) {
      if (!campo.name) return;
      campo.addEventListener('input', function () {
        if (campo.getAttribute('aria-invalid') === 'true') marcar(campo, '');
      });
    });
  }

  if (btnNovo) {
    btnNovo.addEventListener('click', function () {
      sucesso.hidden = true;
      form.hidden = false;
      form.elements.nome.focus();
    });
  }

  /* ------------------------------------------------------- ano no rodapé */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
