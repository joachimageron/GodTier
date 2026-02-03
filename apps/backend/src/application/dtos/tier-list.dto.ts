import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TIER_CATEGORIES } from '../../domain/tier-list';
import type { TierCategory } from '../../domain/tier-list';

export class CreateTierListDto {
  @ApiProperty({ example: 'My Custom Tier List' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A description of my tier list', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AddLogoDto {
  @ApiProperty({ example: 'UUID of the logo' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Google' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'https://logo.dev/google.png' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ enum: TIER_CATEGORIES, example: 'S' })
  @IsEnum(TIER_CATEGORIES)
  category: TierCategory;
}

export class MoveLogoDto {
  @ApiProperty({ example: 'UUID of the logo' })
  @IsString()
  @IsNotEmpty()
  logoId: string;

  @ApiProperty({ enum: TIER_CATEGORIES, example: 'A' })
  @IsEnum(TIER_CATEGORIES)
  categoryId: TierCategory;
}
