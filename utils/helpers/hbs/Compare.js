export function Equals(a, b) {
    if (!a || !b) {
        return false;
    }

    const valueA = a ? a.toString() : '';
    const valueB = b ? b.toString() : '';

    return valueA === valueB;
}