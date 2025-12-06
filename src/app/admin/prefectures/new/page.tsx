import { PrefectureForm } from "@/components/admin/PrefectureForm";

export default function NewPrefecturePage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Create New Prefecture</h1>
                <p className="text-muted-foreground mt-1">Add a new Greek prefecture (νομός)</p>
            </div>
            <PrefectureForm />
        </div>
    );
}
