


export function convertSnaps<T>(snaps) {
    return <T[]>snaps.map(snap => {
        return {
            ...snap.payload.doc.data(),
            id: snap.payload.doc.id
        };

    });
}