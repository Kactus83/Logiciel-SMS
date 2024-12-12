import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ElectronService {
    async selectPdf(): Promise<{ success: boolean; filePath?: string; data?: string; message?: string }> {
        if (window['electronAPI']) {
            return await window['electronAPI'].selectPdf();
        }
        return { success: false, message: 'Electron API not available' };
    }
}
