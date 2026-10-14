import { Component, PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren<{ fallback: ReactNode }>;

export class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error('Render failed, showing fallback:', error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
