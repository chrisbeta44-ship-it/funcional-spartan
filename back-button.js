// Back-button behavior for the student and administrator panels.
// Works in Capacitor Android, installed PWA, and normal mobile browsers.
(() => {
  const visible = el => !!el && !el.hidden && getComputedStyle(el).display !== 'none' && !el.classList.contains('hidden');
  const student = () => document.getElementById('memberView');
  const admin = () => document.getElementById('dashboardView');
  function currentPanel() {
    const member = student();
    if (visible(member)) return {kind:'student',root:member,home:'home',selector:'[data-tab="home"]',active:member.querySelector('[data-tab].active')?.dataset.tab};
    const dashboard = admin();
    if (visible(dashboard)) return {kind:'admin',root:dashboard,home:'studentsTab',selector:'.admin-tab[data-tab="studentsTab"]',active:dashboard.querySelector('.admin-tab.active')?.dataset.tab};
    return null;
  }
  function armHistory() {
    const panel=currentPanel();
    if (!panel) { window.__spartanPanelHistoryArmed=false; return; }
    if (!window.__spartanPanelHistoryArmed) {
      history.pushState({spartanPanelGuard:panel.kind},'',location.href);
      window.__spartanPanelHistoryArmed=true;
    }
  }
  function returnToPanelHome() {
    const panel=currentPanel();
    if (!panel || panel.active===panel.home) return false;
    panel.root.querySelector(panel.selector)?.click();
    return true;
  }
  window.addEventListener('popstate',()=>{
    const panel=currentPanel();
    if (!panel) { window.__spartanPanelHistoryArmed=false; return; }
    if (panel.active!==panel.home) {
      returnToPanelHome();
      history.pushState({spartanPanelGuard:panel.kind},'',location.href);
      window.__spartanPanelHistoryArmed=true;
    } else window.__spartanPanelHistoryArmed=false;
  });
  const observe=()=>{
    ['memberView','dashboardView'].forEach(id=>{
      const el=document.getElementById(id);
      if(el && !el.__spartanBackObserved){
        new MutationObserver(armHistory).observe(el,{attributes:true,attributeFilter:['class','style','hidden']});
        el.__spartanBackObserved=true;
      }
    });
    armHistory();
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',observe,{once:true});
  else observe();
  (async()=>{
    const capacitor=window.Capacitor;
    if(!capacitor || typeof capacitor.isNativePlatform!=='function' || !capacitor.isNativePlatform()) return;
    try {
      const {App}=await import('https://esm.sh/@capacitor/app@8.0.0');
      await App.addListener('backButton',({canGoBack})=>{
        if(document.body.classList.contains('menu-open') || document.body.classList.contains('student-menu-open')){
          document.body.classList.remove('menu-open','student-menu-open');
          document.getElementById('menuToggle')?.setAttribute('aria-expanded','false');
          document.getElementById('studentMenuToggle')?.setAttribute('aria-expanded','false');
          return;
        }
        if(returnToPanelHome()) return;
        if(canGoBack && history.length>1) history.back();
        else App.exitApp();
      });
    } catch(error){ console.warn('Não foi possível ativar o botão voltar do Android:',error); }
  })();
})();