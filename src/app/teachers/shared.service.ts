import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private teacherIdSubject = new BehaviorSubject<string | null>(null);

  setTeacherId(teacherId: string): void {
    this.teacherIdSubject.next(teacherId);
  }

  getTeacherId() {
    return this.teacherIdSubject.asObservable();
  }
}
