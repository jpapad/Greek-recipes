"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RecipePrintButton() {
    const handlePrint = () => {
        window.print();
    };

    return (
        <Button onClick={handlePrint} variant="outline" className="print:hidden">
            <Printer className="w-4 h-4 mr-2" />
            Print Recipe
        </Button>
    );
}
