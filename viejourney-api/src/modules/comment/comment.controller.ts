import {
  BadRequestException,
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
    @Req() req,
  ) {
    const userId = req.user?.['userId'] as string;
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.commentService.createComment(blogId, content, userId);
  }

  @Get()
  async getComments(
    @Query('blogId') blogId: string,
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    const limitNumber = limit !== undefined ? parseInt(limit, 10) : 10;
    const skipNumber = skip !== undefined ? parseInt(skip, 10) : 0;
    return this.commentService.getComments(blogId, limitNumber, skipNumber);
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
