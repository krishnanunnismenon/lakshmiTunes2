import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import ExcelJS from 'exceljs';

const addHeader = (doc) => {
  doc.setFillColor(52, 152, 219); // A nice blue color
  doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('LAKSHMI TUNES', doc.internal.pageSize.width / 2, 25, { align: 'center' });
};

const addTagline = (doc) => {
  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`Report generated on ${dateString} at ${timeString}`, doc.internal.pageSize.width / 2, 45, { align: 'center' });
};

export const generatePDFReport = (data) => {
  return new Promise((resolve) => {
    const doc = new jsPDF();

    addHeader(doc);
    addTagline(doc);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Report', doc.internal.pageSize.width / 2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Sales: $${data.totalSales.toFixed(2)}`, 20, 75);
    doc.text(`Total Customers: ${data.totalCustomers}`, 20, 85);
    doc.text(`Total Orders: ${data.totalOrders}`, 20, 95);

    // Sales Overview
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Sales Overview:', 20, 115);
    const salesOverviewData = data.salesOverview.map(sale => [sale._id, `$${sale.total.toFixed(2)}`]);
    doc.autoTable({
      startY: 120,
      head: [['Date', 'Total']],
      body: salesOverviewData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
    });

    // Category Sales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Category Sales:', 20, doc.lastAutoTable.finalY + 20);
    const categorySalesData = data.categorySales.map(category => [category._id, `$${category.total.toFixed(2)}`]);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Category', 'Total']],
      body: categorySalesData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
    });

    // Latest Orders
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Latest Orders:', 20, doc.lastAutoTable.finalY + 20);
    const latestOrdersData = data.latestOrders.map(order => [
      order._id,
      order.user.name,
      `$${order.total.toFixed(2)}`,
      new Date(order.createdAt).toLocaleDateString()
    ]);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 25,
      head: [['Order ID', 'Customer', 'Total', 'Date']],
      body: latestOrdersData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }

    resolve(doc.output('arraybuffer'));
  });
};

export const generateExcelReport = (data) => {
  return new Promise((resolve) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sales Report');

    // Add header
    worksheet.mergeCells('A1:E1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'LAKSHMI TUNES';
    titleCell.font = { name: 'Arial', size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3498DB' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getRow(1).height = 30;

    // Add tagline
    worksheet.mergeCells('A2:E2');
    const now = new Date();
    const taglineCell = worksheet.getCell('A2');
    taglineCell.value = `Report generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    taglineCell.font = { name: 'Arial', size: 12, italic: true, color: { argb: 'FF666666' } };
    taglineCell.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add summary
    worksheet.addRow([]);
    worksheet.addRow(['Total Sales', `$${data.totalSales.toFixed(2)}`]);
    worksheet.addRow(['Total Customers', data.totalCustomers]);
    worksheet.addRow(['Total Orders', data.totalOrders]);
    worksheet.addRow([]);

    // Add sales overview
    worksheet.addRow(['Sales Overview']);
    worksheet.addRow(['Date', 'Total']);
    data.salesOverview.forEach((sale) => {
      worksheet.addRow([sale._id, sale.total]);
    });
    worksheet.addRow([]);

    // Add category sales
    worksheet.addRow(['Category Sales']);
    worksheet.addRow(['Category', 'Total']);
    data.categorySales.forEach((category) => {
      worksheet.addRow([category._id, category.total]);
    });
    worksheet.addRow([]);

    // Add latest orders
    worksheet.addRow(['Latest Orders']);
    worksheet.addRow(['Order ID', 'Customer', 'Total', 'Date']);
    data.latestOrders.forEach((order) => {
      worksheet.addRow([order._id, order.user.name, order.total, new Date(order.createdAt).toLocaleDateString()]);
    });

    // Style the worksheet
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      if (rowNumber === 1 || rowNumber === 2) return; // Skip header and tagline rows
      
      if (row.getCell(1).value && typeof row.getCell(1).value === 'string' && row.getCell(1).value.includes('Overview') || row.getCell(1).value.includes('Sales') || row.getCell(1).value.includes('Orders')) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF3498DB' }
          };
          cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        });
      }
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      column.width = Math.max(column.width, 15);
    });

    workbook.xlsx.writeBuffer().then(resolve);
  });
};