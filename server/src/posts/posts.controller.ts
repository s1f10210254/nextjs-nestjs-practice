import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostType } from './post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  // Postを追加するエンドポイント
  @Post()
  create(@Body() post: PostType) {
    this.postsService.create(post);
    return post;
  }
}
