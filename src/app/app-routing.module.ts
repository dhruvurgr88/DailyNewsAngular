import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ArticlesComponent } from './components/pages/articles/articles.component';
import { LoginComponent } from './components/pages/login/login.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { ArticleDetailComponent } from './components/pages/articles/article-detail/article-detail.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { AddArticleComponent } from './components/pages/articles/add-article/add-article.component';

const routes: Routes = [
  { path: '', component: ArticlesComponent },
  { path: 'articles', component: ArticlesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'article/:id', component: ArticleDetailComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'addArticle', component: AddArticleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
