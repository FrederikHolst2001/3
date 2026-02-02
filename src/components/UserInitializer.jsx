import { useEffect } from 'react';

export default function UserInitializer() {
  useEffect(() => {
    const initializeUser = async () => {
      try {
        
        // If user doesn't have subscription_plan or trial_start_date, initialize them
        if (!user.subscription_plan || !user.trial_start_date) {
            subscription_plan: 'pro',
            trial_start_date: new Date().toISOString()
          });
        }
      } catch (error) {
        // User not logged in or error - ignore
      }
    };

    initializeUser();
  }, []);

  return null;
}