import { FC, useEffect, useState } from 'react';
import { BeaconchainPubkeyLink, Stack } from 'shared/components';
import {
  AddressRow,
  NumWarningsLabel,
  ValidatorMapStack,
  WarningCard,
} from './styles';
import { LoaderWrapperStyle } from 'shared/navigate/splash/loader-banner/styles';
import { Link, Loader, Tooltip } from '@lidofinance/lido-ui';
import { Address } from '@lidofinance/address';
import { WarnedValidator } from './types';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import useMissingKeys from 'dappnode/hooks/use-missing-keys';
import useGetExitRequests from 'dappnode/hooks/use-get-exit-requests';
import ImportKeysWarningModal from './import-keys-warning-modal';
import useGetRelaysData from 'dappnode/hooks/use-get-relays-data';
import { useGetInfraStatus } from 'dappnode/hooks/use-get-infra-status';

export const Warnings: FC = () => {
  const { brainUrl, stakersUiUrl, MEVPackageConfig } = useDappnodeUrls();
  const { missingKeys, keysLoading, error: errorBrain } = useMissingKeys();
  const { exitRequests, getExitRequests } = useGetExitRequests();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const { ECStatus, CCStatus, isCCLoading, isECLoading } = useGetInfraStatus();
  const {
    isMEVRunning,
    hasMandatoryRelay,
    mandatoryRelays,
    usedBlacklistedRelays,
    isLoading: relaysLoading,
  } = useGetRelaysData();

  const [validatorsExitRequests, setValidatorsExitRequests] = useState<
    WarnedValidator[]
  >([]);

  const [numWarnings, setNumWarnings] = useState(0);
  useEffect(() => {
    void getExitRequests();
  }, [getExitRequests]);

  useEffect(() => {
    if (exitRequests) {
      Object.keys(exitRequests).forEach((key) => {
        setValidatorsExitRequests((prevState) => [
          ...prevState,
          {
            index: exitRequests[key].event.ValidatorIndex,
            pubkey: exitRequests[key].validator_pubkey_hex,
          },
        ]);
      });
    }
  }, [exitRequests]);

  useEffect(() => {
    setNumWarnings(
      validatorsExitRequests.length +
        (errorBrain ? 1 : missingKeys.length) +
        (ECStatus === 'Not installed' ? 1 : 0) +
        (CCStatus === 'Not installed' ? 1 : 0) +
        (isMEVRunning ? 0 : 1) +
        (isMEVRunning && mandatoryRelays && !hasMandatoryRelay ? 1 : 0) +
        (isMEVRunning && usedBlacklistedRelays.length > 0 ? 1 : 0),
    );
  }, [
    validatorsExitRequests,
    errorBrain,
    missingKeys,
    ECStatus,
    CCStatus,
    isMEVRunning,
    mandatoryRelays,
    hasMandatoryRelay,
    usedBlacklistedRelays,
  ]);

  return (
    <Stack direction="column" gap="sm">
      {keysLoading || isCCLoading || isECLoading || relaysLoading ? (
        <LoaderWrapperStyle>
          <Loader size="medium" />
        </LoaderWrapperStyle>
      ) : (
        <>
          <WarningCard $hasWarning={numWarnings > 0}>
            <div>
              {numWarnings > 0 ? (
                <h3>
                  You have <NumWarningsLabel>{numWarnings}</NumWarningsLabel>{' '}
                  warning/s
                </h3>
              ) : (
                "You don't have any warnings"
              )}
            </div>
          </WarningCard>

          {ECStatus === 'Not installed' && (
            <WarningCard $direction="column">
              <h3>Your Execution Client is not installed!</h3>
              <p>Please, select and sync a client from the Stakers tab.</p>
              <Link href={stakersUiUrl}> Set Execution Client</Link>
            </WarningCard>
          )}

          {CCStatus === 'Not installed' && (
            <WarningCard $direction="column">
              <h3>Your Consensus Client is not installed!</h3>
              <p>Please, select and sync a client from the Stakers tab.</p>
              <Link href={stakersUiUrl}> Set Consensus Client</Link>
            </WarningCard>
          )}

          {!errorBrain ? (
            <>
              {missingKeys.length > 0 && (
                <Stack direction="column" gap="sm">
                  {missingKeys.length > 0 && (
                    <WarningCard $direction="column">
                      <h3>
                        {' '}
                        <NumWarningsLabel>
                          {missingKeys.length}
                        </NumWarningsLabel>{' '}
                        keys are not imported in Web3Signer
                      </h3>
                      {missingKeys.map((key, _) => (
                        <AddressRow key={key}>
                          <Address address={key} symbols={16} />
                          <BeaconchainPubkeyLink pubkey={key} />
                        </AddressRow>
                      ))}
                      <button onClick={() => setIsImportModalOpen(true)}>
                        <Link href={undefined}> Import keys</Link>
                      </button>

                      <ImportKeysWarningModal
                        isOpen={isImportModalOpen}
                        setIsOpen={setIsImportModalOpen}
                      />
                    </WarningCard>
                  )}
                </Stack>
              )}
            </>
          ) : (
            <WarningCard $direction="column">
              <h3>Your Brain API is not Up!</h3>
              <p>Please, if Web3Signer is already installed, re-install it</p>
              <Link href={stakersUiUrl}> Set Web3Signer</Link>
            </WarningCard>
          )}

          {validatorsExitRequests.length > 0 && (
            <WarningCard>
              <ValidatorMapStack $direction="column">
                <Tooltip
                  placement="top"
                  title="At least one of your validators has been requested by Lido to exit"
                >
                  <h3>
                    <NumWarningsLabel>
                      {validatorsExitRequests.length}
                    </NumWarningsLabel>{' '}
                    Validator/s requested to exit
                  </h3>
                </Tooltip>
                {validatorsExitRequests.map((val, _) => (
                  <AddressRow key={val.pubkey}>
                    <p>{val.index}</p>
                    <BeaconchainPubkeyLink pubkey={val.pubkey} />
                  </AddressRow>
                ))}
                <Link href={brainUrl}>Exit validators</Link>
              </ValidatorMapStack>
            </WarningCard>
          )}

          {!isMEVRunning && (
            <WarningCard>
              <ValidatorMapStack $direction="column">
                <h3>MEV Boost Package is not running</h3>
                <p>Install or restart your MEV Boost Package</p>
                <Link href={stakersUiUrl}> Set MEV Boost</Link>
              </ValidatorMapStack>
            </WarningCard>
          )}

          {isMEVRunning && mandatoryRelays && !hasMandatoryRelay && (
            <WarningCard>
              <ValidatorMapStack $direction="column">
                <h3>No mandatory Relays found</h3>
                <p>
                  Select at least one of the mandatory MEV relays requested by
                  Lido
                </p>
                {mandatoryRelays.map((relay, i) => (
                  <p key={i}>{'- ' + relay.Operator}</p>
                ))}
                <Link href={stakersUiUrl}>Set up Relays</Link>
              </ValidatorMapStack>
            </WarningCard>
          )}

          {isMEVRunning && usedBlacklistedRelays.length > 0 && (
            <WarningCard>
              <ValidatorMapStack $direction="column">
                <h3>Blacklisted Relays found</h3>
                <p>The following selected relays are blacklisted by Lido:</p>
                {usedBlacklistedRelays.map((relay, i) => (
                  <div key={i}>
                    - <Address symbols={30} address={relay} />
                  </div>
                ))}
                <p>Please, remove the Relays above from your MEV config</p>
                <Link href={MEVPackageConfig}>Remove blacklisted relays</Link>
              </ValidatorMapStack>
            </WarningCard>
          )}
        </>
      )}
    </Stack>
  );
};
