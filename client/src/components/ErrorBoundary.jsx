import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-2xl mx-auto my-8 p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-white backdrop-blur-md">
          <div className="flex items-center gap-3 text-red-400 mb-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            <h3 className="text-lg font-bold">Failed to display scan results</h3>
          </div>
          <p className="text-sm text-neutral-300 mb-4">
            An unexpected error occurred while rendering the intelligence report. The raw server response might have unexpected formatting.
          </p>
          <div className="bg-black/50 p-3 rounded-lg text-xs font-mono text-red-300 mb-4 overflow-x-auto">
            {this.state.error?.message || "Unknown error"}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

