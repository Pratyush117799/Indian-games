import React from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Spice Route error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-parchment p-6">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold text-amber-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-amber-800 mb-4">
              The game hit an error. Try refreshing the page.
            </p>
            {this.state.error && (
              <pre className="text-left text-xs bg-amber-100 p-3 rounded overflow-auto text-amber-900 mb-4">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-amber-600 text-amber-50 font-medium hover:bg-amber-700"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
