import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    return this.commentService.createComment(blogId, content, req, parentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getComments(
    @Query('blogId') blogId: string,
    @Query('parentId') parentId: string,
    @Query('limit') limit: number = 10,
    @Query('skip') skip: number = 0,
  ) {
    return this.commentService.getComments(blogId, parentId, limit, skip);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async editComment(
    @Param('id') commentId: string,
    @Body('content') content: string,
    @Req() req,
  ) {
    const userId = req.user?.['userId'] as string;
    return this.commentService.editComment(commentId, userId, content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteComment(@Param('id') commentId: string, @Req() req) {
    const userId = req.user?.['userId'] as string;
    return this.commentService.deleteComment(commentId, userId);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeComment(@Param('id') commentId: string, @Req() req) {
    const userId = req.user?.['userId'] as string;
    return this.commentService.likeComment(commentId, userId);
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  async unlikeComment(@Param('id') commentId: string, @Req() req) {
    const userId = req.user?.['userId'] as string;
    return this.commentService.unlikeComment(commentId, userId);
  }
}
