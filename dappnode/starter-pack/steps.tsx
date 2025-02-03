import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import NextLink from 'next/link';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { MatomoLink, Note } from 'shared/components';
import { Step2InfraRow, InfraInstalledLabel, ButtonsRow } from './styles';
import { Step } from './step-wrapper';
import { Button, Link } from '@lidofinance/lido-ui';
import { CONSTANTS_BY_NETWORK } from 'consts/csm-constants';
import { PATH } from 'consts/urls';
import { trackMatomoEvent } from 'utils';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import { InputTelegram } from 'dappnode/notifications/input-tg';
import { dappnodeLidoDocsUrls } from 'dappnode/utils/dappnode-docs-urls';
import isTelegramUserID from 'dappnode/utils/is-tg-user-id';
import isTelegramBotToken from 'dappnode/utils/is-tg-bot-token';
import { useChainId } from 'wagmi';
import usePostTelegramData from 'dappnode/hooks/use-post-telegram-data';
import useApiBrain from 'dappnode/hooks/use-brain-keystore-api';
import { useGetInfraStatus } from 'dappnode/hooks/use-get-infra-status';
import useGetTelegramData from 'dappnode/hooks/use-get-telegram-data';
import { Loader } from '@lidofinance/lido-ui';
import { ErrorWrapper } from 'dappnode/components/text-wrappers';
import { LoaderWrapperStyle } from 'shared/navigate/splash/loader-banner/styles';
import { NotificationsSteps } from 'dappnode/notifications/notifications-setup-steps';
import { CHAINS } from '@lido-sdk/constants';
import useGetRelaysData from 'dappnode/hooks/use-get-relays-data';

export const Steps: FC = () => {
  const StepsTitles: Record<number, string> = {
    1: 'Have Tokens for Bond',
    2: 'Set Up your node',
    3: 'Set up Notifications',
    4: 'Generate Keys',
  };

  const [step, setStep] = useState<number>(1);

  return step === 1 ? (
    <Step1 step={step} title={StepsTitles[step]} setStep={setStep} />
  ) : step === 2 ? (
    <Step2 step={step} title={StepsTitles[step]} setStep={setStep} />
  ) : step === 3 ? (
    <Step3 step={step} title={StepsTitles[step]} setStep={setStep} />
  ) : step === 4 ? (
    <Step4 step={step} title={StepsTitles[step]} setStep={setStep} />
  ) : (
    'Error: Please, reload the page!'
  );
};

interface StepsProps {
  step: number;
  title: string;
  setStep: Dispatch<SetStateAction<number>>;
}

const Step1: FC<StepsProps> = ({ step, title, setStep }: StepsProps) => (
  <>
    <Step stepNum={step.toString()} title={title}>
      <p>
        Bond is a security collateral submitted by Node Operators <br />
        before uploading validator keys, covering potential losses from
        inappropriate actions.
      </p>
      <ul>
        <li>
          {' '}
          <p>
            It can be claimed or reused once the validator exits and any losses
            are covered.
          </p>
        </li>
        <br />
        <li>
          {' '}
          <p>
            2 Holesky ETH (stETH / wstETH equivalent) is required for the first
            validator{' '}
          </p>
        </li>
      </ul>

      <MatomoLink
        href="https://operatorportal.lido.fi/modules/community-staking-module#block-e4a6daadca12480d955524247f03f380"
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackBondLink}
      >
        Learn more
      </MatomoLink>
    </Step>
    <Button
      onClick={() => {
        setStep((prevState) => prevState + 1);
      }}
    >
      Next
    </Button>
  </>
);

const Step2: FC<StepsProps> = ({ step, title, setStep }: StepsProps) => {
  const { ECStatus, CCStatus, isECLoading, isCCLoading } = useGetInfraStatus();
  const { error: brainError, isLoading: brainLoading } = useApiBrain();
  const { isMEVRunning, isLoading: relaysLoading } = useGetRelaysData();

  const isECSynced: boolean = ECStatus === 'Synced';
  const isCCSynced: boolean = CCStatus === 'Synced';

  const isSignerInstalled: boolean = brainError ? false : true;

  const isMEVInstalled: boolean = isMEVRunning ?? false;

  const isNextBtnDisabled: boolean =
    !isECSynced || !isCCSynced || !isSignerInstalled || !isMEVInstalled;

  const { stakersUiUrl: stakersUrl } = useDappnodeUrls();

  const chainId = useChainId();
  return (
    <>
      <Step stepNum={step.toString()} title={title}>
        <p>
          In order to be a Node Operator you must have a synced{' '}
          {CHAINS[chainId]} Node and run MEV Boost.
        </p>
        <Step2InfraRow>
          <p>Execution Client</p>
          <p>{'->'}</p>
          <p>
            {isECLoading ? (
              <LoaderWrapperStyle>
                <Loader size="small" color="secondary" />
              </LoaderWrapperStyle>
            ) : (
              <InfraInstalledLabel $isInstalled={isECSynced}>
                {ECStatus}
              </InfraInstalledLabel>
            )}
          </p>
        </Step2InfraRow>
        <Step2InfraRow>
          <p>Consensus Client</p>
          <p>{'->'}</p>

          <p>
            {isCCLoading ? (
              <LoaderWrapperStyle>
                <Loader size="small" color="secondary" />
              </LoaderWrapperStyle>
            ) : (
              <InfraInstalledLabel $isInstalled={isCCSynced}>
                {CCStatus}
              </InfraInstalledLabel>
            )}
          </p>
        </Step2InfraRow>
        <Step2InfraRow>
          <p>Web3signer</p>
          <p>{'->'}</p>
          <p>
            {brainLoading ? (
              <LoaderWrapperStyle>
                <Loader size="small" color="secondary" />
              </LoaderWrapperStyle>
            ) : (
              <InfraInstalledLabel $isInstalled={isSignerInstalled}>
                {isSignerInstalled ? 'Installed' : 'Not installed'}
              </InfraInstalledLabel>
            )}
          </p>
        </Step2InfraRow>
        <Step2InfraRow>
          <p>MEV Boost</p>
          <p>{'->'}</p>
          <p>
            {relaysLoading ? (
              <LoaderWrapperStyle>
                <Loader size="small" color="secondary" />
              </LoaderWrapperStyle>
            ) : (
              <InfraInstalledLabel $isInstalled={isMEVInstalled}>
                {isMEVInstalled ? 'Installed' : 'Not installed'}
              </InfraInstalledLabel>
            )}
          </p>
        </Step2InfraRow>
        {!isECSynced ||
          (!isCCSynced && (
            <div>
              <ErrorWrapper>
                You must have a synced {CHAINS[chainId]} Node and run MEV Boost.
              </ErrorWrapper>
            </div>
          ))}
        {!!brainError && (
          <div>
            <ErrorWrapper>You must have Web3Signer installed.</ErrorWrapper>
          </div>
        )}
        <Link href={stakersUrl}>Set up your node</Link>{' '}
      </Step>

      <ButtonsRow>
        <Button
          variant="outlined"
          onClick={() => {
            setStep((prevState) => prevState - 1);
          }}
        >
          Back
        </Button>

        <Button
          onClick={() => {
            setStep((prevState) => prevState + 1);
          }}
          disabled={
            isNextBtnDisabled || isECLoading || isCCLoading || brainLoading
          }
        >
          {'Next'}
        </Button>
      </ButtonsRow>
    </>
  );
};

const Step3: FC<StepsProps> = ({ step, title, setStep }: StepsProps) => {
  const {
    botToken,
    telegramId,
    getTelegramData,
    isLoading: isTgGetLoading,
  } = useGetTelegramData();

  const [tgUserId, setTgUserId] = useState<string>('');
  const [tgBotToken, setTgBotToken] = useState<string>('');

  const [isUserIdValid, setIsUserIDValid] = useState(false);
  const [isBotTokenValid, setIsBotTokenValid] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getTelegramData();
    };

    void fetchData();
  }, [getTelegramData]);

  useEffect(() => {
    setTgUserId(telegramId || '');
    setTgBotToken(botToken || '');
  }, [telegramId, botToken]);

  const { postTelegramData, postTgError, isLoading, isSuccess } =
    usePostTelegramData({
      userId: Number(tgUserId),
      botToken: tgBotToken,
    });

  useEffect(() => {
    setIsUserIDValid(isTelegramUserID(tgUserId));
  }, [tgUserId]);

  useEffect(() => {
    setIsBotTokenValid(isTelegramBotToken(tgBotToken));
  }, [tgBotToken]);

  const userValidationError = () => {
    if (!tgUserId) return null;
    if (!isUserIdValid) return 'Specify a valid user ID';
    return null;
  };

  const botTokenValidationError = () => {
    if (!tgBotToken) return null;
    if (!isBotTokenValid) return 'Specify a valid bot token';
    return null;
  };

  const handleNext = async () => {
    if (isBotTokenValid && isUserIdValid) {
      await postTelegramData();
    } else {
      setStep((prevState) => prevState + 1);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      void setStep((prevState) => prevState + 1);
    }
  }, [isSuccess, setStep]);
  return (
    <>
      <Step stepNum={step.toString()} title={title}>
        <p>
          Dappnode&apos;s Notification system allows you to receive alerts
          regardidng your node and validators directly to your telegram.
        </p>
        <p>Both inputs are needed to set up alerts ensuring your privacy.</p>
        {!isTgGetLoading && (!telegramId || !botToken) && (
          <NotificationsSteps />
        )}
        <InputTelegram
          label="Insert new Telegram User ID"
          placeholder="User ID"
          error={userValidationError()}
          value={tgUserId}
          onChange={(newValue) => setTgUserId(newValue)}
        />
        <InputTelegram
          isPassword
          label="Insert new Telegram Bot Token"
          placeholder="Bot Token"
          error={botTokenValidationError()}
          value={tgBotToken}
          onChange={(newValue) => setTgBotToken(newValue)}
        />

        <p>
          We highly recommend setting up these notifications to quickly detect
          underperformance and avoid penalties.
        </p>
      </Step>
      <Note>
        You can find a guide on how to set notifications in{' '}
        <Link href={dappnodeLidoDocsUrls.notificationsNewOperator}>
          our Documentation
        </Link>
        .
      </Note>
      {postTgError && <ErrorWrapper>{postTgError}</ErrorWrapper>}
      <ButtonsRow>
        <Button
          variant="outlined"
          onClick={() => {
            setStep((prevState) => prevState - 1);
          }}
        >
          Back
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            (tgUserId || tgBotToken
              ? !(isBotTokenValid && isUserIdValid) // Disable if either validation fails
              : false) || // Enable when both fields are empty
            isLoading
          }
        >
          {tgUserId || tgBotToken ? (
            isLoading ? (
              <LoaderWrapperStyle>
                <Loader size="small" color="secondary" />
              </LoaderWrapperStyle>
            ) : (
              'Next'
            )
          ) : (
            'Skip'
          )}
        </Button>
      </ButtonsRow>
    </>
  );
};
const Step4: FC<StepsProps> = ({ step, title, setStep }: StepsProps) => {
  const chainId = useChainId() as keyof typeof CONSTANTS_BY_NETWORK;

  const withdrawalByAddres =
    CONSTANTS_BY_NETWORK[chainId]?.withdrawalCredentials;

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator);
  }, []);
  return (
    <>
      <Step stepNum={step.toString()} title={title}>
        <p>
          In order to run a validator, you need to generate the necessary
          keystores and deposit data.
        </p>

        <p>
          Set <b>{withdrawalByAddres}</b> as the withdrawal address while
          generating the keystores. This is the Lido Withdrawal Vault on Holesky{' '}
        </p>
        <p>
          Prepare your deposit data (.json file) for submitting your keys in the
          next step.
        </p>
        <p>
          Just generate the keys, do <b>NOT</b> execute the deposits.
        </p>
      </Step>
      <Note>
        You can find a guide on how to generate keys in{' '}
        <Link href={dappnodeLidoDocsUrls.generateKeys}>our Documentation</Link>.
      </Note>
      <ButtonsRow>
        <Button
          variant="outlined"
          onClick={() => {
            setStep((prevState) => prevState - 1);
          }}
        >
          Back
        </Button>

        <NextLink href={PATH.CREATE} passHref legacyBehavior>
          <Button onClick={handleClick}>Create Node Operator</Button>
        </NextLink>
      </ButtonsRow>
    </>
  );
};
