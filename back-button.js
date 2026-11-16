// Android hardware-back handling for the Funcional Spartan app.
(async () => {
  const capacitor = window.Capacitor;
  if (!capacitor || typeof capacitor.isNativePlatform !== 'function' || !capacitor.isNativePlatform()) return;

  try {
    const { App } = await import('https://esm.sh/@capacitor/app@8.0.0');

    function returnToPanelHome() {
      const path = window.location.pathname;

      // Área do aluno: the first back action from any section returns to the Início tab.
      if (path.startsWith('/aluno')) {
        const memberView = document.getElementById('memberView');
        const visible = memberView && !memberView.hidden && getComputedStyle(memberView).display !== 'none';
        if (visible) {
          const activeTab = memberView.querySelector('[data-tab].active');
          if (activeTab && activeTab.dataset.tab !== 'home') {
            memberView.querySelector('[data-tab="home"]')?.click();
            return true;
          }
        }
      }

      // Admin: the first back action from any admin section returns to the Alunos dashboard.
      if (path.startsWith('/admin')) {
        const dashboard = document.getElementById('dashboardView');
        const visible = dashboard && !dashboard.hidden && getComputedStyle(dashboard).display !== 'none';
        if (visible) {
          const activeTab = dashboard.querySelector('.admin-tab.active');
          if (activeTab && activeTab.dataset.tab !== 'studentsTab') {
            dashboard.querySelector('.admin-tab[data-tab="studentsTab"]')?.click();
            return true;
          }
        }
      }

      return false;
    }

    await App.addListener('backButton', ({ canGoBack }) => {
      if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
        return;
      }

      if (returnToPanelHome()) return;
      if (canGoBack && window.history.length > 1) window.history.back();
      else App.exitApp();
    });
  } catch (error) {
    console.warn('Não foi possível ativar o botão voltar do Android:', error);
  }
})();
