// Handle the Android hardware back button inside the Capacitor app.
(async () => {
  const capacitor = window.Capacitor;
  if (!capacitor || typeof capacitor.isNativePlatform !== 'function' || !capacitor.isNativePlatform()) return;
  try {
    const { App } = await import('https://esm.sh/@capacitor/app@8.0.0');
    await App.addListener('backButton', ({ canGoBack }) => {
      if (document.body.classList.contains('menu-open')) {
        document.body.classList.remove('menu-open');
        document.getElementById('menuToggle')?.setAttribute('aria-expanded', 'false');
        return;
      }
      if (canGoBack && window.history.length > 1) window.history.back();
      else App.exitApp();
    });
  } catch (error) {
    console.warn('Não foi possível ativar o botão voltar do Android:', error);
  }
})();
