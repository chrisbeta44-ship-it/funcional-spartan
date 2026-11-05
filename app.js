document.getElementById('year').textContent=new Date().getFullYear();
const video=document.querySelector('[data-hero-video]');
if(video){video.addEventListener('error',()=>{video.style.display='none';});}
const form=document.getElementById('registrationForm');
if(form){form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const name=String(data.get('nome')||'').trim();const phone=String(data.get('telefone')||'').trim();const email=String(data.get('email')||'').trim();const plan=String(data.get('plano')||'');const message=['Olá! Quero me cadastrar na Funcional Spartan.','Nome: '+name,'WhatsApp: '+phone,email?'E-mail: '+email:null,'Plano: '+plan].filter(Boolean).join('\n');window.open('https://wa.me/5531987374386?text='+encodeURIComponent(message),'_blank','noopener');});}
