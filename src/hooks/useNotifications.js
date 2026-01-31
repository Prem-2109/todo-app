import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
    const [permission, setPermission] = useState(Notification.permission);
    const [swRegistration, setSwRegistration] = useState(null);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    setSwRegistration(registration);
                })
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }, []);

    const requestPermission = async () => {
        if (!('Notification' in window)) {
            alert("This browser does not support desktop notification");
            return;
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
    };

    const sendNotification = useCallback((title, options = {}) => {
        if (permission === 'granted') {
            if (swRegistration) {
                // Using Service Worker for "Premium" feel (actions, icons)
                swRegistration.showNotification(title, options);
            } else {
                // Fallback
                new Notification(title, options);
            }
        }
    }, [permission, swRegistration]);

    const scheduleNotification = useCallback((title, options = {}, delayMs) => {
        setTimeout(() => {
            sendNotification(title, options);
        }, delayMs);
    }, [sendNotification]);

    return {
        permission,
        requestPermission,
        sendNotification,
        scheduleNotification
    };
}
