import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Body('blogId') blogId: string,
    @Body('content') content: string,
    @Body('parentId') parentId: string,
    @Req() req,
  ) {
    return this.commentService.createComment(blogId, req, content, parentId);
  }
}
