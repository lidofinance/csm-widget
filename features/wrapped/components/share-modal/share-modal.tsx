import { Button, Modal, ToastError, ToastInfo } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import type { ModalProps } from 'providers/modal-provider';
import { FC, useCallback, useEffect, useState } from 'react';
import { Stack } from 'shared/components';
import { formatPercent } from 'utils';
import { generateSlideImage } from 'utils/generate-slide-image';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { encodeSlideData } from 'utils/wrapped-hash-codec';
import type { WrappedStats } from '../../data';
import {
  ErrorPlaceholder,
  ImagePreviewWrapper,
  InstructionText,
  LoadingPlaceholder,
} from './styles';
import { useShareCapabilities } from './use-share-capabilities';

type ShareModalProps = ModalProps<{
  data: WrappedStats;
}>;

const plural = (count: number, singular: string, plural: string) =>
  count === 1 ? singular : plural;

const buildTweetText = (data: WrappedStats): string => {
  const statDefs = [
    {
      check: () => data.activeDays > 0,
      format: () => `${formatPercent(data.avgPerformance)} performance`,
    },
    {
      check: () => data.proposedBlocksCount > 0,
      format: () =>
        `${data.proposedBlocksCount} ${plural(data.proposedBlocksCount, 'block', 'blocks')} proposed`,
    },
    {
      check: () => data.totalRewardsETH > 0n,
      format: () =>
        `${(Number(data.totalRewardsETH) / 1e18).toFixed(4)} ETH earned`,
    },
    {
      check: () => data.activeDays > 0,
      format: () =>
        `${data.activeDays} ${plural(data.activeDays, 'day', 'days')} active`,
    },
    {
      check: () => data.uploadedKeysCount > 0,
      format: () =>
        `${data.uploadedKeysCount} ${plural(data.uploadedKeysCount, 'key', 'keys')} uploaded`,
    },
    {
      check: () => data.queueDays > 0,
      format: () =>
        `${data.queueDays} ${plural(data.queueDays, 'day', 'days')} in queue`,
    },
  ];

  const availableStats = statDefs.filter((stat) => stat.check()).slice(0, 3);

  let text = `My 2025 @LidoFinance CSM Wrapped: ${availableStats.map((s) => s.format()).join(', ')}`;

  if (data.hasICS) {
    text += '. ICS member!';
  }

  return text;
};

const buildShareUrl = (data: WrappedStats): string => {
  const slideData = {
    totalRewardsETH: data.totalRewardsETH,
    avgPerformance: data.avgPerformance,
    activeDays: data.activeDays,
    proposedBlocksCount: data.proposedBlocksCount,
    uploadedKeysCount: data.uploadedKeysCount,
    queueDays: data.queueDays,
    hasICS: data.hasICS,
  };
  const encodedHash = encodeSlideData(slideData);
  return `${window.location.origin}/wrapped-2025/share?data=${encodedHash}`;
};

export const ShareModal: FC<ShareModalProps> = ({ data, onClose }) => {
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { canCopyImage, canNativeShare } = useShareCapabilities();

  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsGenerating(true);
        const blob = await generateSlideImage(data);
        setImageBlob(blob);

        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err) {
        console.error('Failed to generate image:', err);
        setError('Failed to generate image');
      } finally {
        setIsGenerating(false);
      }
    };

    void generateImage();

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const tweetText = buildTweetText(data);
  const shareUrl = buildShareUrl(data);

  const openTwitterShareWindow = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`,
      'twitter-share',
      'width=550,height=420,resizable=yes,scrollbars=yes',
    );
  }, [tweetText, shareUrl]);

  const handleCopyAndShare = useCallback(async () => {
    if (!imageBlob) return;

    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': imageBlob }),
      ]);

      ToastInfo('Image copied! Paste into Twitter/X', {});
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareCopy);

      // Open Twitter after short delay
      setTimeout(() => {
        openTwitterShareWindow();
      }, 500);
    } catch (err) {
      console.error('Copy failed:', err);
      ToastError('Failed to copy image', {});
      // Fallback to download
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageBlob, openTwitterShareWindow]);

  const handleNativeShare = useCallback(async () => {
    if (!imageBlob) return;

    try {
      const file = new File([imageBlob], 'csm-wrapped-2025.png', {
        type: 'image/png',
      });

      await navigator.share({
        files: [file],
        title: tweetText,
        url: shareUrl,
      });

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareNative);
    } catch (err) {
      // Ignore AbortError (user cancelled)
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed:', err);
        ToastError('Failed to share', {});
      }
    }
  }, [imageBlob, tweetText, shareUrl]);

  const handleDownload = useCallback(() => {
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'csm-wrapped-2025.png';
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    ToastInfo('Image downloaded! Upload to Twitter/X', {});
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareDownload);
  }, [imageUrl]);

  const handleShareOnX = useCallback(() => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`,
      'twitter-share',
      'width=550,height=420,resizable=yes,scrollbars=yes',
    );
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareX);
  }, [tweetText, shareUrl]);

  return (
    <Modal open onClose={onClose} title="Share Your CSM Wrapped">
      {/* Image Preview */}
      <ImagePreviewWrapper>
        {isGenerating && <LoadingPlaceholder>Generating...</LoadingPlaceholder>}
        {error && <ErrorPlaceholder>{error}</ErrorPlaceholder>}
        {imageUrl && !isGenerating && !error && (
          <img src={imageUrl} alt="Wrapped 2025" />
        )}
      </ImagePreviewWrapper>

      {/* Action Buttons */}
      {!isGenerating && !error && (
        <Stack gap="sm" direction="column">
          {canCopyImage && (
            <Button onClick={handleCopyAndShare} size="sm" fullwidth>
              Copy Image & Open X
            </Button>
          )}

          {!canCopyImage && canNativeShare && (
            <Button onClick={handleNativeShare} size="sm" fullwidth>
              Share
            </Button>
          )}

          {!canCopyImage && !canNativeShare && (
            <>
              <Button onClick={handleDownload} size="sm" fullwidth>
                Download Image
              </Button>
              <Button
                onClick={handleShareOnX}
                size="sm"
                fullwidth
                color="secondary"
              >
                Share on X
              </Button>
            </>
          )}

          {/* Contextual Instructions */}
          <InstructionText>
            {canCopyImage
              ? 'Copy image and paste into Twitter/X (Ctrl+V)'
              : canNativeShare
                ? "Tap 'Share' to open Twitter with image attached"
                : 'Download image and upload when posting on Twitter/X'}
          </InstructionText>
        </Stack>
      )}

      {/* Error state actions */}
      {error && (
        <Stack gap="sm">
          <Button onClick={handleShareOnX} size="sm" fullwidth>
            Share Link on X
          </Button>
        </Stack>
      )}
    </Modal>
  );
};
