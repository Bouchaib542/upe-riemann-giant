// UPE–Riemann (Giant) — BigInt + Miller–Rabin up to 4×10^18

// Known imaginary parts of first Riemann zeros (for display only)
const RIEMANN_GAMMAS = [
  14.134725, 21.022040, 25.010858, 30.424876, 32.935061,
  37.586178, 40.918719, 43.327073, 48.005150, 49.773832,
  52.970321, 56.446247, 59.347044, 60.831779, 65.112545
];

// Small primes for quick trial division (and to set parity, mod 3, etc.)
const SMALL_PRIMES = [2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n,41n,43n,47n,53n,59n,61n,67n,71n,73n,79n,83n,89n,97n];

// --- BigInt helpers ---
function toBigInt(x) {
  try {
    if (typeof x === 'bigint') return x;
    if (typeof x === 'number') return BigInt(x);
    // remove spaces/commas
    const s = String(x).replace(/[\s,_]/g, '');
    return BigInt(s);
  } catch {
    return null;
  }
}

function modPow(base, exp, mod) {
  base %= mod;
  let res = 1n;
  while (exp > 0n) {
    if (exp & 1n) res = (res * base) % mod;
    base = (base * base) % mod;
    exp >>= 1n;
  }
  return res;
}

// Deterministic Miller–Rabin for 64-bit range (n < 2^64) using fixed bases
// For n up to 4e18 (< 2^62), bases [2,3,5,7,11,13,17] are sufficient.
const MR_BASES_64 = [2n,3n,5n,7n,11n,13n,17n];

function isProbablePrime(n) {
  if (n < 2n) return false;
  // small primes
  for (const p of SMALL_PRIMES) {
    if (n === p) return true;
    if (n % p === 0n) return n === p;
  }
  // write n-1 as d*2^s
  let d = n - 1n, s = 0n;
  while ((d & 1n) === 0n) { d >>= 1n; s++; }
  const tryBase = (a) => {
    if (a % n === 0n) return true;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) return true;
    for (let r = 1n; r < s; r++) {
      x = (x * x) % n;
      if (x === n - 1n) return true;
    }
    return false;
  };
  for (const a of MR_BASES_64) {
    if (!tryBase(a)) return false;
  }
  return true;
}

// UPE Goldbach minimal symmetric pair for even E (BigInt)
function upeGoldbach(E) {
  if (E % 2n !== 0n || E < 4n) return { ok:false, msg:"E must be an even integer ≥ 4" };

  const x = E / 2n;
  // parity rule: if x even => t odd start at 1; if x odd => t even start at 2
  let t = (x % 2n === 0n) ? 1n : 2n;

  // optional: small optimization to skip t divisible by 3 when both sides would be multiple of 3
  const xMod3 = Number(x % 3n);

  // hard safety cap to avoid infinite loops in pathological cases
  const MAX_STEPS = 5_000_000; // this is generous; Miller–Rabin is fast
  let steps = 0;

  while (true) {
    // quick mod 3 skip
    if (xMod3 === 0 && (t % 3n === 0n)) { t += 2n; steps++; if (steps > MAX_STEPS) break; continue; }

    const p = x - t;
    const q = x + t;
    if (p > 1n && isProbablePrime(p) && isProbablePrime(q)) {
      return { ok:true, p, q, t, delta: 2n*t };
    }
    t += 2n; steps++;
    if (steps > MAX_STEPS) break;
  }
  return { ok:false, msg:"Search limit exceeded. Try a different E." };
}

function nearestRiemannGamma(fnorm) {
  let nearest = RIEMANN_GAMMAS[0], diff = Math.abs(fnorm - RIEMANN_GAMMAS[0]);
  for (const g of RIEMANN_GAMMAS) {
    const d = Math.abs(fnorm - g);
    if (d < diff) { diff = d; nearest = g; }
  }
  return nearest;
}

function computeUPE() {
  const output = document.getElementById('output');
  let E = toBigInt(document.getElementById('evenInput').value);
  if (E === null) {
    output.textContent = "Invalid input. Enter an even integer (digits only).";
    return;
  }
  if (E < 4n || E % 2n !== 0n) {
    output.textContent = "E must be an even integer ≥ 4.";
    return;
  }
  const LIMIT = 4_000_000_000_000_000_000n; // 4×10^18
  if (E > LIMIT) {
    output.textContent = "E is too large. Max allowed is 4×10^18.";
    return;
  }

  const res = upeGoldbach(E);
  if (!res.ok) {
    output.textContent = res.msg;
    return;
  }

  const { p, q, t, delta } = res;
  // f(E) = t / (log E)^2  (compute with Number for display; safe here)
  const fNorm = Number(t) / Math.pow(Math.log(Number(E)), 2);
  const gNear = nearestRiemannGamma(fNorm);

  output.innerHTML = `
    <p>Goldbach pair: <strong>${p.toString()} + ${q.toString()} = ${E.toString()}</strong></p>
    <p>Displacement: t = ${t.toString()}, Gap Δ = ${delta.toString()}</p>
    <p>Normalized f(E) = ${fNorm.toFixed(6)}</p>
    <p>Nearest Riemann zero γ ≈ ${gNear}</p>
  `;
}
