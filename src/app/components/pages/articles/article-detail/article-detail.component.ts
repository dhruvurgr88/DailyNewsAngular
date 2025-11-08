import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../../../services/article.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  articleId!: number;
  article: any;
  loading = true;
  error = '';
  showCommentBox = false;
  commentText = '';
  reportReason = '';
  comments: any[] = [];
  likesCount: number = 0;
  role: string | null = "";

  constructor(private route: ActivatedRoute, private articleService: ArticleService) { }

  ngOnInit(): void {
    this.role = localStorage.getItem("role");
    console.log("role is "+this.role);
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle();
    this.loadLikesCount();
    this.loadComments();
  }
  sendForReview(id:string) {

  }

  deleteArticle(id:string) {

  }

  loadArticle() {
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.article = res.value;
        this.loading = false;
      },
      error: (err:any) => {
        this.error = 'Failed to load article';
        this.loading = false;
      }
    });
  }
  likeArticle() {
    this.articleService.likeArticle(this.articleId).subscribe({
      next: (res:any) => {
        if (res === 'Liked') {
          this.likesCount++;
          this.loadLikesCount();
        } else if (res === 'Unliked') {
          this.likesCount--;
        } else {
          alert('Action completed!');
        }
        this.loadArticle();
       
      },
      error: (err) => console.log(err)
    });
  }

  submitComment() {
    if (!this.commentText.trim()) return;

    this.articleService.addComment(this.articleId, this.commentText).subscribe({
      next: (comment) => {
        this.commentText = '';
        this.showCommentBox = false;
        this.loadArticle(); // reload comments
        this.loadComments();
      },
      error: (err) => {
        console.log(this.articleId, this.commentText);
        console.error(err);
        alert('Failed to add comment');
      }
    });
  }

  reportArticle() {
    if (!this.reportReason.trim()) return;
    this.articleService.reportArticle(this.articleId, this.reportReason).subscribe({
      next: () => {
        this.reportReason = '';
        alert('Article reported successfully');
      },
      error: () => alert('Failed to report article')
    });
  }
  openCommentBox() {
    // Toggle the comment box visibility
    this.showCommentBox = !this.showCommentBox;
  }

  shareArticle() {
    const url = window.location.href; // current page URL

    // Copy the URL to the clipboard
    navigator.clipboard.writeText(url).then(
      () => {
        alert('Article link copied to clipboard!');
      },
      (err) => {
        console.error('Failed to copy: ', err);
        alert('Could not copy link. Please copy manually.');
      }
    );
  }

  loadComments() {
    this.articleService.getComments(this.articleId).subscribe({
      next: (res) => this.comments = res,
      error: (err) => console.error('Failed to load comments', err)
    });
  }


  loadLikesCount() {
    this.articleService.getLikesCount(this.articleId).subscribe({
      next: (count: number) => this.likesCount = count,
      error: (err:any) => console.error('Failed to load likes count', err)
    });
  }

}
