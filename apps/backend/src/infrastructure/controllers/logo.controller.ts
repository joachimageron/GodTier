import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateLogoDto } from '../../application/dtos/logo.dto';
import { CreateLogoUseCase } from '../../application/use-cases/logo/create-logo.use-case';
import { GetAllLogosUseCase } from '../../application/use-cases/logo/get-all-logos.use-case';
import { GetLogoUseCase } from '../../application/use-cases/logo/get-logo.use-case';
import { Logo } from '../../domain/logo';

@ApiTags('logos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('logos')
export class LogoController {
    constructor(
        private readonly createLogoUseCase: CreateLogoUseCase,
        private readonly getAllLogosUseCase: GetAllLogosUseCase,
        private readonly getLogoUseCase: GetLogoUseCase
    ) {}

    @Post()
    @ApiOperation({ summary: 'Add a new logo to the global collection' })
    @ApiResponse({ status: 201, description: 'The logo has been successfully added.' })
    async create(@Body() createLogoDto: CreateLogoDto): Promise<Logo> {
        return this.createLogoUseCase.execute(createLogoDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all logos' })
    @ApiResponse({ status: 200, description: 'Return all logos.' })
    async findAll(): Promise<Logo[]> {
        return this.getAllLogosUseCase.execute();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a logo by id' })
    @ApiResponse({ status: 200, description: 'Return the logo.' })
    async findOne(@Param('id') id: string): Promise<Logo> {
        return this.getLogoUseCase.execute(id);
    }
}
