import { useEffect, useState } from 'react';
import { useChromeSyncStorage } from './useChromeSyncStorage';

// Keeps customized sites in sync with useChromeSyncStorage
export function useCustomizedHosts() {
  const { storageValue, partialUpdateStorageValue } = useChromeSyncStorage();

  const [customizedHosts, setCustomizedHosts] = useState(storageValue)

  useEffect(() => {
    setCustomizedHosts(
      Object.fromEntries(Object.entries(storageValue).filter(([k, v]) => !!v))
    );
  }, [storageValue])

  const customizeHost = (host) => partialUpdateStorageValue(host, true)
  const uncustomizeHost = (host) => partialUpdateStorageValue(host, false)

  return { customizeHost, uncustomizeHost, customizedHosts }
}
