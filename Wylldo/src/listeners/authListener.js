authSubscription = firebase.auth().onAuthStateChanged(user => {user ? goHome() : goToAuth()})