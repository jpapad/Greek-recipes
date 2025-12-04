import { CodeBlock as CodeBlockType } from '@/lib/types/pages';

export default function CodeBlock({ block }: { block: CodeBlockType }) {
    return (
        <div className="w-full overflow-x-auto my-6">
            <pre className="p-3 sm:p-4 md:p-6 rounded-lg bg-slate-900 text-slate-50 overflow-x-auto text-xs sm:text-sm">
                {block.data.showLineNumbers && (
                    <code className="block">
                        {block.data.code.split('\n').map((line: string, i: number) => (
                            <div key={i} className="table-row">
                                <span className="table-cell pr-4 text-slate-500 select-none text-right">
                                    {i + 1}
                                </span>
                                <span className="table-cell">{line}</span>
                            </div>
                        ))}
                    </code>
                )}
                {!block.data.showLineNumbers && (
                    <code className="block whitespace-pre-wrap sm:whitespace-pre">
                        {block.data.code}
                    </code>
                )}
            </pre>
            {block.data.language && (
                <div className="text-xs text-muted-foreground mt-1 px-1">
                    Language: {block.data.language}
                </div>
            )}
        </div>
    );
}
