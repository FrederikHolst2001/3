
    : {
        get: async () => ({}),
        invoke: async () => ({}),
        me: async () => null,
      };

// Ensure global sync (safety)
if (typeof window !== "undefined") {
}

// Support BOTH import styles
