// --- src/lib/utils.ts ---
export const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
    });
};
