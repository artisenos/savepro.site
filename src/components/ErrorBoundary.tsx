import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
  retryCount: number;
}

const MAX_AUTO_RETRIES = 2;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
    retryCount: 0,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);

    // Auto-recover from the known React DOM removeChild bug
    // (caused by browser extensions like Google Translate modifying the DOM)
    const isRemoveChildError =
      error.message.includes("removeChild") ||
      error.message.includes("insertBefore") ||
      error.message.includes("The node to be removed is not a child");

    if (isRemoveChildError && this.state.retryCount < MAX_AUTO_RETRIES) {
      console.warn(`[ErrorBoundary] DOM mutation error detected (attempt ${this.state.retryCount + 1}/${MAX_AUTO_RETRIES}). Auto-recovering...`);
      // Short delay then auto-recover
      setTimeout(() => {
        this.setState(prev => ({
          hasError: false,
          errorMessage: '',
          retryCount: prev.retryCount + 1,
        }));
      }, 300);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '', retryCount: 0 });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 text-center p-4">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-3">Oops, something went wrong</h2>

          <p className="text-slate-600 dark:text-slate-300 mb-2 max-w-md mx-auto">
            A rendering error occurred. This is often caused by browser extensions (like Google Translate) modifying the page.
          </p>

          {this.state.errorMessage && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 max-w-md mx-auto font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              {this.state.errorMessage.substring(0, 200)}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={this.handleRetry}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors shadow-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
