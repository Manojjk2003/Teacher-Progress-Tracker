import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { collection, doc, Firestore, getDoc, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators'; // Import the map operator

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth, 
    private firestore: Firestore,
    private router: Router
  ) {
    // Listen for authentication state changes
    onAuthStateChanged(this.auth, user => {
      this.userSubject.next(user);
    });
  }

  // Log in method using email and password
  // Log in method using email and password
login(email: string, password: string): Promise<any> {
  return signInWithEmailAndPassword(this.auth, email, password)
    .then((credentials) => {
      this.userSubject.next(credentials.user); // Update the userSubject
      return credentials.user; // Return the user
    })
    .catch((error) => {
      console.error('Login failed:', error);
      throw error; // Propagate the error
    });
}


  // Log out the user
  logout(): Promise<void> {
    return signOut(this.auth).then(() => {
      this.userSubject.next(null); // Clear user on logout
      this.router.navigate(['/login']); // Redirect to login page
      
    });
  }

  // Get the current authenticated user
  getCurrentUser(): Observable<any> {
    return this.user$; // Return the observable of the current user
  }

  async getTeacherIdByUid(uid: string): Promise<string | null> {
    try {
      const teacherRef = collection(this.firestore, 'teacher_table');
      const teacherQuery = query(teacherRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(teacherQuery);
  
      if (!querySnapshot.empty) {
        const teacherDoc = querySnapshot.docs[0];
        return teacherDoc.data()['teacherId']; // Adjust key name as per your Firestore schema
      }
      console.warn('No teacher found for UID:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching teacher ID:', error);
      return null;
    }
  }
  async getTscIdByUid(uid: string): Promise<string | null> {
    try {
      // Reference the 'teacher_table' where we store the user's details (tscId)
      const teacherRef = collection(this.firestore, 'teacher_table');
      const teacherQuery = query(teacherRef, where('uid', '==', uid)); // Query by 'uid'
  
      // Fetch documents matching the query
      const querySnapshot = await getDocs(teacherQuery);
  
      // If a teacher record is found, extract the tscId
      if (!querySnapshot.empty) {
        const teacherDoc = querySnapshot.docs[0];
        return teacherDoc.data()['tscId']; // Ensure you are using the correct field name in Firestore
      }
      
      // If no teacher found for the given UID, log and return null
      console.warn('No teacher found for UID:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching TSC ID:', error);
      return null; // Return null in case of error
    }
  }
  
  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user)  || localStorage.getItem('userId')// Map user to boolean
    );
  }

//   isAuthenticated(): Observable<boolean> {
//   return this.user$.pipe(
//     map((user) => {
//       const storedUserId = localStorage.getItem('userId'); // Check localStorage
//       return !!user || !!storedUserId; // Return true if user exists in Firebase or localStorage
//     })
//   );
// }

  async getAdminIdByUid(uid: string): Promise<string | null> {
    try {
      console.log('Fetching admin ID for UID:', uid);
      const adminRef = collection(this.firestore, 'admin_table');
      const adminQuery = query(adminRef, where('uid', '==', uid));
      const querySnapshot = await getDocs(adminQuery);
  
      console.log('Query Snapshot:', querySnapshot.docs.map(doc => doc.data()));
  
      if (!querySnapshot.empty) {
        const adminDoc = querySnapshot.docs[0];
        console.log('Admin Document Found:', adminDoc.data());
        return adminDoc.data()['adminId']; // Ensure correct key
      }
      console.warn('No admin found for UID:', uid);
      return null;
    } catch (error) {
      console.error('Error fetching admin ID:', error);
      return null;
    }
  }
  


  async getUserProfileData(uid: string): Promise<any> {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDocSnapshot = await getDoc(userDocRef);
    return userDocSnapshot.exists() ? userDocSnapshot.data() : null;
  }
}
