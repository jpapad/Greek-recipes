import { getPrefectures } from "@/lib/api";
import { PrefectureForm } from "@/components/admin/PrefectureForm";
import { notFound } from "next/navigation";

export default async function EditPrefecturePage({ params }: { params: { id: string } }) {
    const prefectures = await getPrefectures();
    const prefecture = prefectures.find((p) => p.id === params.id);

    if (!prefecture) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Edit Prefecture</h1>
                <p className="text-muted-foreground mt-1">Update {prefecture.name}</p>
            </div>
            <PrefectureForm prefecture={prefecture} />
        </div>
    );
}
