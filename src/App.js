import React from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';

import SignInPage from './pages/sign-in/sign-in-page.component';
import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component.jsx';
import { auth } from './firebase/firebase.utils';

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currentUser: null,
    };
  }

  // set property for unsubscribe with default value of null
  unsubscribeFromAuth = null;

  componentDidMount() {
    // firebase realizes that authentication state has changed, we want to be aware
    // open messaging system that indicates when auth state changes as long as component is mounted on the DOM, therefore need to also close the subscription on unmount to prevent memory leaks so we set up unsubscribeFromAuth
    this.unsubscribeFromAuth = auth.onAuthStateChanged((user) => {
      this.setState({ currentUser: user });
      // console.log(user);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header currentUser={this.state.currentUser} />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
