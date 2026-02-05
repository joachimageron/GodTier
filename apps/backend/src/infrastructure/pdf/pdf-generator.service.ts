import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { PdfGeneratorService } from '../../application/ports/pdf-generator.service';
import { TierList, TIER_CATEGORIES, TIER_DESCRIPTIONS } from '../../domain/tier-list';

@Injectable()
export class PdfKitGeneratorService implements PdfGeneratorService {
  async generateTierListsSummary(tierLists: TierList[]): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => {
          reject(err);
      });

      doc.fontSize(25).text('Tier Lists Summary', { align: 'center' });
      doc.moveDown();

      if (tierLists.length === 0) {
          doc.fontSize(14).text("No tier lists found for this user.");
      } else {
          let isFirst = true;
          for (const tierList of tierLists) {
            if (!isFirst) {
                doc.addPage();
            } else {
                doc.moveDown();
            }
            isFirst = false;

            doc.fontSize(20).text(tierList.title, { underline: true });
            if (tierList.description) {
                doc.fontSize(12).text(tierList.description);
            }
            doc.moveDown();

            const items = tierList.items;

            for (const category of TIER_CATEGORIES) {
                const logos = items[category];
                if (logos.length > 0) {
                    doc.fontSize(16).text(`Category ${category} - ${TIER_DESCRIPTIONS[category]}`);
                    for (const logo of logos) {
                        doc.fontSize(12).text(`- ${logo.name}`, { indent: 20 });
                    }
                    doc.moveDown(0.5);
                }
            }
          }
      }

      doc.end();
    });
  }
}
