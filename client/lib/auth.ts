import { supabase } from './supabase';

export const checkAdminAccess = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Check if user has admin role in user_metadata
    const isAdmin = user.user_metadata?.role === 'admin';
    
    return isAdmin ? user : null;
  } catch (error) {
    console.error('Error checking admin access:', error);
    return null;
  }
};

export const getAdminUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
