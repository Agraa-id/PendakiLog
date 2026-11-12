// Fungsi utility: menunda eksekusi selama `ms` milidetik.
// Dipakai untuk mensimulasikan server yang lambat.
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
