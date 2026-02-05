import { Inject, Injectable } from '@nestjs/common';
import type { TierListRepository } from '../../ports/tier-list.repository';
import type { PdfGeneratorService } from '../../ports/pdf-generator.service';
import type { FileStorageService } from '../../ports/file-storage.service';

@Injectable()
export class GetTierListsPdfSummaryUseCase {
  constructor(
    @Inject('TierListRepository')
    private readonly tierListRepository: TierListRepository,
    @Inject('PdfGeneratorService')
    private readonly pdfGeneratorService: PdfGeneratorService,
    @Inject('FileStorageService')
    private readonly fileStorageService: FileStorageService,
  ) {}

  async execute(ownerId: number): Promise<Buffer> {
    const tierLists = await this.tierListRepository.findByOwnerId(ownerId);
    const pdfBuffer = await this.pdfGeneratorService.generateTierListsSummary(tierLists);

    const fileName = `tier-lists-summary-${ownerId}-${Date.now()}.pdf`;
    await this.fileStorageService.upload(fileName, pdfBuffer, 'application/pdf');

    return pdfBuffer;
  }
}
