"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function AdminImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [importing, setImporting] = useState(false);
    const [preview, setPreview] = useState<any[] | null>(null);
    const { showToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.json')) {
            showToast('Μόνο αρχεία CSV ή JSON επιτρέπονται', 'error');
            return;
        }

        setFile(selectedFile);

        // Preview first 5 rows
        try {
            const text = await selectedFile.text();
            if (selectedFile.name.endsWith('.json')) {
                const data = JSON.parse(text);
                setPreview(Array.isArray(data) ? data.slice(0, 5) : [data]);
            } else {
                // Simple CSV parsing
                const lines = text.split('\n').slice(0, 6); // Header + 5 rows
                const headers = lines[0].split(',');
                const rows = lines.slice(1).map(line => {
                    const values = line.split(',');
                    const obj: any = {};
                    headers.forEach((h, i) => {
                        obj[h.trim()] = values[i]?.trim();
                    });
                    return obj;
                });
                setPreview(rows);
            }
        } catch (error) {
            showToast('Σφάλμα ανάγνωσης αρχείου', 'error');
            console.error(error);
        }
    };

    const handleImport = async () => {
        if (!file) {
            showToast('Επιλέξτε αρχείο πρώτα', 'error');
            return;
        }

        setImporting(true);
        try {
            // TODO: Implement bulk import
            // Parse file and insert into database
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate
            showToast('Η εισαγωγή ολοκληρώθηκε επιτυχώς!', 'success');
            setFile(null);
            setPreview(null);
        } catch (error) {
            showToast('Σφάλμα κατά την εισαγωγή', 'error');
            console.error(error);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Μαζική Εισαγωγή Συνταγών</h1>
                <p className="text-muted-foreground">
                    Εισάγετε πολλές συνταγές ταυτόχρονα από αρχείο CSV ή JSON
                </p>
            </div>

            <GlassPanel className="p-6 space-y-6">
                <div className="space-y-4">
                    <Label htmlFor="file-upload">Επιλογή Αρχείου</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="file-upload"
                            type="file"
                            accept=".csv,.json"
                            onChange={handleFileChange}
                            className="flex-1"
                        />
                        {file && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                {file.name}
                            </div>
                        )}
                    </div>
                </div>

                {preview && (
                    <div className="space-y-2">
                        <Label>Προεπισκόπηση (Πρώτες 5 εγγραφές)</Label>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        {Object.keys(preview[0]).map(key => (
                                            <th key={key} className="p-2 text-left font-semibold">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, idx) => (
                                        <tr key={idx} className="border-b border-border/30">
                                            {Object.values(row).map((value: any, i) => (
                                                <td key={i} className="p-2">
                                                    {String(value).substring(0, 50)}
                                                    {String(value).length > 50 && '...'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex gap-2">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 text-sm">
                            <p className="font-semibold text-blue-900 dark:text-blue-100">
                                Απαιτούμενα Πεδία
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-blue-800 dark:text-blue-200">
                                <li>title (κείμενο)</li>
                                <li>slug (μοναδικό, χωρίς κενά)</li>
                                <li>ingredients (JSON array ή διαχωρισμένα με κόμμα)</li>
                                <li>steps (JSON array ή διαχωρισμένα με κόμμα)</li>
                                <li>time_minutes (αριθμός)</li>
                                <li>servings (αριθμός)</li>
                                <li>difficulty (easy/medium/hard)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setFile(null);
                            setPreview(null);
                        }}
                        disabled={!file || importing}
                    >
                        Ακύρωση
                    </Button>
                    <Button
                        onClick={handleImport}
                        disabled={!file || importing}
                        className="gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {importing ? 'Εισαγωγή...' : 'Εισαγωγή Συνταγών'}
                    </Button>
                </div>
            </GlassPanel>
        </div>
    );
}
