"use client"

import React, { useEffect, useState } from 'react'

export default function ClientCityLoader() {
    const [city, setCity] = useState<any | null>(null)

    useEffect(() => {
        try {
            const url = new URL(window.location.href)
            const qp = url.searchParams.get('id')
            let id = qp || undefined
            if (!id) {
                const match = url.pathname.match(new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}'))
                if (match) id = match[0]
            }
            if (!id) return

            // If id found in path but not in query, update URL so server can read it
            if (!qp && id) {
                url.searchParams.set('id', id)
                location.replace(url.toString())
                return
            }

            ;(async () => {
                try {
                    const res = await fetch(`/api/debug/cities/${id}`)
                    if (res.ok) setCity(await res.json())
                } catch (e) {}
            })()
        } catch (e) {}
    }, [])

    if (!city) return <div className="p-4">Loading...</div>
    return (
        <div>
            <h2 className="text-xl font-semibold">Client-loaded City</h2>
            <pre className="mt-2 text-sm bg-white p-3 rounded">{JSON.stringify(city, null, 2)}</pre>
        </div>
    )
}
