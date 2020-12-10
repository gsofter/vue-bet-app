/**
 * Request screen to make full screen mode
 */
export function requestFullScreenMode() {
  const refElement = document.documentElement as HTMLElement & {
    mozRequestFullScreen(): Promise<void>;
    webkitRequestFullscreen(): Promise<void>;
    msRequestFullscreen(): Promise<void>;
  };
  if (refElement) {
    if (refElement.requestFullscreen) {
      refElement.requestFullscreen();
    } else if (refElement.msRequestFullscreen) {
      refElement.msRequestFullscreen();
    } else if (refElement.mozRequestFullScreen) {
      refElement.mozRequestFullScreen();
    } else if (refElement.webkitRequestFullscreen) {
      refElement.webkitRequestFullscreen();
    }
  }
}
/* Close fullscreen */
export function closeFullscreenMode() {
  const refElement = document as any & {
    exitFullscreen(): Promise<void>;
    mozCancelFullScreen(): Promise<void>;
    webkitExitFullscreen(): Promise<void>;
    msExitFullscreen(): Promise<void>;
  };
  if (refElement.exitFullscreen) {
    refElement.exitFullscreen();
  } else if (refElement.mozCancelFullScreen) { /* Firefox */
    refElement.mozCancelFullScreen();
  } else if (refElement.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    refElement.webkitExitFullscreen();
  } else if (refElement.msExitFullscreen) { /* IE/Edge */
    refElement.msExitFullscreen();
  }
}
/**
 * Evaluate whether the current device is mobile version or not
 * @return {Boolean}
 */
export function isCompatibleVW(screenSize: number) {
  const currentVW = window.screen.width;
  return currentVW <= screenSize;
}

export function getUrlPathCount() {
  const path = window.location.pathname;
  return path.match(new RegExp('/', 'g')).length;
}
