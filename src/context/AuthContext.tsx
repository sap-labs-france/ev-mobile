import React from 'react';

export interface AuthService {
  handleSignIn: () => void;
  handleSignOut: () => void;
}

export const AuthContext = React.createContext<AuthService>({
  handleSignIn: () => {},
  handleSignOut: () => {}
});
