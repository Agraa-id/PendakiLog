// Fungsi utility: menunda eksekusi selama `ms` milidetik.
// Dipakai untuk mensimulasikan server yang lambat.
export function delay(s: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, s);
  });
}
