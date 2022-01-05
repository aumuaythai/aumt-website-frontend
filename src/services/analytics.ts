import firebase from 'firebase/app';
import 'firebase/analytics';

class Analytics {
    private analytics: firebase.analytics.Analytics | null = null;

    public initialize = (): void => {
        this.analytics = firebase.analytics();
    }

    /**
     * Add analytics methods and call them from here:
     */

    public logNotification = (notification: string): void => {
        this.analytics?.logEvent('notification', { notification });
    }    
}

export default new Analytics();