import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ClothingItem, WornItem, WeatherData, AppSettings } from '@/types';

interface ExportData {
  items: ClothingItem[];
  wornToday: WornItem[];
  weather: WeatherData | null;
  settings: AppSettings;
}

function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getCategoryLabel(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function useExport() {
  const exportAsPDF = useCallback((data: ExportData) => {
    const { items, wornToday, weather } = data;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Title
    doc.setFontSize(22);
    doc.text('MyWardrobe - Inventory Report', pageWidth / 2, 20, { align: 'center' });

    // Date
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

    // Weather summary
    if (weather) {
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Weather: ${weather.temperature}°C, ${getStatusLabel(weather.condition)}`, 14, 40);
      doc.text(`Humidity: ${weather.humidity}%`, 14, 47);
    }

    // Summary stats
    const totalItems = items.length;
    const cleanCount = items.filter((i) => i.status === 'clean').length;
    const dirtyCount = items.filter((i) => i.status === 'dirty').length;
    const inWashCount = items.filter((i) => i.status === 'in-wash').length;
    const wornCount = items.filter((i) => i.status === 'worn').length;

    doc.setFontSize(12);
    doc.text('Summary', 14, 58);

    const summaryData = [
      ['Total Items', String(totalItems)],
      ['Clean', String(cleanCount)],
      ['Dirty', String(dirtyCount)],
      ['In Wash', String(inWashCount)],
      ['Currently Worn', String(wornCount)],
      ['Outfit Logged Today', String(wornToday.length)],
    ];

    autoTable(doc, {
      startY: 62,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [92, 84, 112] },
    });

    // Items table
    const tableBody = items.map((item) => [
      item.name,
      getCategoryLabel(item.category),
      item.color,
      item.brand || '-',
      getStatusLabel(item.status),
      String(item.wearCount),
      item.lastWornDate ? new Date(item.lastWornDate).toLocaleDateString() : 'Never',
      item.isUndergarment ? 'Yes' : 'No',
    ]);

    autoTable(doc, {
      startY: (doc as any).lastAutoTable?.finalY + 10 || 120,
      head: [['Name', 'Category', 'Color', 'Brand', 'Status', 'Worn', 'Last Worn', 'Undergarment']],
      body: tableBody,
      theme: 'striped',
      headStyles: { fillColor: [92, 84, 112] },
      styles: { fontSize: 9 },
    });

    // Hygiene summary
    const undergarments = items.filter((i) => i.isUndergarment);
    if (undergarments.length > 0) {
      autoTable(doc, {
        startY: (doc as any).lastAutoTable?.finalY + 10 || 200,
        head: [['Undergarment Hygiene Summary']],
        body: [[`Total undergarments: ${undergarments.length}`]],
        theme: 'grid',
        headStyles: { fillColor: [231, 111, 81] },
      });
    }

    // AI analysis prompt
    const finalY = (doc as any).lastAutoTable?.finalY + 15 || 250;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text('AI Analysis Prompt:', 14, finalY);
    doc.setFontSize(9);
    const promptText =
      'Analyze this wardrobe inventory and determine:\n' +
      '- Items that may need replacing based on wear count\n' +
      '- Undergarment hygiene compliance based on wear duration\n' +
      '- Seasonal gaps (missing summer/winter items)\n' +
      '- Items suitable for donation\n' +
      '- Outfit combination suggestions\n' +
      'This report is not professional fashion or medical advice.';
    const splitText = doc.splitTextToSize(promptText, pageWidth - 28);
    doc.text(splitText, 14, finalY + 6);

    doc.save('mywardrobe-report.pdf');
  }, []);

  const exportAsTXT = useCallback((data: ExportData) => {
    const { items, wornToday, weather } = data;
    let content = '============================================\n';
    content += '      MYWARDROBE INVENTORY REPORT\n';
    content += '============================================\n';
    content += `Generated: ${new Date().toLocaleString()}\n\n`;

    if (weather) {
      content += '--- WEATHER ---\n';
      content += `Temperature: ${weather.temperature}°C\n`;
      content += `Condition: ${weather.condition}\n`;
      content += `Humidity: ${weather.humidity}%\n\n`;
    }

    content += '--- SUMMARY ---\n';
    content += `Total Items: ${items.length}\n`;
    content += `Clean: ${items.filter((i) => i.status === 'clean').length}\n`;
    content += `Dirty: ${items.filter((i) => i.status === 'dirty').length}\n`;
    content += `In Wash: ${items.filter((i) => i.status === 'in-wash').length}\n`;
    content += `Currently Worn: ${items.filter((i) => i.status === 'worn').length}\n`;
    content += `Outfit Logged Today: ${wornToday.length}\n\n`;

    content += '--- ITEMS ---\n';
    items.forEach((item, idx) => {
      content += `\n[${idx + 1}] ${item.name}\n`;
      content += `  Category: ${item.category}\n`;
      content += `  Color: ${item.color}\n`;
      content += `  Brand: ${item.brand || 'N/A'}\n`;
      content += `  Material: ${item.material || 'N/A'}\n`;
      content += `  Status: ${item.status}\n`;
      content += `  Wear Count: ${item.wearCount}\n`;
      content += `  Last Worn: ${item.lastWornDate ? new Date(item.lastWornDate).toLocaleDateString() : 'Never'}\n`;
      content += `  Undergarment: ${item.isUndergarment ? 'Yes' : 'No'}\n`;
      if (item.notes) content += `  Notes: ${item.notes}\n`;
    });

    content += '\n\n--- AI ANALYSIS PROMPT ---\n';
    content += 'Analyze this wardrobe inventory and determine:\n';
    content += '- Items that may need replacing based on wear count\n';
    content += '- Undergarment hygiene compliance based on wear duration\n';
    content += '- Seasonal gaps (missing summer/winter items)\n';
    content += '- Items suitable for donation\n';
    content += '- Outfit combination suggestions\n';
    content += 'This report is not professional fashion or medical advice.\n';

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mywardrobe-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportAsJSON = useCallback((data: ExportData) => {
    const exportObj = {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      items: data.items,
      wornToday: data.wornToday,
      weather: data.weather,
      settings: {
        ...data.settings,
        // Don't export internal settings
      },
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mywardrobe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportAsPDF, exportAsTXT, exportAsJSON };
}
