// script.js — interatividade leve para o site do Gabigol

document.addEventListener('DOMContentLoaded', function(){
	// Rolagem suave para links de navegação
	document.querySelectorAll('a[href^="#"]').forEach(a => {
		a.addEventListener('click', e => {
			const href = a.getAttribute('href');
			if(href.length > 1){
				e.preventDefault();
				const el = document.querySelector(href);
				if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
			}
		});
	});

	// Verifica se o iframe de vídeo foi configurado (substitua VIDEO_ID no HTML)
	document.querySelectorAll('iframe').forEach(frame => {
		const src = frame.getAttribute('src') || '';
		if(src.includes('VIDEO_ID')){
			// substitua o elemento por um aviso para o usuário configurar um vídeo
			const warn = document.createElement('div');
			warn.className = 'video-warning';
			warn.style.padding = '16px';
			warn.style.background = '#fff3f3';
			warn.style.border = '1px solid #ffd1d1';
			warn.style.borderRadius = '8px';
			warn.textContent = 'Nenhum vídeo configurado. Substitua VIDEO_ID no arquivo index.html por um ID de vídeo do YouTube para habilitar este embed.';
			frame.parentNode.replaceChild(warn, frame);
		}
	});

	// Acessibilidade/UX: permitir abrir/fechar <details> com Enter na timeline
	document.querySelectorAll('.timeline-item details').forEach(d => {
		d.addEventListener('keydown', (ev) => {
			if(ev.key === 'Enter' || ev.key === ' '){
				ev.preventDefault();
				d.open = !d.open;
			}
		});
	});
});

/* Pequeno helper para depuração local: loga se página carregou */
console.log('Site Gabigol carregado — abra index.html no navegador para ver.');
