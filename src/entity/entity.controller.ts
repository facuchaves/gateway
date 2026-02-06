import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  SetMetadata,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { EntityService } from './entity.service';
import { EntityDto } from './dtos/entity.dto';
import { MessagePattern } from '@nestjs/microservices';
import { FilterOutputDto } from './dtos/filter-output.dto';
import { FilterPipe } from '../pipes/filter.pipe';
import { FilterInputDto } from './dtos/filter-input.dto';
import { User } from '../decorators/user.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { LoggingInterceptor } from '../interceptors/logging.interceptor';
import { Cookies } from '../decorators/cookie.decorator';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { CreateGenericEntityResponseDto } from './dtos/create-generic-entity-response.dto';
import { UpdateGenericEntityResponseDto } from './dtos/update-generic-entity-response.dto';
import { DeleteGenericEntityResponseDto } from './dtos/delete-generic-entity-response.dto';

@ApiTags('resource')
@Controller('api/resource')
@UseInterceptors(CacheInterceptor)
export class EntityController {
  constructor(
    private readonly service: EntityService,
    private readonly logger: Logger,
  ) {}

  // private readonly logger = new Logger(EntityController.name);

  @Get()
  @ApiOkResponse({
    description: 'La lista fue consultada con exito.',
    type: EntityDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Devuelve una lista de entidades',
    description:
      'Devuelve una lista de todos las entidades. Si no hay entidades devuelve una lista vacia',
  })
  @CacheKey('custom_key')
  @CacheTTL(20)
  async getAllEntities(): Promise<EntityDto[]> {
    return this.service.getAllEntities();
  }

  @Get('local')
  @ApiOkResponse({
    description: 'La lista fue consultada con exito.',
    type: EntityDto,
    isArray: true,
  })
  @ApiOperation({
    summary: 'Devuelve una lista de entidades',
    description:
      'Devuelve una lista de todos las entidades. Si no hay entidades devuelve una lista vacia',
  })
  @CacheKey('custom_key')
  @CacheTTL(20)
  async getAllEntitiesLocal(): Promise<EntityDto[]> {
    return this.service.getAllEntitiesLocal();
  }

  @Get(':resourceId')
  @ApiParam({
    name: 'resourceId',
    required: true,
    description: 'Entity id to search',
  })
  @ApiOkResponse({
    description: 'Devuelve un jugador filtrado por id.',
    type: EntityDto,
  })
  @ApiNotFoundResponse({
    description: 'Si no existe el usuario que se busco, lanzo un not found.',
  })
  @ApiOperation({
    summary: 'Devuelve la entidad',
    description: 'Devuelve la entidad',
  })
  async getEntityById(
    @Param('resourceId', ParseIntPipe) entityId: number,
  ): Promise<EntityDto> {
    return this.service.getEntityById(entityId);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post()
  @ApiCreatedResponse({ type: CreateGenericEntityResponseDto })
  @ApiBadRequestResponse({
    description: 'Si un parametro no cumple con la especificacion.',
  })
  @ApiOperation({
    summary: 'Creacion de entidad',
    description: 'Crea una entidad.',
  })
  async createEntity(
    @Body() entityDto: EntityDto,
  ): Promise<CreateGenericEntityResponseDto> {
    return this.service.createNewEntity(entityDto);
  }

  @Put(':resourceId')
  @ApiParam({
    name: 'resourceId',
    required: true,
    description: 'Entity id to update',
  })
  @ApiOkResponse({ type: UpdateGenericEntityResponseDto })
  @ApiBadRequestResponse({
    description: 'Si el user con ese id no existe.',
  })
  @ApiOperation({
    summary: 'Edicion de entidad',
    description: 'Edicion una entidad.',
  })
  async editEntity(
    @Param('resourceId', ParseIntPipe) entityId: number,
    @Body() entityDto: EntityDto,
  ): Promise<UpdateGenericEntityResponseDto> {
    return this.service.editEntityById(entityId, entityDto);
  }

  @Delete(':resourceId')
  @ApiParam({
    name: 'resourceId',
    required: true,
    description: 'Entity id to delete',
  })
  @ApiOkResponse({ type: DeleteGenericEntityResponseDto })
  @ApiBadRequestResponse({
    description: 'Si no existe entidad con ese id no existe.',
  })
  @ApiOperation({
    summary: 'Eliminacion de entidad',
    description: 'Elimina un entidad.',
  })
  async deleteEntity(
    @Param('resourceId', ParseIntPipe) entityId: number,
  ): Promise<DeleteGenericEntityResponseDto> {
    return this.service.deleteEntityById(entityId);
  }

  @MessagePattern({ cmd: 'get_all_entities' })
  getAllEntitiesLocalMicroService(): Promise<EntityDto[]> {
    return this.service.getAllEntities();
  }

  @UsePipes(new ValidationPipe({ transform: false }))
  @UsePipes(new FilterPipe())
  @Post('pipe')
  @ApiOkResponse({
    description: 'Devuelve la transformacion hecha por el pipe.',
    type: FilterOutputDto,
  })
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    description: 'Si un parametro no cumple con la especificacion.',
  })
  @ApiOperation({
    summary: 'Uso de pipe de nestjs.',
    description: 'Se usa un custom pipe para validar y transformar.',
  })
  @ApiBody({ type: FilterInputDto })
  async validationAndTranformationPipe(
    @Body() filterOutputDto: FilterOutputDto,
  ) {
    return filterOutputDto;
  }

  @ApiHeader({
    name: 'token',
    description: 'Informacion del usuario logeado',
    required: true,
    schema: {
      default: '{ "name": "UserNameReq" , "roles": ["admin"] }',
    },
  })
  @Post('middleware')
  @ApiOkResponse({
    description: 'Devuelve informacion procesada por un middleware.',
  })
  @ApiBadRequestResponse({
    description: 'Si un parametro no cumple con la especificacion.',
  })
  @ApiOperation({
    summary: 'Uso de middleware de nestjs.',
    description:
      'Mediante un middleware se extrae informacion y se la anexa al request para lugo ser utilizada.',
  })
  @UseGuards(RolesGuard)
  @SetMetadata('roles', ['admin'])
  async middleware(@User() user) {
    return user;
  }

  @Post('interceptor')
  @ApiOkResponse({
    description: 'Devuelve ok.',
  })
  @UseInterceptors(LoggingInterceptor)
  async interceptor() {
    return 'ok';
  }

  @ApiCookieAuth()
  @Post('cookieAuth')
  @ApiOkResponse({
    description: 'Devuelve ok.',
  })
  @UseInterceptors(LoggingInterceptor)
  async cookieAuth() {
    return 'ok';
  }

  @Post('session')
  @ApiOkResponse({
    description: 'Devuelve ok.',
  })
  async session(@Session() session: Record<string, any>) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return session.visits;
  }

  @ApiCookieAuth()
  @Post('cookie')
  @ApiOkResponse({
    description: 'Devuelve ok.',
  })
  async cookie(@Cookies('x-token') XTokenCookie: string) {
    return XTokenCookie;
  }

  @UseFilters(new HttpExceptionFilter())
  @Post('exceptionFilter')
  @ApiOkResponse({
    description: 'Manejo de excepciones.',
  })
  async exceptionFilter() {
    throw new HttpException('Error', 500);
  }

  @Post('log')
  @ApiOkResponse({
    description: 'Usa el logger.',
  })
  async log() {
    this.logger.log('Doing something...', EntityController.name);
  }
}
