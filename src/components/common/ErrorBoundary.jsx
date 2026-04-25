import { Component } from 'react';

/**
 * App-level error boundary. Catches render errors anywhere downstream and
 * shows a recovery card instead of a blank page. Hard-reload is the safest
 * fallback because the error often comes from stale chunks (after a deploy)
 * or a router state we can't recover from.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Once Sentry is wired up this is where we report.
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, info?.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f7f6] dark:bg-[#211811]">
        <div className="max-w-sm w-full bg-white dark:bg-[#2d221a] rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
          <span className="material-symbols-outlined text-rose-600 text-4xl mb-2">error</span>
          <h1 className="text-base font-bold text-[#181411] dark:text-white mb-1">Something went wrong</h1>
          <p className="text-xs text-[#887263] dark:text-gray-400 mb-4">
            We hit an unexpected error. Reloading the page usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#7f4f13] hover:bg-[#7f4f13]/90 text-white font-bold py-2.5 rounded-xl text-sm"
          >
            Reload
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 text-left text-2xs text-rose-700 bg-rose-50 dark:bg-rose-900/20 p-2 rounded overflow-auto max-h-40">
              {String(this.state.error)}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
