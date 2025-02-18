import { FC, useEffect, useState } from 'react';
import Modal, { LinkWrapper } from 'dappnode/components/modal';
import Link from 'next/link';
import { PATH } from 'consts/urls';
import useGetTelegramData from 'dappnode/hooks/use-get-telegram-data';

export const NotificationsModal: FC = () => {
  const { botToken, telegramId, getTelegramData } = useGetTelegramData();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      await getTelegramData();
    };
    void fetchData();
  }, [getTelegramData]);

  useEffect(() => {
    if ((!botToken || !telegramId) && !localStorage.getItem('isTgSeen')) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [botToken, telegramId]);

  const handleClose = () => {
    localStorage.setItem('isTgSeen', 'true');
    setIsOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <h3>Set up Notifications!</h3>
        <div>
          In order to get notifications about penalties, when your validators
          exited, and other important events, you need to set up notifications.
        </div>
        <LinkWrapper>
          <Link href={PATH.NOTIFICATIONS} target="_self">
            Navigate here!
          </Link>
        </LinkWrapper>
      </Modal>
    </>
  );
};
