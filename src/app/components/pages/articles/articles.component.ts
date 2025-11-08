import { Component, OnInit } from '@angular/core';
import { Article, ArticleService } from '../../../services/article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];
  loading = false;
  error: string | null = null;
  selectedStatus = 'Pending';
  userRole = localStorage.getItem('role');
  userEmail = localStorage.getItem('email');
  message: string | null = null;

  constructor(private articleService: ArticleService) { }

  ngOnInit(): void {
    this.loadArticles();
  }

  /** Load articles based on user role */
  loadArticles(): void {
    this.loading = true;
    this.error = null;

    const request$ =
      this.userRole === 'Editor'
        ? this.articleService.getArticlesByStatus(this.selectedStatus)
        : this.articleService.getAllArticles();

    request$.subscribe({
      next: (data) => {
        this.articles = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading articles:', err);
        this.error = '❌ Could not load articles.';
        this.loading = false;
      }
    });
  }

  /** Handle status filter change */
  onStatusChange(): void {
    this.loadArticles();
  }

  /** Approve article */
  approveArticle(articleId: number): void {
    this.articleService.approveArticle(articleId).subscribe({
      next: () => {
        this.updateStatus(articleId, 'Approved');
        this.showMessage('✅ Article approved successfully!');
      },
      error: (err) => {
        console.error('Error approving article:', err);
        this.showMessage('❌ Failed to approve article.');
      }
    });
  }

  /** Reject article */
  onReject(articleId: number): void {
    if (!confirm('Are you sure you want to reject this article?')) return;

    this.articleService.rejectArticle(articleId).subscribe({
      next: () => {
        this.updateStatus(articleId, 'Rejected');
        this.showMessage('✅ Article rejected successfully!');
      },
      error: (err) => {
        console.error('Error rejecting article:', err);
        this.showMessage('❌ Failed to reject article.');
      }
    });
  }

  /** Journalist sends article for review */
  sendForReview(articleId: number): void {
    this.articleService.sendForReview(articleId).subscribe({
      next: () => {
        this.updateStatus(articleId, 'Pending');
        this.showMessage('📤 Article sent for review!');
      },
      error: (err) => {
        console.error('Error sending for review:', err);
        this.showMessage('❌ Failed to send for review.');
      }
    });
  }

  /** Update status in UI instantly */
  private updateStatus(articleId: number, status: string): void {
    const article = this.articles.find((a) => a.articleId === articleId);
    if (article) article.status = status;
  }

  /** Show success/error message */
  private showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => (this.message = null), 3000);
  }

  /** Utility to simplify ngIf in template */
  get isEditorOrJournalist(): boolean {
    return this.userRole === 'Editor' || this.userRole === 'Journalist';
  }

  /** Helps Angular optimize *ngFor rendering */
  trackById(index: number, item: Article): number {
    return item.articleId;
  }
}
