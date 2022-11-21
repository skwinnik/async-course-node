import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/guards/public.attribute';

@Controller('health')
@ApiTags('Health')
@Public()
export class HealthController {
  @Get('/')
  health() {
    return 'ok';
  }
}
