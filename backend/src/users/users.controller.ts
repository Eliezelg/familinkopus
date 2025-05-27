import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { CreateChildDto, UpdateChildDto } from './dto/child.dto';
import { AuthenticatedRequest } from '../common/types';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: AuthenticatedRequest) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  updateProfile(@Req() req: AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.sub, updateUserDto);
  }

  @Patch('profile/picture')
  updateProfilePicture(@Req() req: AuthenticatedRequest, @Body() body: { profilePicture: string }) {
    return this.usersService.updateProfilePicture(req.user.sub, body.profilePicture);
  }

  @Get('children')
  getChildren(@Req() req: AuthenticatedRequest) {
    return this.usersService.getChildren(req.user.sub);
  }

  @Post('children')
  createChild(@Req() req: AuthenticatedRequest, @Body() createChildDto: CreateChildDto) {
    return this.usersService.createChild(req.user.sub, createChildDto);
  }

  @Patch('children/:id')
  updateChild(
    @Req() req: AuthenticatedRequest,
    @Param('id') childId: string,
    @Body() updateChildDto: UpdateChildDto,
  ) {
    return this.usersService.updateChild(req.user.sub, childId, updateChildDto);
  }

  @Delete('children/:id')
  deleteChild(@Req() req: AuthenticatedRequest, @Param('id') childId: string) {
    return this.usersService.deleteChild(req.user.sub, childId);
  }
}
