import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ElectronService } from 'app/core/electron/electron.service';

@Component({
    selector: 'pdf-viewer',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './pdf-viewer.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class PdfViewerComponent {
    pdfData: string | null = null;

    constructor(private electronService: ElectronService) {}

    async loadPdf(): Promise<void> {
        const result = await this.electronService.selectPdf();
        if (result.success) {
            console.log('PDF loaded:', result.filePath);
            this.pdfData = result.data; // Base64 PDF data
        } else {
            console.error(result.message);
        }
    }
}
