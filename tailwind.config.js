tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: {
          'terra-cotta': '#E2725B',
          'ocean-blue': '#4A90E2',
          'forest-green': '#2E8B57',
        },
        neutral: {
          'sand-beige': '#f4f1eb',
          'slate-gray': '#64748b',
          'slate-dark': '#09090b', // Equivalent to zinc-950
          'white': '#ffffff',
        },
        semantic: {
          'success': '#10b981',
          'warning': '#f59e0b',
          'error': '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
    }
  }
}
