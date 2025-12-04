import jsPDF from 'jspdf';
import { ShoppingItem } from '@/context/ShoppingListContext';
import { CATEGORIES, IngredientCategory } from './ingredientCategories';

export function exportShoppingListToPDF(items: ShoppingItem[]) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Title
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Λίστα Αγορών', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(`Δημιουργήθηκε: ${new Date().toLocaleDateString('el-GR')}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Group items by category
    const groupedItems: Record<IngredientCategory, ShoppingItem[]> = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
    }, {} as Record<IngredientCategory, ShoppingItem[]>);

    // Category order
    const categoryOrder: IngredientCategory[] = ['produce', 'dairy', 'meat', 'seafood', 'pantry', 'spices', 'other'];

    categoryOrder.forEach(categoryKey => {
        const categoryItems = groupedItems[categoryKey];
        if (!categoryItems || categoryItems.length === 0) return;

        const category = CATEGORIES[categoryKey];

        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
        }

        // Category header
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0);
        doc.text(`${category.icon} ${category.label}`, 15, yPosition);
        
        yPosition += 7;

        // Separator line
        doc.setDrawColor(200);
        doc.setLineWidth(0.5);
        doc.line(15, yPosition, pageWidth - 15, yPosition);
        
        yPosition += 5;

        // Items
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        
        categoryItems.forEach((item, index) => {
            if (yPosition > pageHeight - 20) {
                doc.addPage();
                yPosition = 20;
            }

            // Checkbox
            doc.rect(15, yPosition - 3, 4, 4);
            
            // Quantity
            if (item.quantity > 1) {
                doc.setFont('helvetica', 'bold');
                doc.text(`${item.quantity}x`, 25, yPosition);
                doc.setFont('helvetica', 'normal');
                doc.text(item.name, 37, yPosition);
            } else {
                doc.text(item.name, 25, yPosition);
            }

            // Recipe title (if exists)
            if (item.recipeTitle) {
                doc.setFontSize(9);
                doc.setTextColor(150);
                doc.text(`(${item.recipeTitle})`, 25, yPosition + 4);
                doc.setFontSize(11);
                doc.setTextColor(0);
                yPosition += 4;
            }

            yPosition += 7;
        });

        yPosition += 5;
    });

    // Footer
    const totalItems = items.length;
    const uncheckedItems = items.filter(i => !i.checked).length;
    
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
        `Σύνολο: ${totalItems} προϊόντα | Απομένουν: ${uncheckedItems}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
    );

    // Save
    doc.save(`shopping-list-${new Date().toISOString().split('T')[0]}.pdf`);
}
