import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { CreateFamilyDto, UpdateFamilyDto } from './dto/family.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInvitationDto, AcceptInvitationDto } from './dto/invitation.dto';
import { FamilyRole } from '../common/enums';
import { AuthenticatedRequest } from '../common/types';

@Controller('families')
@UseGuards(JwtAuthGuard)
export class FamiliesController {
  constructor(private readonly familiesService: FamiliesService) {}

  @Post()
  createFamily(@Req() req: AuthenticatedRequest, @Body() createFamilyDto: CreateFamilyDto) {
    return this.familiesService.createFamily(req.user.sub, createFamilyDto);
  }

  @Get()
  getAllFamilies(@Req() req: AuthenticatedRequest) {
    return this.familiesService.getAllFamilies(req.user.sub);
  }

  @Get(':id')
  getFamilyById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.getFamilyById(req.user.sub, id);
  }

  @Patch(':id')
  updateFamily(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateFamilyDto: UpdateFamilyDto,
  ) {
    return this.familiesService.updateFamily(req.user.sub, id, updateFamilyDto);
  }

  @Delete(':id')
  deleteFamily(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.deleteFamily(req.user.sub, id);
  }

  @Get(':id/members')
  getFamilyMembers(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.getFamilyMembers(req.user.sub, id);
  }

  @Post(':id/invitations')
  createInvitation(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() createInvitationDto: CreateInvitationDto,
  ) {
    return this.familiesService.createInvitation(req.user.sub, id, createInvitationDto);
  }

  @Post('invitations/accept')
  acceptInvitation(@Req() req: AuthenticatedRequest, @Body() acceptInvitationDto: AcceptInvitationDto) {
    return this.familiesService.acceptInvitation(req.user.sub, acceptInvitationDto.token);
  }

  @Get(':id/invitations')
  getInvitations(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.getInvitations(req.user.sub, id);
  }

  @Delete('invitations/:id')
  cancelInvitation(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.cancelInvitation(req.user.sub, id);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
  ) {
    return this.familiesService.removeMember(req.user.sub, id, memberId);
  }

  @Patch(':id/members/:memberId/role')
  updateMemberRole(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: FamilyRole },
  ) {
    return this.familiesService.updateMemberRole(req.user.sub, id, memberId, body.role);
  }

  @Delete(':id/leave')
  leaveFamily(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.familiesService.leaveFamily(req.user.sub, id);
  }
}
