import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ speed: 400, showSpinner: false });

let activeRequests = 0;

export const loaderService = {
  show(): void {
    if (activeRequests === 0) {
      NProgress.start();
    }
    activeRequests++;
  },
  hide(): void {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      NProgress.done();
    }
  },
};
