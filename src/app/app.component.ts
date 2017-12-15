import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface Post {
  title: string;
  content: string;
}

interface PostId extends Post {
  id: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  postsCol: AngularFirestoreCollection<Post>;
  posts: any;

  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  title: string;
  content: string;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.postsCol = this.afs.collection('posts');
    // using where clause
    // this.postsCol = this.afs.collection('posts', ref => ref.where('title', '==', 'Angular'));
    // this posts = this.postsCol.valueChanges();
    this.posts = this.postsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, data };
        });
      });
  }

  getPost(postId) {
    this.postDoc = this.afs.doc('posts/' + postId);
    this.post = this.postDoc.valueChanges();
  }

  addPost() {
    this.afs.collection('posts').add({ 'title': this.title, 'content': this.content });
    // using a Custom ID
    // this.afs.collection('posts').doc('my-custom-id').set({'title': this.title, 'content': this.content});

    this.title = '';
    this.content = '';
  }

  updatePost(postId) {
    this.afs.doc('posts/' + postId)
      .set({
        title: 'New Title 1',
        content: 'New Content 1'
      });
  }

  deletePost(postId) {
    this.afs.doc('posts/' + postId).delete();
  }
}
