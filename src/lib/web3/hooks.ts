// src/lib/web3/hooks.ts
"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { formatUnits, parseUnits, maxUint256 } from "viem";
import {
  RIBX_TOKEN_ADDRESS,
  RIBX_STAKING_ADDRESS,
  erc20Abi,
  stakingAbi,
} from "./contracts";

export function useWallet() {
  const { address, isConnected, status } = useAccount();
  return { address, isConnected, status };
}

export function useRibxBalances() {
  const { address } = useAccount();
  const enabled = !!address;

  const { data: walletBalanceRaw, isLoading: walletLoading } = useReadContract({
    address: RIBX_TOKEN_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: userInfo, isLoading: userInfoLoading } = useReadContract({
    address: RIBX_STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: "userInfo",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: pendingRaw, isLoading: pendingLoading } = useReadContract({
    address: RIBX_STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: "pendingRewards",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const { data: tierRaw, isLoading: tierLoading } = useReadContract({
    address: RIBX_STAKING_ADDRESS,
    abi: stakingAbi,
    functionName: "getTier",
    args: address ? [address] : undefined,
    query: { enabled },
  });

  const decimals = 18;

  const walletBalance =
    typeof walletBalanceRaw === "bigint"
      ? formatUnits(walletBalanceRaw, decimals)
      : "0";

  // Use BigInt(0) instead of 0n to avoid BigInt literal (ES2020+) requirement
  const stakedAmountRaw =
    userInfo && Array.isArray(userInfo)
      ? (userInfo[0] as bigint)
      : BigInt(0);

  const stakedBalance = formatUnits(stakedAmountRaw, decimals);

  const pendingRewards =
    typeof pendingRaw === "bigint" ? formatUnits(pendingRaw, decimals) : "0";

  const tier =
    typeof tierRaw === "number" || typeof tierRaw === "bigint"
      ? Number(tierRaw)
      : 0;

  const isLoading =
    walletLoading || userInfoLoading || pendingLoading || tierLoading;

  return { walletBalance, stakedBalance, pendingRewards, tier, isLoading };
}

export function useStakingActions() {
  const { address } = useAccount();
  const {
    writeContract,
    data: hash,
    isPending,
    error: writeError,
  } = useWriteContract();

  const { status: txStatus } = useWaitForTransactionReceipt({
    hash,
    query: { enabled: !!hash },
  });

  const requireAddress = () => {
    if (!address) throw new Error("Wallet not connected");
    return address;
  };

  const approve = async (amount: string | "max" = "max") => {
    requireAddress();
    const value = amount === "max" ? maxUint256 : parseUnits(amount, 18);

    await writeContract({
      address: RIBX_TOKEN_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [RIBX_STAKING_ADDRESS, value],
    });
  };

  const stake = async (amount: string) => {
    requireAddress();
    const value = parseUnits(amount, 18);

    await writeContract({
      address: RIBX_STAKING_ADDRESS,
      abi: stakingAbi,
      functionName: "stake",
      args: [value],
    });
  };

  const withdraw = async (amount: string) => {
    requireAddress();
    const value = parseUnits(amount, 18);

    await writeContract({
      address: RIBX_STAKING_ADDRESS,
      abi: stakingAbi,
      functionName: "withdraw",
      args: [value],
    });
  };

  const claim = async () => {
    requireAddress();
    await writeContract({
      address: RIBX_STAKING_ADDRESS,
      abi: stakingAbi,
      functionName: "claim",
      args: [],
    });
  };

  return {
    approve,
    stake,
    withdraw,
    claim,
    txHash: hash,
    txStatus,
    isPending,
    writeError,
  };
}
