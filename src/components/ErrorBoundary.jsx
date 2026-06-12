import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to your analytics or console
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Premium error UI matching the dark theme
      return (
        <div className="min-h-screen bg-theme-bg text-theme-text flex flex-col items-center justify-center px-6 text-center font-cairo">
          <div className="w-16 h-16 mb-8 border border-theme-accent/30 rounded-full flex items-center justify-center text-theme-accent">
            <span className="text-2xl font-serif">!</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light mb-4 text-theme-accent" style={{ fontFamily: 'serif' }}>
            حدث خطأ ما / Something went wrong
          </h1>
          <p className="text-theme-muted text-sm md:text-base mb-10 max-w-md font-light leading-relaxed">
            نعتذر عن هذا الخطأ غير المتوقع. يرجى محاولة تحديث الصفحة أو العودة إلى الصفحة الرئيسية.
            <br />
            <span className="text-xs text-theme-muted/60 block mt-2" style={{ fontFamily: 'monospace' }}>
              {this.state.error?.toString() || 'Unknown Error'}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={() => window.location.reload()}
              className="bg-theme-text text-theme-bg px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:bg-theme-accent hover:text-black transition-colors"
            >
              تحديث الصفحة / Reload Page
            </button>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="border border-theme-border text-theme-muted px-8 py-3.5 text-xs uppercase tracking-widest font-bold hover:border-theme-accent hover:text-theme-text transition-colors"
            >
              الرئيسية / Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
