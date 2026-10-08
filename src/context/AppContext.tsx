import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Citizen, DigiProProfile, Application, ConsentRecord, PaymentRecord } from '../types';
import { MOCK_CITIZENS } from '../data/mockCitizens';
import { digiProService } from '../services/digipro';
import { applicationService } from '../services/application';
import { consentService } from '../services/consent';
import { paymentService } from '../services/payment';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  activeCitizen: Citizen;
  activeProfile: DigiProProfile | null;
  allCitizens: Citizen[];
  setActiveCitizenId: (id: string) => void;
  applications: Application[];
  consents: ConsentRecord[];
  payments: PaymentRecord[];
  refreshData: () => Promise<void>;
  createApplication: (draft: Partial<Application>) => Promise<Application>;
  markApplicationPaid: (applicationId: string, paymentId: string, amount: number) => Promise<Application | null>;
  recordPayment: (record: Omit<PaymentRecord, 'id' | 'created_at'>) => Promise<PaymentRecord>;
  recordConsent: (record: Omit<ConsentRecord, 'id'>) => Promise<ConsentRecord>;
  revokeConsent: (consentId: string) => Promise<boolean>;
  toasts: ToastNotification[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
  isDemoMode: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCitizen, setActiveCitizen] = useState<Citizen>(MOCK_CITIZENS[0]);
  const [activeProfile, setActiveProfile] = useState<DigiProProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadProfileAndUserData = useCallback(async (citizenId: string) => {
    try {
      const profile = await digiProService.getProfile(citizenId);
      setActiveProfile(profile);

      const userApps = await applicationService.getApplicationsForUser(citizenId);
      setApplications(userApps);

      const userConsents = await consentService.getConsentsForUser(citizenId);
      setConsents(userConsents);

      const userPayments = await paymentService.getPaymentsForUser(citizenId);
      setPayments(userPayments);
    } catch (err) {
      console.warn('Error loading user data:', err);
    }
  }, []);

  useEffect(() => {
    loadProfileAndUserData(activeCitizen.id);
  }, [activeCitizen.id, loadProfileAndUserData]);

  const setActiveCitizenId = (id: string) => {
    const found = MOCK_CITIZENS.find((c) => c.id === id);
    if (found) {
      setActiveCitizen(found);
      showToast(`Switched active citizen to ${found.name}`, 'info');
    }
  };

  const refreshData = async () => {
    await loadProfileAndUserData(activeCitizen.id);
  };

  const handleCreateApplication = async (draft: Partial<Application>): Promise<Application> => {
    const created = await applicationService.createApplication({
      ...draft,
      userId: activeCitizen.id,
    });
    await refreshData();
    return created;
  };

  const handleMarkApplicationPaid = async (
    applicationId: string,
    paymentId: string,
    amount: number
  ): Promise<Application | null> => {
    const updated = await applicationService.markApplicationAsPaid(applicationId, paymentId, amount);
    await refreshData();
    showToast(`Payment confirmed! Application ${applicationId} submitted successfully.`, 'success');
    return updated;
  };

  const handleRecordPayment = async (
    record: Omit<PaymentRecord, 'id' | 'created_at'>
  ): Promise<PaymentRecord> => {
    const saved = await paymentService.createPayment({
      ...record,
      user_id: activeCitizen.id,
    });
    await refreshData();
    return saved;
  };

  const handleRecordConsent = async (record: Omit<ConsentRecord, 'id'>): Promise<ConsentRecord> => {
    const saved = await consentService.recordConsent({
      ...record,
      userId: activeCitizen.id,
    });
    await refreshData();
    return saved;
  };

  const handleRevokeConsent = async (consentId: string): Promise<boolean> => {
    const ok = await consentService.revokeConsent(consentId);
    if (ok) {
      await refreshData();
      showToast('Consent revoked successfully', 'warning');
    }
    return ok;
  };

  return (
    <AppContext.Provider
      value={{
        activeCitizen,
        activeProfile,
        allCitizens: MOCK_CITIZENS,
        setActiveCitizenId,
        applications,
        consents,
        payments,
        refreshData,
        createApplication: handleCreateApplication,
        markApplicationPaid: handleMarkApplicationPaid,
        recordPayment: handleRecordPayment,
        recordConsent: handleRecordConsent,
        revokeConsent: handleRevokeConsent,
        toasts,
        showToast,
        dismissToast,
        isDemoMode: true,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
