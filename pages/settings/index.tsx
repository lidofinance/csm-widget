import { PATH } from 'consts/urls';
import { SettingsPage } from 'features/settings';
import { GateLoaded, Navigate, useCorrectPath } from 'shared/navigate';

const SettingsIndex = () => {
  const correctPath = useCorrectPath(PATH.SETTINGS);

  // A hard load bypasses the LocalLink redirect, so claimer-only wallets and
  // invitees are sent to the inbox here too.
  if (correctPath !== PATH.SETTINGS) return <Navigate path={correctPath} />;
  return <SettingsPage />;
};

const Page = () => (
  <GateLoaded>
    <SettingsIndex />
  </GateLoaded>
);

export default Page;
