
import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error('[dashboard-boundary]', this.props.name || 'surface', error, info); }
  render() {
    if (!this.state.error) return this.props.children;
    return <section className="control-plane-error" role="status"><strong>{this.props.label || 'DEGRADED LIVE DATA'}</strong><p>{this.props.description || 'Verified research state remains available.'}</p></section>;
  }
}
