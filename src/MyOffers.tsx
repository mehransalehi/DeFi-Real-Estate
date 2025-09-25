import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Offer = {
  propertyId: number;
  title: string;
  location: string;
  price: string;
  description: string;
  offerAmount: string;
  status: "pending" | "success" | "failure";
};

const images = Array.from({ length: 6 }, (_, i) => `https://picsum.photos/400/250?random=${i + 1}`);

function MyOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("offers");
    if (stored) setOffers(JSON.parse(stored));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Offers</h1>
        <Link
          to="/"
          className="px-3 py-3 rounded-md bg-indigo-600 !text-white text-sm hover:bg-indigo-700"
        >
          Back to Properties
        </Link>
      </header>

      {offers.length === 0 ? (
        <p className="text-gray-600">You haven’t made any offers yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {offers.map((offer, i) => (
            <article
              key={i}
              className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col"
              aria-labelledby={`offer-title-${i}`}
            >
              <img
                src={images[offer.propertyId]}
                alt={offer.title}
                className="w-full h-48 object-cover sm:h-56 md:h-40 lg:h-48"
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 id={`offer-title-${i}`} className="text-lg font-semibold">
                    {offer.title}
                  </h3>

                  <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
                    <span>{offer.location}</span>
                    <span className="font-medium text-indigo-600">{offer.price}</span>
                  </div>

                  <p className="mt-3 text-sm text-gray-700 line-clamp-3">{offer.description}</p>

                  <p className="mt-2 text-gray-800">
                    Your Offer: <span className="font-semibold">{offer.offerAmount} ETH</span>
                  </p>

                  <p
                    className={`mt-1 text-sm font-semibold ${
                      offer.status === "success"
                        ? "text-green-600"
                        : offer.status === "failure"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    Status: {offer.status}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOffers;
