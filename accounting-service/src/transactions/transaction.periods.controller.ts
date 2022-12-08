import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ValidationSchemaPipe } from 'src/pipes/validationSchema.pipe';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { TransactionPeriodsService } from './transaction.periods.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';

@Controller('transactionPeriods')
@ApiTags('TransactionPeriods')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionPeriodsController {
  constructor(
    private readonly transactionPeriodsService: TransactionPeriodsService,
  ) {}

  @Post('/create')
  @HasRoles('admin')
  create() {
    return this.transactionPeriodsService.create();
  }
}
