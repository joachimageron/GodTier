import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTierListDto, AddLogoDto, MoveLogoDto } from '../../application/dtos/tier-list.dto';
import { CreateTierListUseCase } from '../../application/use-cases/tier-list/create-tier-list.use-case';
import { GetTierListUseCase } from '../../application/use-cases/tier-list/get-tier-list.use-case';
import { AddLogoUseCase } from '../../application/use-cases/tier-list/add-logo.use-case';
import { MoveLogoUseCase } from '../../application/use-cases/tier-list/move-logo.use-case';
import { TierList } from '../../domain/tier-list';

@ApiTags('tier-lists')
@Controller('tier-lists')
export class TierListController {
  constructor(
    private readonly createTierListUseCase: CreateTierListUseCase,
    private readonly getTierListUseCase: GetTierListUseCase,
    private readonly addLogoUseCase: AddLogoUseCase,
    private readonly moveLogoUseCase: MoveLogoUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tier list' })
  @ApiResponse({ status: 201, description: 'The tier list has been successfully created.' })
  async create(@Body() createTierListDto: CreateTierListDto): Promise<TierList> {
    return this.createTierListUseCase.execute(createTierListDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tier list by id' })
  @ApiResponse({ status: 200, description: 'Return the tier list.' })
  async findOne(@Param('id') id: string): Promise<TierList> {
    return this.getTierListUseCase.execute(id);
  }

  @Post(':id/logos')
  @ApiOperation({ summary: 'Add a logo to the tier list' })
  @ApiResponse({ status: 201, description: 'The logo has been added.' })
  async addLogo(
    @Param('id') id: string,
    @Body() addLogoDto: AddLogoDto,
  ): Promise<TierList> {
    return this.addLogoUseCase.execute(id, addLogoDto);
  }

  @Patch(':id/logos/move')
  @ApiOperation({ summary: 'Move a logo between categories' })
  @ApiResponse({ status: 200, description: 'The logo has been moved.' })
  async moveLogo(
    @Param('id') id: string,
    @Body() moveLogoDto: MoveLogoDto,
  ): Promise<TierList> {
    return this.moveLogoUseCase.execute(id, moveLogoDto);
  }
}
