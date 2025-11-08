import { Component, OnInit } from '@angular/core';
import { Article, ArticleService } from '../../../services/article.service';
import { Router } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalArticles = 0;
  approvedCount = 0;
  pendingCount = 0;
  rejectedCount = 0;
  pendingArticles: Article[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = ""
  userEmail: string | null = "";
  filteredArticles: Article[] = [];

  constructor(private articleService: ArticleService,private router:Router) { }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem("email");
    this.userRole = localStorage.getItem("role");
    this.loadDashboardData();
    
    console.log(this.userRole+"rolel is");
  
 
  }

  loadDashboardData(): void {
    console.log("dashboard in" + this.userRole + "role");
    if (this.userRole?.trim().toLowerCase()=="editor") {
      this.articleService.getAllArticles().subscribe({
        next: (data) => {
          console.log(data);
          this.filteredArticles = data
          console.log("filtered data "+this.filteredArticles);
          this.totalArticles = data.length;
          this.approvedCount = data.filter(a => a.status === 'Approved').length;
          this.pendingCount = data.filter(a => a.status === 'Pending').length;
          console.log("pending " + this.pendingCount);
          this.rejectedCount = data.filter(a => a.status === 'Rejected').length;
          this.pendingArticles = data.filter(a => a.status?.trim().toLowerCase() === 'pending');
          console.log("pending articles " + this.pendingArticles);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching dashboard data', err);
          this.error = 'Unable to load dashboard data';
          this.loading = false;
        }
      });
    } else {
      this.articleService.getArticlesByJournalist().subscribe({
        next: (data) => {
          console.log(data);
          this.filteredArticles = data.filter(a => a.authorEmail === this.userEmail);
          console.log("filteredArticles (raw):", this.filteredArticles);
          console.log("type:", Array.isArray(this.filteredArticles) ? "Array" : typeof this.filteredArticles);
          console.table(this.filteredArticles);
          console.log("-------------------------------");

          this.totalArticles = data.length;
          this.approvedCount = data.filter(a => a.status === 'Approved').length;
          this.pendingCount = data.filter(a => a.status.toLowerCase() === 'pending').length;
          console.log("pending " + this.pendingCount);
          this.rejectedCount = data.filter(a => a.status === 'Rejected').length;
          this.pendingArticles = data.filter(a => a.status?.trim().toLowerCase() === 'pending');
          console.log("pending articles " + this.pendingArticles);
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error fetching dashboard data', err);
          this.error = 'Unable to load dashboard data';
          this.loading = false;
        }
      });
    }
    
  }
  RedirectToArticles() {
    this.router.navigate(["articles"])
  }

  approveArticle(articleId: number): void {
    this.articleService.approveArticle(articleId).subscribe({
      next: () => {
        alert('Article approved successfully!');
        this.loadDashboardData();
      },
      error: (err:any) => {
        console.error('Error approving article:', err);
      }
    });
  }

  rejectArticle(articleId: number): void {
    this.articleService.rejectArticle(articleId).subscribe({
      next: () => {
        alert('Article rejected successfully!');
        this.loadDashboardData();
      },
      error: (err:any) => {
        console.error('Error rejecting article:', err);
      }
    });
  }
  filterArticles(data: string) {

  }

}
