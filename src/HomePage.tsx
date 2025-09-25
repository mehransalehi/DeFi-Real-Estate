import "./App.css";
import { WagmiProvider, useAccount, useWalletClient } from "wagmi";
import { RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { config } from "./config";
import type { Dispatch, SetStateAction } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { encodeFunctionData } from "viem";

const queryClient = new QueryClient();
const images = Array.from(
  { length: 6 },
  (_, i) => `https://picsum.photos/400/250?random=${i + 1}`
);
const properties = [
  {
    id: 1,
    title: "Luxury Villa in Miami",
    location: "Miami, FL, USA",
    price: "250 ETH",
    description:
      "A modern luxury villa with 6 bedrooms, swimming pool, and ocean view.",
  },
  {
    id: 2,
    title: "Downtown Apartment in NYC",
    location: "New York, NY, USA",
    price: "120 ETH",
    description:
      "Stylish apartment located in the heart of Manhattan with skyline views.",
  },
  {
    id: 3,
    title: "Beach House in Malibu",
    location: "Malibu, CA, USA",
    price: "300 ETH",
    description:
      "Beautiful beachfront property with private access to the beach.",
  },
  {
    id: 4,
    title: "Penthouse in Dubai",
    location: "Dubai, UAE",
    price: "500 ETH",
    description:
      "High-rise penthouse with stunning views of Burj Khalifa and modern amenities.",
  },
  {
    id: 5,
    title: "Cottage in the Swiss Alps",
    location: "Zermatt, Switzerland",
    price: "180 ETH",
    description:
      "Cozy mountain cottage perfect for ski lovers and nature enthusiasts.",
  },
];

type Offer = {
  propertyId: number;
  title: string;
  location: string;
  price: string;
  description: string;
  offerAmount: string;
  status: "pending" | "success" | "failure";
};
type Alert = {
  id: number;
  type: "success" | "failed";
  message: string;
};

function PropertyCard({
  p,
  loading,
  setLoading,
  addOffer,
  addAlert,
}: {
  p: { id: number; title: string; location: string; price: string; description: string };
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  addOffer: (offer: Offer) => void;
  addAlert: (type: "success" | "failed", message: string) => void;
  offers: Offer[];
}) {
  const { isConnected } = useAccount(); // Wagmi hook to check if wallet is connected
  const { data: walletClient } = useWalletClient(); // Wagmi hook to get wallet client instance

  const [modal, setModal] = useState(false);
  const [amount, setAmount] = useState("0");

  const closeModal = () => {
    setAmount("0");
    setModal(false);
  };

  const handleMakeOffer = () => {
    setModal(true);
  };

  const makeOffer = async () => {
    if (!isConnected || !walletClient || loading) return; // Prevent action if wallet not connected or already loading
    if (!amount) {
      alert("Must Enter Valid Offer");
      return false;
    }

    // Build the offer object including property info + user input
    const offer: Offer = {
      propertyId: p.id,
      title: p.title,
      location: p.location,
      price: p.price,
      description: p.description,
      offerAmount: amount,
      status: "pending",
    };

    closeModal();
    setLoading(true);

    try {
      // ------------------------
      // Simulate blockchain contract interaction using Viem + Wagmi
      // ------------------------
      const mockAbi = [
        {
          name: "makeOffer",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "propertyId", type: "uint256" },
            { name: "offerAmount", type: "string" },
          ],
          outputs: [],
        },
      ];

      // Encode the function call (ABI + function name + args)
      const data = encodeFunctionData({
        abi: mockAbi,
        functionName: "makeOffer",
        args: [p.id, amount],
      });

      // Send transaction to dummy contract (just to simulate blockchain interaction)
      await walletClient.sendTransaction({
        to: "0x0000000000000000000000000000000000000000",
        data,
      });

      // Randomly decide success/failure to simulate a real transaction result
      const success = Math.random() > 0.2;

      // Add offer to local state and persist to localStorage
      addOffer({ ...offer, status: success ? "success" : "failure" });

      // Trigger alert message
      addAlert(
        success ? "success" : "failed",
        success ? "Offer submitted successfully" : "Something went wrong"
      );
    } catch (err) {
      console.log(err);
      addOffer({ ...offer, status: "failure" });
      addAlert("failed", "Something went wrong. Transaction not done");
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col">
      {/* property image, title, location, price */}
      <img src={images[p.id]} title={p.title} alt={p.title} className="w-full h-48 object-cover sm:h-56 md:h-40 lg:h-48" loading="lazy" />

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 id={`title-${p.id}`} className="text-lg font-semibold">{p.title}</h3>
          <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3zM12 11v10" />
              </svg>
              <span>{p.location}</span>
            </span>
            <span className="font-medium text-indigo-600">{p.price}</span>
          </div>
          <p className="mt-3 text-sm text-gray-700 line-clamp-3">{p.description}</p>
        </div>

        {/* Show ConnectButton if wallet not connected, else show Make Offer */}
        <div className="mt-4 flex gap-2">
          {!isConnected ? (
            <ConnectButton />
          ) : (
            <button onClick={handleMakeOffer} className="px-3 py-1 w-full rounded-md !bg-indigo-600 text-white text-sm !hover:bg-indigo-700">
              Make Offer
            </button>
          )}
        </div>
      </div>

      {/* Modal for entering offer amount */}
      <div onClick={closeModal} className={`absolute w-screen h-screen top-0 left-0 bg-indigo-50/50 ${modal ? "" : "hidden"}`}>
        <div onClick={(e) => e.stopPropagation()} className="absolute w-[400px] max-w-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-200 flex flex-col p-6">
          <h2 className="text-lg font-semibold text-gray-800">Enter an offer amount</h2>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 100 ETH" className="mt-4 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          <button className="mt-6 w-full rounded-md !bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1" onClick={makeOffer}>
            Make Offer
          </button>
        </div>
      </div>
    </article>
  );
}

function HomePage() {
  const [loading, setLoading] = useState(false); // Tracks transaction/loading state
  const [offers, setOffers] = useState<Offer[]>([]); // Stores all offers made by the user
  const [alerts, setAlerts] = useState<Alert[]>([]); // Stores temporary alert messages

  // Load persisted offers from localStorage when component mounts
  useEffect(() => {
    const stored = localStorage.getItem("offers");
    if (stored) {
      setOffers(JSON.parse(stored));
    }
  }, []);

  // Persist offers to localStorage whenever offers array changes
  useEffect(() => {
    localStorage.setItem("offers", JSON.stringify(offers));
  }, [offers]);

  // Add or update an offer in local state and persist immediately
  const addOffer = (offer: Offer) => {
    setOffers((prev) => {
      const existing = prev.find((o) => o.propertyId === offer.propertyId);
      let newOffers;
      if (existing) {
        // Replace the old offer for the same property
        newOffers = prev.map((o) => (o.propertyId === offer.propertyId ? offer : o));
      } else {
        newOffers = [...prev, offer]; // Add new offer
      }

      // Immediately update localStorage for persistence
      localStorage.setItem("offers", JSON.stringify(newOffers));
      return newOffers;
    });
  };

  // Show a temporary alert message
  const addAlert = (type: "success" | "failed", message: string) => {
    const id = Date.now(); // Unique ID for each alert
    setAlerts((prev) => [...prev, { id, type, message }]);

    // Automatically remove the alert after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 5000);
  };

  return (
    <QueryClientProvider client={queryClient}>
      {/* WagmiProvider gives access to wallet/account hooks */}
      <WagmiProvider config={config}>
        {/* RainbowKitProvider provides the wallet UI components */}
        <RainbowKitProvider>
          <main className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
            <header className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Properties for Sale</h1>
                <p className="mt-2 text-sm text-gray-600">
                  Browse our curated list of premium properties.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex">
                {/* Navigate to My Offers page */}
                <Link
                  to="/offers"
                  className="px-3 py-3 me-2 rounded-md bg-indigo-600 !text-white text-xs hover:bg-indigo-700"
                >
                  My Offers
                </Link>

                {/* RainbowKit wallet connect button */}
                <ConnectButton />
              </div>
            </header>

            <section className="max-w-7xl mx-auto">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {/* Render property cards */}
                {properties.map((p) => (
                  <PropertyCard
                    key={p.id}
                    p={p}
                    loading={loading}
                    setLoading={setLoading}
                    addOffer={addOffer}
                    offers={offers}
                    addAlert={addAlert}
                  />
                ))}
              </div>
            </section>

            {/* Loading overlay */}
            <div
              className={`absolute w-screen h-screen top-0 left-0 bg-indigo-50/80 ${
                loading ? "" : "hidden"
              }`}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border-4 !border-indigo-500 !border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            {/* Alert notifications */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`w-[300px] p-4 rounded-lg shadow-md text-white flex items-center justify-between
              ${alert.type === "success" ? "bg-green-600" : "bg-red-600"}`}
                >
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          </main>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}


export default HomePage;
