import React, { Component } from 'react';
import { Signin } from './Signin';
import { Header } from './Header';
import { TodoList } from './TodoList';
import TextQuill from './TextQuill'
import { ThemeProvider, theme, CSSReset, ToastProvider } from '@blockstack/ui';
import { userSession } from '../auth';

export default class App extends Component {
  state = {
    userData: null,
  };

  handleSignOut(e) {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <div className="site-wrapper">
            <div className="site-wrapper-inner">
              <Header />
              {!userSession.isUserSignedIn() ? <Signin /> : <TextQuill/>}
            </div>
          </div>
        </ToastProvider>
        <CSSReset />
      </ThemeProvider>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.history.replaceState({}, document.title, '/');
        this.setState({ userData: userData });
      });
    } else if (userSession.isUserSignedIn()) {
      this.setState({ userData: userSession.loadUserData() });
    }
  }
}
