import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { TscService } from './tsc.service';
import { TSCFormComponent } from '../tsc-form/tsc-form.component';
import { DeleteConfirmationDialogComponent } from '../../teachers/dialog_delete/delete-confirmation-dialog.component';

@Component({
  selector: 'app-tsc',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './tsc.component.html',
  styleUrls: ['./tsc.component.css'],
})
export class TscComponent implements OnInit {
  tscList: any[] = [];
  filteredTscList: any[] = [];
  searchQuery: string = '';
  selectedTscDetails: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private tscService: TscService
  ) {}

  ngOnInit(): void {
    this.loadTscData();
    
  }

  // loadTscData(): void {
  //   this.tscService.getTscs().subscribe(
  //     (data: any) => {
  //       this.tscList = data.tscs || [];
  //       this.filteredTscList = [...this.tscList];
  //     },
  //     (error) => {
  //       console.error('Error fetching TSC data:', error);
  //       this.showPopup('Failed to fetch TSC data. Please try again.', 'error');
  //     }
  //   );
  // }

  loadTscData(): void {
    this.tscService.getTscs().subscribe(
      (data: any) => {
        this.tscList = (data.tscs || []).sort((a: any, b: any) => {
          // Convert createdAt to timestamp, default to 0 if missing
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
  
          return dateB - dateA; // Oldest to Newest
        });
  
        this.filteredTscList = [...this.tscList];
  
        console.log('Sorted TSC Data:', this.tscList); // Debugging: Check sorted data
      },
      (error) => {
        console.error('Error fetching TSC data:', error);
        this.showPopup('Failed to fetch TSC data. Please try again.', 'error');
      }
    );
  }
  
  

  

  filterTscs(): void {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.filteredTscList = [...this.tscList]; // Show all TSCs if no query
      return;
    }

    this.filteredTscList = this.tscList.filter(
      (tsc) =>
        tsc.tsc_name?.toLowerCase().includes(query) ||
        tsc.email?.toLowerCase().includes(query) ||
        tsc.phone_number?.toLowerCase().includes(query) ||
        tsc.region?.toLowerCase().includes(query) // Optional: include region or other fields
    );
  }

  editTsc(tsc: any): void {
    this.selectedTscDetails = tsc; // Store selected TSC details locally

    // Open the form dialog and pass the selected TSC details
    const dialogRef = this.dialog.open(TSCFormComponent, {
     width: '500px', height:'600px',
      data: { ...tsc }, // Pass a copy to avoid direct mutation
    });

    dialogRef.afterClosed().subscribe((updatedTsc) => {
      if (updatedTsc) {
        // Update the TSC details locally
        const index = this.tscList.findIndex((item) => item._id === updatedTsc._id);
        if (index > -1) {
          this.tscList[index] = updatedTsc; // Update in the main list
          this.filteredTscList = [...this.tscList]; // Refresh the filtered list
        }

        // Auto-refresh data by reloading from the server
        this.loadTscData();
      }
    });
  }
  capitalizeFirstLetter(str: string): string {
    return str
      ? str
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      : '';
  }
  addTsc(): void {
    const dialogRef = this.dialog.open(TSCFormComponent, {
    width: '500px', height:'600px',
    });

    dialogRef.afterClosed().subscribe((newTsc) => {
      if (newTsc) {
        this.tscList.push(newTsc);
        this.filteredTscList = [...this.tscList];

        // Auto-refresh data by reloading from the server
        this.loadTscData();
      }
    });
  }

  openDeleteConfirmationDialog(tsc_id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: { tsc_id },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteTsc(tsc_id);
      }
    });
  }

  deleteTsc(tsc_id: string): void {
    this.tscService.deleteTscByTscId(tsc_id).subscribe({
      next: () => {
        this.showPopup('TSC deleted successfully.', 'success');
        this.loadTscData(); // Refresh data after deletion
      },
      error: (error) => {
        console.error('Error deleting TSC:', error);
        this.showPopup('Failed to delete TSC. Please try again later.', 'error');
      },
    });
  }

  showPopup(message: string, type: 'success' | 'error'): void {
    const popup = document.createElement('div');
    popup.innerText = message;
    popup.style.position = 'fixed';
    popup.style.top = '20px';
    popup.style.left = '50%';
    popup.style.transform = 'translateX(-50%)';
    popup.style.padding = '10px 20px';
    popup.style.borderRadius = '5px';
    popup.style.backgroundColor = type === 'success' ? 'green' : 'red';
    popup.style.color = 'white';
    popup.style.fontSize = '20px';
    popup.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
    popup.style.zIndex = '1000';

    document.body.appendChild(popup);

    setTimeout(() => {
      document.body.removeChild(popup);
    }, 3000);
  }
}