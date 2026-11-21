import { useCallback, useState } from 'react';
import { loginAccount, logoutAccount, registerAccount, restoreAuthSnapshot, updateAccountProfile } from './service';
import type { Account, AccountProfileUpdate, AuthSnapshot, SignUpInput } from './types';

function initialSnapshot(): AuthSnapshot {
  try {
    return restoreAuthSnapshot();
  } catch (error) {
    return {
      account: null,
      accountCount: 0,
      loadError: error instanceof Error ? error.message : 'Account data could not be loaded.',
    };
  }
}

export function useLocalAuth() {
  const [snapshot, setSnapshot] = useState<AuthSnapshot>(initialSnapshot);

  const signUp = useCallback(async (input: SignUpInput) => {
    const account = await registerAccount(input);
    setSnapshot(current => ({ account, accountCount: current.accountCount + 1, loadError: null }));
    return account;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const account = await loginAccount(email, password);
    setSnapshot(current => ({ ...current, account, loadError: null }));
    return account;
  }, []);

  const logout = useCallback(() => {
    logoutAccount();
    setSnapshot(current => ({ ...current, account: null, loadError: null }));
  }, []);

  const updateProfile = useCallback((update: AccountProfileUpdate) => {
    if (!snapshot.account) throw new Error('Sign in before editing your profile.');
    const account = updateAccountProfile(snapshot.account.id, update);
    setSnapshot(current => ({ ...current, account }));
    return account;
  }, [snapshot.account]);

  return {
    account: snapshot.account,
    accountCount: snapshot.accountCount,
    loadError: snapshot.loadError,
    signUp,
    login,
    logout,
    updateProfile,
  };
}
