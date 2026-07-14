type WithDate = { date: string };

function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay(); // 0 = Sunday ... 6 = Saturday
    const diff = (day === 0 ? -6 : 1) - day; // shift back to Monday
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function groupTransactionsByWeek<T extends WithDate>(transactions: T[]) {
    const groups = new Map<string, T[]>();

    transactions.forEach((tx) => {
        const key = getWeekStart(new Date(tx.date)).toISOString();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(tx);
    });

    const sortedKeys = Array.from(groups.keys()).sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedKeys.map((key, index) => ({
        title: `Week ${index + 1}`,
        weekStart: new Date(key),
        data: groups.get(key)!.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
    }));
}