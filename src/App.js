import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';

import SignInPage from './pages/sign-in/sign-in-page.component';
import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component.jsx';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
  /*
  constructor() {
    super();

    this.state = {
      currentUser: null
    };
  }
  */

  // set property for unsubscribe with default value of null
  unsubscribeFromAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    // firebase realizes that authentication state has changed, we want to be aware
    // open messaging system that indicates when auth state changes as long as component is mounted on the DOM, therefore need to also close the subscription on unmount to prevent memory leaks so we set up unsubscribeFromAuth
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot(
          (snapshot) => {
            // this.setState(
            //   {
            //     currentUser: {
            setCurrentUser({
              id: snapshot.id,
              ...snapshot.data(),
            });
          }, // can't log data after async setState call, so pass func as second parameter to call it after state has fully propogated
          () => {
            console.log(this.state);
          }
        );
        console.log(this.state);
      }
      // this.setState({ currentUser: userAuth })
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/signin" component={SignInPage} />
        </Switch>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setCurrentUser: (user) => dispatch(setCurrentUser(user)),
});

export default connect(null, mapDispatchToProps)(App);
