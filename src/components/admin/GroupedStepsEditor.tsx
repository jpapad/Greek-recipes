"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { StepGroup } from "@/lib/types";

interface GroupedStepsEditorProps {
    groups: StepGroup[];
    onChange: (groups: StepGroup[]) => void;
}

export function GroupedStepsEditor({ groups, onChange }: GroupedStepsEditorProps) {
    const addGroup = () => {
        onChange([...groups, { title: '', items: [''] }]);
    };

    const removeGroup = (groupIndex: number) => {
        if (groups.length > 1) {
            onChange(groups.filter((_, i) => i !== groupIndex));
        }
    };

    const updateGroupTitle = (groupIndex: number, title: string) => {
        const newGroups = [...groups];
        newGroups[groupIndex] = { ...newGroups[groupIndex], title };
        onChange(newGroups);
    };

    const addItem = (groupIndex: number) => {
        const newGroups = [...groups];
        newGroups[groupIndex].items.push('');
        onChange(newGroups);
    };

    const removeItem = (groupIndex: number, itemIndex: number) => {
        const newGroups = [...groups];
        if (newGroups[groupIndex].items.length > 1) {
            newGroups[groupIndex].items = newGroups[groupIndex].items.filter((_, i) => i !== itemIndex);
            onChange(newGroups);
        }
    };

    const updateItem = (groupIndex: number, itemIndex: number, value: string) => {
        const newGroups = [...groups];
        newGroups[groupIndex].items[itemIndex] = value;
        onChange(newGroups);
    };

    const moveGroup = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= groups.length) return;
        const newGroups = [...groups];
        const [moved] = newGroups.splice(fromIndex, 1);
        newGroups.splice(toIndex, 0, moved);
        onChange(newGroups);
    };

    const moveItem = (groupIndex: number, fromIndex: number, toIndex: number) => {
        const items = groups[groupIndex].items;
        if (toIndex < 0 || toIndex >= items.length) return;
        const newGroups = [...groups];
        const [moved] = newGroups[groupIndex].items.splice(fromIndex, 1);
        newGroups[groupIndex].items.splice(toIndex, 0, moved);
        onChange(newGroups);
    };

    // Calculate step number across all groups
    const getStepNumber = (groupIndex: number, itemIndex: number): number => {
        let count = 0;
        for (let g = 0; g < groupIndex; g++) {
            count += groups[g].items.length;
        }
        return count + itemIndex + 1;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Βήματα Παρασκευής</h3>
                <Button type="button" onClick={addGroup} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" /> Προσθήκη Ομάδας
                </Button>
            </div>

            {groups.map((group, groupIndex) => (
                <GlassPanel key={groupIndex} className="p-4 bg-white/30">
                    <div className="space-y-3">
                        {/* Group Header */}
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => moveGroup(groupIndex, groupIndex - 1)}
                                    disabled={groupIndex === 0}
                                    className="h-8 w-8"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => moveGroup(groupIndex, groupIndex + 1)}
                                    disabled={groupIndex === groups.length - 1}
                                    className="h-8 w-8"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                            <Input
                                value={group.title || ''}
                                onChange={(e) => updateGroupTitle(groupIndex, e.target.value)}
                                placeholder="Τίτλος ομάδας (προαιρετικό, π.χ. 'Προετοιμασία ζύμης')"
                                className="flex-1 font-semibold"
                            />
                            {groups.length > 1 && (
                                <Button
                                    type="button"
                                    onClick={() => removeGroup(groupIndex)}
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* Group Items */}
                        <div className="space-y-2 pl-4">
                            {group.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex items-start gap-2">
                                    <div className="flex gap-1 pt-2">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => moveItem(groupIndex, itemIndex, itemIndex - 1)}
                                            disabled={itemIndex === 0}
                                            className="h-8 w-6"
                                        >
                                            <ChevronUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => moveItem(groupIndex, itemIndex, itemIndex + 1)}
                                            disabled={itemIndex === group.items.length - 1}
                                            className="h-8 w-6"
                                        >
                                            <ChevronDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <div className="flex-shrink-0 w-8 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-lg font-bold">
                                        {getStepNumber(groupIndex, itemIndex)}
                                    </div>
                                    <Textarea
                                        value={item}
                                        onChange={(e) => updateItem(groupIndex, itemIndex, e.target.value)}
                                        placeholder={`Βήμα ${getStepNumber(groupIndex, itemIndex)}`}
                                        rows={2}
                                        className="flex-1"
                                    />
                                    {group.items.length > 1 && (
                                        <Button
                                            type="button"
                                            onClick={() => removeItem(groupIndex, itemIndex)}
                                            size="icon"
                                            variant="ghost"
                                            className="text-destructive mt-2"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => addItem(groupIndex)}
                                size="sm"
                                variant="ghost"
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-1" /> Προσθήκη Βήματος
                            </Button>
                        </div>
                    </div>
                </GlassPanel>
            ))}
        </div>
    );
}
