import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import type { WrappedStats } from 'features/wrapped/data';
import { SlideStats } from 'features/wrapped/slides/slide-outro';

/**
 * Generates a PNG image of the Wrapped outro slide using canvas rendering
 * @param data Wrapped stats data to render
 * @returns Promise resolving to PNG blob
 */
export const generateSlideImage = async (data: WrappedStats): Promise<Blob> => {
  // Create off-screen container for rendering
  const container = document.createElement('div');
  container.style.cssText =
    'position:absolute;left:-9999px;top:0;width:590px;height:590px;';
  document.body.appendChild(container);

  try {
    // Render SlideStats component into container
    const root = createRoot(container);
    root.render(<SlideStats data={data} same />);

    // Wait for React to render and styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture canvas with high-quality settings
    const canvas = await html2canvas(container, {
      scale: 2, // 2x for retina displays
      backgroundColor: null, // Transparent, background comes from component
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        (b) => resolve(b!),
        'image/png',
        0.95, // High quality
      );
    });

    // Cleanup
    root.unmount();
    document.body.removeChild(container);

    return blob;
  } catch (error) {
    // Cleanup on error
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    throw error;
  }
};
