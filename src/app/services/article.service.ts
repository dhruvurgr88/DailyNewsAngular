import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


  export interface Article {
  articleId: number;
  title: string;
  content: string;
  createdDate: string;
  modifiedDate?: string;
  imageUrl?: string;
  status: string;           // ✅ Add this
  authorEmail: string;      // ✅ Add this
  isPremium: boolean;       // ✅ Add this
}


@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  //private apiUrl = "https://localhost:7011/api/Article";
  private apiUrl = "https://dailynewsapp-i821.onrender.com/api/Article";


  constructor(private http: HttpClient) { }

  getAllArticles(): Observable<Article[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllArticles`);
  }

  getArticleById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetArticleById?id=${id}`);
  }

  likeArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/LikeArticle?articleId=${articleId}`, {}, { headers });
  }

  getLikesCount(articleId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/GetLikesCount?articleId=${articleId}`);
  }

  addComment(articleId: number, text: string): Observable<any> {
    const email = localStorage.getItem('email')!;
    //console.log(token);
    
   

    const body = { text,email }; // works with CommentRequest DTO
    return this.http.post<any>(`${this.apiUrl}/AddComment?articleId=${articleId}`, body);
  }

  getComments(articleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetComments?articleId=${articleId}`);
  }

  commentArticle(articleId: number, text: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    console.log(token);

    // Send text as JSON in the body
    return this.http.post<any>(
      `https://localhost:7011/api/User/AddComment/${articleId}/comments`,
      JSON.stringify(text),
      { headers }
    );
  }
  reportArticle(articleId: number, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${articleId}/report`, { reason });
  }
  getArticlesByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetArticlesByStatus?status=${status}`);
  }

  approveArticle(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(`${this.apiUrl}/ApproveArticle?articleId=${articleId}`, {}, { headers });
  }
  sendForReview(articleId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.apiUrl}/SendForReview?articleId=${articleId}`, {}, { headers });
  }
 
  getArticlesByJournalist(): Observable<Article[]> {
    const email = localStorage.getItem('email') || '';
    

    // API call with query param for journalist email
    return this.http.get<Article[]>(`${this.apiUrl}/GetAllArticlesByJournalist?email=${email}`);
  }

  rejectArticle(articleId: number) {
    return this.http.put(`${this.apiUrl}/RejectArticle?articleId=${articleId}`, {});
  }

  addArticle(article: Partial<Article>): Observable<Article> {
    console.log("article frpm ts" + article);
    return this.http.post<Article>(`${this.apiUrl}/AddArticle`, article);
  }



  

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      // Caller should handle the thrown error (e.g., show login)
      throw new Error('User not authenticated');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  


}


  //getAllArticles(): Observable<Article[]> {
  //  return this.http.get<Article[]>(`${this.apiUrl}/GetAllArticles`);
  //}
  //getArticleById(id: number): Observable<any> {
  //  return this.http.get<any>(`${this.apiUrl}/GetArticle/${id}`);
  //}
  ////https://localhost:7011/api/User/LikeArticle/1/like

  //likeArticle(articleId: number): Observable<any> {
  //  console.log("article id: " + articleId);
  //  const token = localStorage.getItem('token');
  //  console.log("token :" + token);
  //  if (!token) {
  //    throw new Error('User not logged in or token missing');
  //  }

  //  const headers = new HttpHeaders({
  //    'Authorization': `Bearer ${token}`
  //  });

  //  return this.http.post<any>(
  //    `https://localhost:7011/api/User/LikeArticle/${articleId}/like`,
  //    {}, // empty body
  //    { headers }
  //  );
  //}


  
  //getLikesCount(articleId: number): Observable<number> {
  //  return this.http.get<number>(`https://localhost:7011/api/article/GetLikesCount?articleId=${articleId}`);
  //}

  

  //getComments(articleId: number): Observable<any[]> {
  //  return this.http.get<any[]>(`https://localhost:7011/api/Article/GetComments/${articleId}/comments`);
  //}

  //addComment(articleId: number, text: string): Observable<any> {
  //  return this.http.post(
  //    `${this.apiUrl}/${articleId}/comments`,
  //    JSON.stringify(text),
  //    {
  //      headers: {
  //        ...this.getAuthHeaders(),
  //        'Content-Type': 'application/json'
  //      }
  //    }
  //  );
  //}
  //private getAuthHeaders(): HttpHeaders {
  //  const token = localStorage.getItem('token'); // ✅ save token after login
  //  return new HttpHeaders({
  //    Authorization: `Bearer ${token}`
  //  });
  //}

  //rateArticle(articleId: number, rating: number): Observable<any> {
  //  return this.http.post(
  //    `${this.apiUrl}/${articleId}/rating`,
  //    rating,
  //    { headers: this.getAuthHeaders() }
  //  );
  //}

  //getRating(articleId: number): Observable<any> {
  //  return this.http.get(`${this.apiUrl}/${articleId}/rating`);
  //}


