export function approxEquals(value1: number, value2: number, epsilon?: number): boolean {
    if (epsilon == null) {
        epsilon = 0.0001;
    }
    return Math.abs(value1 - value2) < epsilon;
}
