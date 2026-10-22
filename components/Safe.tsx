"use client";

import { Component, type ReactNode } from "react";

// Decorative pieces (ASCII, aura) must never take the page down: if one fails, it just disappears
export class Safe extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("Decorative component disabled:", error);
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
