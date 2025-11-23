export default function HomePage() {
  return (
    <main className="min-h-[70vh] flex flex-col justify-center">
      <section className="space-y-6">
        <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
          Web3 • Real Estate • Staking
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
          RIBX: Tokenized Access to <br />
          Real Estate, Yield & Governance
        </h1>
        <p className="max-w-xl text-sm text-gray-400">
          Stake RIBX to unlock higher access tiers, earn rewards, and gain
          priority into curated real estate opportunities. Built on Base with a
          fully audited smart contract stack.
        </p>

        <div className="flex gap-3 pt-2">
          <a
            href="/staking"
            className="rounded-full bg-yellow-400 px-6 py-2 text-xs font-semibold text-black uppercase tracking-[0.16em] hover:bg-yellow-300"
          >
            Open Staking Dashboard
          </a>
          <button className="rounded-full border border-white/20 px-6 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-200 hover:bg-white/5">
            View Documentation
          </button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3 text-sm">
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Chain
          </p>
          <p className="mt-2 font-semibold">Base Sepolia (Testnet)</p>
          <p className="mt-1 text-xs text-gray-400">
            RIBX is currently live on Base Sepolia for internal testing and
            integration.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Smart Contracts
          </p>
          <p className="mt-2 font-semibold">Token · Staking · Vesting · Locks</p>
          <p className="mt-1 text-xs text-gray-400">
            Fully tested and verified contracts forming the backbone of the
            RIBX ecosystem.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
            Next Milestone
          </p>
          <p className="mt-2 font-semibold">Frontend & Real Estate Portal</p>
          <p className="mt-1 text-xs text-gray-400">
            Connecting staking tiers to token-gated investment opportunities,
            governance, and GameFi.
          </p>
        </div>
      </section>
    </main>
  );
}
