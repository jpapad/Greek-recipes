"use client"

import React, { useEffect, useState } from 'react'

export default function ClientPrefectureLoader({ fallbackId }: { fallbackId?: string }) {
    const [pref, setPref] = useState<any | null>(null)

    useEffect(() => {
        try {
            const url = new URL(window.location.href)
            const qp = url.searchParams.get('id')
            let id = qp || undefined
            if (!id) {
                const match = url.pathname.match(new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'))
                if (match) id = match[0]
            }
            if (!id && fallbackId) id = fallbackId
            if (!id) return

            // If we have an id in the path but not in query, replace to include it so server can read searchParams
            if (!qp && id) {
                url.searchParams.set('id', id)
                // Use replace to avoid history pollution
                location.replace(url.toString())
                return
            }

            ;(async () => {
                try {
                    const res = await fetch(`/api/debug/prefectures/${id}`)
                    if (res.ok) setPref(await res.json())
                } catch (e) {
                    // ignore
                }
            })()
        } catch (e) {
            // ignore
        }
    }, [fallbackId])

    if (!pref) return <div className="p-4">Loading...</div>
    return (
        <div>
            <h2 className="text-xl font-semibold">Client-loaded Prefecture</h2>
            <pre className="mt-2 text-sm bg-white p-3 rounded">{JSON.stringify(pref, null, 2)}</pre>
        </div>
    )
}
