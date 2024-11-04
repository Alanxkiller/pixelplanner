import { Injectable } from '@angular/core';
import { firebaseApp$ } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, user } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: Auth) { }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }


   getUser() {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        // User logged in already or has just logged in.
        //console.log(user.uid);
        return user.uid;
      } else {
        // User not logged in or has just logged out.
        return null;
      }
    });
  }
}
