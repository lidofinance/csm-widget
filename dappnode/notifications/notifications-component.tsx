import { FormBlock, FormTitle, Latice, Note, Stack } from 'shared/components';
import { useCallback, useEffect, useState } from 'react';
import { Button, Link, Loader } from '@lidofinance/lido-ui';
import isTelegramUserId from 'dappnode/utils/is-tg-user-id';
import isTelegramBotToken from 'dappnode/utils/is-tg-bot-token';
import { BotTokenWrapper, InfoWrapper } from './styles';
import { InputTelegram } from './input-tg';
import { dappnodeLidoDocsUrls } from 'dappnode/utils/dappnode-docs-urls';
import useGetTelegramData from 'dappnode/hooks/use-get-telegram-data';
import usePostTelegramData from 'dappnode/hooks/use-post-telegram-data';
import { ReactComponent as EyeOn } from 'assets/icons/eye-on.svg';
import { ReactComponent as EyeOff } from 'assets/icons/eye-off.svg';
import { EyeIcon } from './styles';
import {
  ErrorWrapper,
  SuccessWrapper,
} from 'dappnode/components/text-wrappers';
import { NotificationsSteps } from './notifications-setup-steps';
import { LoaderWrapperStyle } from 'shared/navigate/splash/loader-banner/styles';

export const NotificationsComponent = () => {
  const [newTgUserId, setNewTgUserId] = useState('');
  const [isUserIdValid, setIsUserIDValid] = useState(false);

  const {
    telegramId,
    botToken,
    getTelegramData,
    isLoading: isTgGetLoading,
  } = useGetTelegramData();

  const [newTgBotToken, setNewTgBotToken] = useState('');
  const [isBotTokenValid, setIsBotTokenValid] = useState(false);
  const [showCurrentBotToken, setShowCurrentBotToken] = useState(false);

  const { postTelegramData, postTgError, isLoading, isSuccess } =
    usePostTelegramData({
      userId: Number(newTgUserId ? newTgUserId : telegramId),
      botToken: newTgBotToken ? newTgBotToken : botToken || '',
    });

  const fetchData = useCallback(async () => {
    await getTelegramData();
  }, [getTelegramData]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    setIsUserIDValid(isTelegramUserId(newTgUserId));
  }, [newTgUserId]);

  useEffect(() => {
    setIsBotTokenValid(isTelegramBotToken(newTgBotToken));
  }, [newTgBotToken]);

  const sameAsCurrentUserId = newTgUserId == telegramId;
  const sameAsCurrentBotToken = newTgBotToken === botToken;

  const userValidationError = () => {
    if (!newTgUserId) return null;
    if (!isUserIdValid) return 'Specify a valid user ID';
    if (sameAsCurrentUserId)
      return 'Should not be the same as the current user ID';
    return null;
  };

  const botTokenValidationError = () => {
    if (!newTgBotToken) return null;
    if (!isBotTokenValid) return 'Specify a valid bot token';
    if (sameAsCurrentBotToken)
      return 'Should not be the same as the current bot token';
    return null;
  };

  const handleSubmit = async () => {
    if (isUserIdValid || isBotTokenValid) {
      await postTelegramData();
      await fetchData();
      setNewTgUserId('');
      setNewTgBotToken('');
    }
  };

  return (
    <>
      <FormBlock>
        {!isTgGetLoading && (!telegramId || !botToken) && (
          <NotificationsSteps />
        )}
        <FormTitle>Current Telegram Data:</FormTitle>
        <Latice variant="secondary">
          <InfoWrapper>
            <Stack gap="lg">User ID</Stack>
            <p>{telegramId ? telegramId : '-'}</p>
          </InfoWrapper>
          <InfoWrapper>
            <BotTokenWrapper>
              <Stack gap="lg">Bot Token</Stack>
              <EyeIcon
                onClick={() => setShowCurrentBotToken(!showCurrentBotToken)}
              >
                {showCurrentBotToken ? <EyeOff /> : <EyeOn />}
              </EyeIcon>
            </BotTokenWrapper>
            <p>
              {botToken
                ? showCurrentBotToken
                  ? botToken
                  : '*******************************'
                : '-'}
            </p>
          </InfoWrapper>
        </Latice>
        <FormTitle>Insert New Telegram Data:</FormTitle>
        <InputTelegram
          label="Insert new Telegram User ID"
          placeholder="User ID"
          error={userValidationError()}
          value={newTgUserId}
          onChange={(newValue) => setNewTgUserId(newValue)}
        />
        <InputTelegram
          isPassword
          label="Insert new Telegram Bot Token"
          placeholder="Bot Token"
          error={botTokenValidationError()}
          value={newTgBotToken}
          onChange={(newValue) => setNewTgBotToken(newValue)}
        />
        {postTgError && <ErrorWrapper>{postTgError}</ErrorWrapper>}
        {isSuccess && (
          <SuccessWrapper>
            Notifications configuration set! Ensure that test alert was sent to
            your Telegram!
          </SuccessWrapper>
        )}

        <Button
          fullwidth
          type="submit"
          loading={false}
          onClick={handleSubmit}
          disabled={
            (!newTgUserId && !telegramId) ||
            (!newTgBotToken && !botToken) ||
            // any input is filled but invalid
            (!!newTgUserId && !isUserIdValid) ||
            (!!newTgBotToken && !isBotTokenValid) ||
            // any input is filled but the value is the same as before
            (!!newTgUserId && sameAsCurrentUserId) ||
            (!!newTgBotToken && sameAsCurrentBotToken) ||
            isLoading
          }
        >
          {isLoading ? (
            <LoaderWrapperStyle>
              <Loader size="small" color="secondary" />
            </LoaderWrapperStyle>
          ) : (
            'Update Telegram Data'
          )}
        </Button>
        <Note>
          You can find a guide on how to get this data in{' '}
          <Link href={dappnodeLidoDocsUrls.notificationsOperatorExists}>
            our Documentation
          </Link>
          .
        </Note>
      </FormBlock>
    </>
  );
};
