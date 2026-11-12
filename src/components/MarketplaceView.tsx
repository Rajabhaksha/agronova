import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Database,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  ArrowUpDown,
  Download,
  Building,
  UserCheck,
  X,
} from "lucide-react";
import { MarketplaceListing, TransactionRecord } from "../types/agrinova";

export const MarketplaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"catalog" | "ledger">("catalog");
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<number>(200);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);

  // Buy Order Modal
  const [selectedListingForOrder, setSelectedListingForOrder] = useState<MarketplaceListing | null>(null);
  const [orderVolume, setOrderVolume] = useState<number>(1000);
  const [buyerName, setBuyerName] = useState<string>("Apex Agri-Foods Ltd.");
  const [buyerType, setBuyerType] = useState<"Wholesale Mill" | "Supermarket Chain" | "Organic Co-op" | "Exporter">("Wholesale Mill");
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  // Add Listing Modal
  const [isAddListingOpen, setIsAddListingOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newCategory, setNewCategory] = useState<MarketplaceListing["category"]>("Grains");
  const [newPrice, setNewPrice] = useState<number>(0.45);
  const [newStock, setNewStock] = useState<number>(5000);
  const [newFarmer, setNewFarmer] = useState<string>("David Miller");
  const [newLocation, setNewLocation] = useState<string>("Sunny Acre Farms, Plot 9");

  const fetchListings = () => {
    fetch(`/api/marketplace/listings?category=${categoryFilter}&search=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.listings) setListings(data.listings);
      });
  };

  const fetchTransactions = () => {
    fetch(`/api/marketplace/transactions?status=${statusFilter}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.transactions) {
          setTransactions(data.transactions);
          setTotalTransactions(data.totalTransactions || 200);
        }
      });
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/marketplace/listings`).then((r) => r.json()),
      fetch(`/api/marketplace/transactions?limit=100`).then((r) => r.json()),
    ])
      .then(([listingsData, txData]) => {
        if (listingsData.listings) setListings(listingsData.listings);
        if (txData.transactions) {
          setTransactions(txData.transactions);
          setTotalTransactions(txData.totalTransactions || 200);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchListings();
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOrder) return;

    try {
      const res = await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListingForOrder.id,
          volumeKg: orderVolume,
          buyerName,
          buyerType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrderSuccessMessage(`Order locked in escrow! Transaction Ref: ${data.transaction.transactionRef}`);
        setTotalTransactions(data.newTotalTransactions);
        fetchListings();
        fetchTransactions();
        setTimeout(() => {
          setSelectedListingForOrder(null);
          setOrderSuccessMessage(null);
        }, 2200);
      }
    } catch (err) {
      console.error("Order error:", err);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    try {
      const res = await fetch("/api/marketplace/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          pricePerKg: newPrice,
          availableKg: newStock,
          farmerName: newFarmer,
          farmLocation: newLocation,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddListingOpen(false);
        setNewTitle("");
        fetchListings();
      }
    } catch (err) {
      console.error("Add listing error:", err);
    }
  };

  const exportCSV = () => {
    const headers = "OrderRef,Crop,VolumeKg,UnitPriceUSD,TotalUSD,Farmer,Buyer,Status,Date\n";
    const rows = transactions
      .map(
        (t) =>
          `"${t.transactionRef}","${t.crop}",${t.volumeKg},${t.unitPrice},${t.totalUsd},"${t.farmer}","${t.buyer}","${t.escrowStatus}","${t.orderDate}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `agrinova_transactions_ledger_200.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 space-y-8">
      {/* Header & Architecture Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
            <span>Direct Trade Infrastructure</span>
            <span>·</span>
            <span>React.js + MySQL Architecture</span>
            <span>·</span>
            <span className="text-emerald-400 font-mono">200 Active Transactions on Vercel</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Direct Farmer-to-Buyer Marketplace
          </h2>
          <p className="text-sm text-stone-300 mt-1">
            Disintermediating wholesale brokers. Direct purchase contracts with smart escrow protection and certified quality grading.
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
              activeTab === "catalog"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-sm"
                : "text-stone-300 hover:text-white"
            }`}
          >
            Produce Catalog
          </button>
          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === "ledger"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-sm"
                : "text-stone-300 hover:text-white"
            }`}
          >
            <span>Transactions Ledger</span>
            <span className="font-mono px-1.5 py-0.2 bg-stone-950/80 text-emerald-400 rounded text-[10px]">
              {totalTransactions}
            </span>
          </button>
        </div>
      </div>

      {/* Architecture & Milestone Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-stone-900/60 border border-stone-800/80 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">React.js + MySQL Stack</span>
            <span className="text-stone-400">
              ACID-compliant transactional ledger supporting concurrent order settlement.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Escrow Protection</span>
            <span className="text-stone-400">
              Funds locked safely until quality moisture &amp; grade inspection pass.
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">200 Transactions Milestone</span>
            <span className="text-stone-400">
              Live commercial contracts on Vercel connecting 500 farmers to wholesale buyers.
            </span>
          </div>
        </div>
      </div>

      {/* TAB 1: PRODUCE CATALOG */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          {/* Search, Category Bar & Add Listing */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Segmented Buttons */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-lg">
              {["All", "Grains", "Vegetables", "Legumes", "Cash Crops"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? "bg-stone-800 text-white font-semibold"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input & Action */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search crop, farmer, or plot..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-stone-950 border border-stone-800 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-64"
                />
              </div>

              <button
                onClick={() => setIsAddListingOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-colors whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Produce</span>
              </button>
            </div>
          </div>

          {/* Listings Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <div
                key={item.id}
                className="bg-stone-900/90 border border-stone-800 rounded-xl overflow-hidden hover:border-emerald-600/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image slot with gradient scrim and fallback */}
                  <div className="relative h-44 overflow-hidden bg-stone-950">
                    <img
                      src={item.image}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent"></div>

                    {/* Metadata text */}
                    <div className="absolute top-3 left-3 text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-950/80 text-emerald-400 border border-emerald-900/40 backdrop-blur-sm">
                      {item.grade}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="text-xs text-stone-400 flex items-center justify-between">
                        <span>{item.category}</span>
                        <span className="font-mono text-emerald-400">★ {item.rating}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1 leading-snug">
                        {item.title}
                      </h3>
                    </div>

                    <div className="text-xs text-stone-300 space-y-1 p-2.5 bg-stone-950/60 border border-stone-800/80 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Farmer:</span>
                        <span className="font-medium text-white">{item.farmerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Farm:</span>
                        <span className="text-stone-300">{item.farmLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Available Stock:</span>
                        <span className="font-mono text-white tabular-nums">
                          {item.availableKg.toLocaleString()} kg
                        </span>
                      </div>
                    </div>

                    {/* Certifications clean text */}
                    <div className="text-[11px] text-stone-400 flex flex-wrap gap-1.5 pt-0.5">
                      {item.certifications.map((c, i) => (
                        <span key={i} className="text-stone-400">
                          {c} {i < item.certifications.length - 1 ? "·" : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-stone-800/80 mt-2">
                  <div>
                    <div className="text-[10px] text-stone-400 uppercase tracking-wider">
                      Wholesale Price
                    </div>
                    <div className="text-lg font-extrabold text-white font-mono tabular-nums">
                      ${item.pricePerKg.toFixed(2)}
                      <span className="text-xs text-stone-400 font-normal"> / kg</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedListingForOrder(item);
                      setOrderVolume(item.minOrderKg);
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-colors shadow-sm"
                  >
                    Place Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVE 200 TRANSACTIONS LEDGER */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-stone-900 border border-stone-800 rounded-xl">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-stone-400 mr-2">Filter Escrow Status:</span>
              {["All", "Escrow Locked", "Quality Inspected", "In Transit", "Funds Released"].map(
                (st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? "bg-emerald-500 text-stone-950 font-bold"
                        : "text-stone-300 hover:bg-stone-800"
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger (CSV)</span>
              </button>
            </div>
          </div>

          {/* High-Density Data Table */}
          <div className="overflow-x-auto border border-stone-800 rounded-xl bg-stone-900/90">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-800 bg-stone-950/70 text-stone-400">
                  <th className="py-3 px-4 font-semibold">Transaction ID</th>
                  <th className="py-3 px-4 font-semibold">Crop Produce</th>
                  <th className="py-3 px-4 font-semibold text-right">Volume</th>
                  <th className="py-3 px-4 font-semibold text-right">Total (USD)</th>
                  <th className="py-3 px-4 font-semibold">Farmer Seller</th>
                  <th className="py-3 px-4 font-semibold">Buyer Partner</th>
                  <th className="py-3 px-4 font-semibold">Escrow Status</th>
                  <th className="py-3 px-4 font-semibold">Contract Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-mono text-stone-300">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{txn.transactionRef}</td>
                    <td className="py-3 px-4 font-sans font-medium text-stone-200">{txn.crop}</td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {txn.volumeKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-emerald-400 font-bold">
                      ${txn.totalUsd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-sans text-stone-300">{txn.farmer}</td>
                    <td className="py-3 px-4 font-sans text-stone-300">
                      <div>{txn.buyer}</div>
                      <div className="text-[10px] text-stone-400">{txn.buyerType}</div>
                    </td>
                    <td className="py-3 px-4 font-sans">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          txn.escrowStatus === "Funds Released"
                            ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40"
                            : txn.escrowStatus === "In Transit"
                            ? "bg-blue-950/60 text-blue-400 border border-blue-800/40"
                            : txn.escrowStatus === "Quality Inspected"
                            ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                            : "bg-stone-800 text-stone-300 border border-stone-700"
                        }`}
                      >
                        {txn.escrowStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-400 text-[10px]">
                      {txn.blockchainVerificationHash.substring(0, 10)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-stone-400 flex items-center justify-between pt-2">
            <span>Showing verified active transactions from Vercel MySQL ledger.</span>
            <span className="font-mono text-emerald-400">Total Milestone: 200 Transactions</span>
          </div>
        </div>
      )}

      {/* MODAL: PLACE PURCHASE ORDER */}
      {selectedListingForOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div>
                <div className="text-xs text-emerald-400 font-semibold">AgriNova Direct Escrow Order</div>
                <h3 className="text-lg font-bold text-white">{selectedListingForOrder.title}</h3>
              </div>
              <button
                onClick={() => setSelectedListingForOrder(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {orderSuccessMessage ? (
              <div className="p-4 bg-emerald-950/40 border border-emerald-700 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="text-sm font-bold text-white">{orderSuccessMessage}</div>
                <div className="text-xs text-stone-300">
                  Transaction recorded in MySQL database and updated on Vercel deployment ledger.
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="p-3 bg-stone-950/70 border border-stone-800 rounded-lg text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Farmer:</span>
                    <span className="text-white font-medium">{selectedListingForOrder.farmerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Unit Price:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      ${selectedListingForOrder.pricePerKg.toFixed(2)} / kg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Stock Available:</span>
                    <span className="text-white font-mono">{selectedListingForOrder.availableKg} kg</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Order Volume (Kilograms)
                  </label>
                  <input
                    type="number"
                    min={selectedListingForOrder.minOrderKg}
                    max={selectedListingForOrder.availableKg}
                    value={orderVolume}
                    onChange={(e) => setOrderVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white font-mono"
                    required
                  />
                  <div className="text-[11px] text-stone-400 mt-1">
                    Minimum order: {selectedListingForOrder.minOrderKg} kg
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Buyer Organization
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Buyer Classification
                    </label>
                    <select
                      value={buyerType}
                      onChange={(e) => setBuyerType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                    >
                      <option value="Wholesale Mill">Wholesale Mill</option>
                      <option value="Supermarket Chain">Supermarket Chain</option>
                      <option value="Organic Co-op">Organic Co-op</option>
                      <option value="Exporter">Exporter</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-stone-950/90 border border-emerald-900/40 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-stone-300">Total Purchase Value:</span>
                  <span className="text-lg font-mono font-extrabold text-emerald-400">
                    ${(orderVolume * selectedListingForOrder.pricePerKg).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedListingForOrder(null)}
                    className="flex-1 py-2 text-xs font-medium rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition-colors shadow-sm"
                  >
                    Confirm &amp; Lock Escrow
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: ADD PRODUCE LISTING */}
      {isAddListingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-bold text-white">Post Produce as Farmer</h3>
              <button
                onClick={() => setIsAddListingOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3">
              <div>
                <label className="text-xs text-stone-300 block mb-1">Crop Title</label>
                <input
                  type="text"
                  placeholder="e.g. Certified Organic Milling Wheat"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Legumes">Legumes</option>
                    <option value="Cash Crops">Cash Crops</option>
                    <option value="Fruits">Fruits</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Price / kg ($ USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Available Stock (kg)</label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-300 block mb-1">Farmer Name</label>
                  <input
                    type="text"
                    value={newFarmer}
                    onChange={(e) => setNewFarmer(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 block mb-1">Farm Location / Plot</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-950 border border-stone-700 rounded-lg text-white"
                  required
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddListingOpen(false)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg bg-stone-800 text-stone-300 hover:bg-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-sm"
                >
                  Publish Listing to Marketplace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
