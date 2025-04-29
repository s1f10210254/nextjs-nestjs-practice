import { Injectable } from '@nestjs/common';
import { PostType } from './post.interface';

@Injectable()
export class PostsService {
  private readonly posts: PostType[] = [];

  findAll(): PostType[] {
    return this.posts;
  }

  // Postを追加するメソッド
  create(post: PostType) {
    this.posts.push(post);
  }
}
