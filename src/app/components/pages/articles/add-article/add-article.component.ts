import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleService, Article } from '../../../../services/article.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent {
  model: Partial<Article> = {
    title: '',
    content: '',
    imageUrl: '',
    isPremium: false,
    authorEmail: localStorage.getItem('email') || '',
    status: 'Pending'
  };

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private articleService: ArticleService) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.articleService.addArticle(this.model).subscribe({
      
      next: (res) => {
        this.successMessage = '✅ Article added successfully!';
        form.resetForm();
        this.model = {
          title: '',
          content: '',
          imageUrl: '',
          isPremium: false,
          authorEmail: localStorage.getItem('email') || '',
          status: 'Pending'
        };
      },
      error: (err) => {
        console.log(this.model);
        console.error(err);
        this.errorMessage = '❌ Failed to add article. Please try again.';
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}
