# UPE–Riemann (Giant)

A classic, minimal website that computes **Goldbach pairs up to 4×10^18** using the **Unified Prime Equation (UPE)** with **BigInt + Miller–Rabin** in the browser. Includes a short **read-only article** (no downloads).

## Objective
- Input an even number `E ≤ 4×10^18`.
- Find the minimal symmetric pair `(p, q) = (E/2 − t, E/2 + t)` with both primes.
- Report `t`, `Δ = 2t`, normalized `f(E) = t / (log E)^2`, and the nearest known zeta zero `γ`.

## Files
- `index.html` — homepage and calculator (BigInt + Miller–Rabin)
- `style.css` — minimal styles
- `script.js` — UPE logic with deterministic MR bases for 64-bit integers
- `article.html` — short read-only article (no download links)
- `robots.txt` — allow crawling
- `sitemap.xml` — list site pages for search engines

## Usage (GitHub Pages)
1. Create a public repo (e.g., `upe-riemann-giant`), commit these files.
2. Enable **Pages** on `main` branch, root folder.
3. Visit `https://<your-username>.github.io/upe-riemann-giant/`.

## Notes
- Miller–Rabin bases `[2,3,5,7,11,13,17]` are used for 64-bit determinism.
- The calculator is synchronous; for extremely sparse cases, try a nearby `E` if a search cap is hit.

© 2025 Bouchaïb Bahbouhi — CC-BY 4.0 (text), MIT (code).
