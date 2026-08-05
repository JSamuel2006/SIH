import React, { createContext, useContext, useState } from 'react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'ALERT' | 'INFO' | 'SUCCESS';
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'OUTBREAK ALERT: Pune Haveli Tehsil',
      message: 'Statistical anomaly detected: Dengue query spike Z-Score > 3.4 in past 24 hours.',
      type: 'ALERT',
      timestamp: '10 minutes ago',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'CAMPAIGN DISPATCH SUCCESS',
      message: '45,000 SMS health advisories delivered to Haveli Block residents.',
      type: 'SUCCESS',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'ICMR Guideline Sync Complete',
      message: 'Vector store Qdrant updated with 12 new NVBDCP clinical guidelines.',
      type: 'INFO',
      timestamp: '3 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
