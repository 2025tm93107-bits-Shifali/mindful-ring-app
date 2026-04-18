import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

const TOAST_KEY = 'habit-reminder-toast-date';
const NOTIF_KEY = 'habit-reminder-notif-date';
const NOTIF_TIME_KEY = 'habit-reminder-time'; // "HH:MM"
const NOTIF_ENABLED_KEY = 'habit-reminder-enabled';

const todayStr = () => new Date().toISOString().split('T')[0];

export const getReminderTime = () => localStorage.getItem(NOTIF_TIME_KEY) || '09:00';
export const setReminderTime = (t: string) => localStorage.setItem(NOTIF_TIME_KEY, t);
export const isNotifEnabled = () => localStorage.getItem(NOTIF_ENABLED_KEY) === 'true';
export const setNotifEnabled = (v: boolean) =>
  localStorage.setItem(NOTIF_ENABLED_KEY, String(v));

const showToast = (pendingCount: number) => {
  const last = localStorage.getItem(TOAST_KEY);
  if (last === todayStr()) return;
  localStorage.setItem(TOAST_KEY, todayStr());
  const msg =
    pendingCount > 0
      ? `You have ${pendingCount} habit${pendingCount === 1 ? '' : 's'} to check off today 🌱`
      : 'All habits done — keep the streak alive! 🔥';
  toast('Good morning!', { description: msg, duration: 6000 });
};

const showBrowserNotif = (pendingCount: number) => {
  if (!('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (!isNotifEnabled()) return;
  const last = localStorage.getItem(NOTIF_KEY);
  if (last === todayStr()) return;
  localStorage.setItem(NOTIF_KEY, todayStr());
  const body =
    pendingCount > 0
      ? `You have ${pendingCount} habit${pendingCount === 1 ? '' : 's'} pending today.`
      : 'You crushed it — all habits done!';
  new Notification('Habit Tracker', { body, icon: '/favicon.ico' });
};

const isPastReminderTime = () => {
  const [h, m] = getReminderTime().split(':').map(Number);
  const now = new Date();
  return now.getHours() > h || (now.getHours() === h && now.getMinutes() >= m);
};

export const useDailyReminder = (
  pendingCount: number,
  loading: boolean,
) => {
  const triggered = useRef(false);

  useEffect(() => {
    if (loading || triggered.current) return;
    triggered.current = true;

    // 1. Always show in-app toast on first load of the day
    showToast(pendingCount);

    // 2. Browser notification (if past scheduled time and not yet sent today)
    if (isPastReminderTime()) showBrowserNotif(pendingCount);

    // 3. Schedule timer to fire at the chosen reminder time if not yet past
    const [h, m] = getReminderTime().split(':').map(Number);
    const next = new Date();
    next.setHours(h, m, 0, 0);
    const ms = next.getTime() - Date.now();
    if (ms > 0 && ms < 24 * 60 * 60 * 1000) {
      const id = setTimeout(() => {
        showBrowserNotif(pendingCount);
        showToast(pendingCount);
      }, ms);
      return () => clearTimeout(id);
    }
  }, [loading, pendingCount]);
};
