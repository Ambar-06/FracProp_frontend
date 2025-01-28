import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16 px-6 sm:px-20 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Invest in Fractional Real Estate
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Earn stable rental income and long-term property appreciation.
        </p>
        <Link href="/signup">
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700">
            Get Started
          </button>
        </Link>
        <Image
          src="/hero-image.png"
          alt="Investment"
          width={800}
          height={400}
          className="mt-10 mx-auto"
        />
      </section>

      {/* Trust Section */}
      <section className="bg-gray-100 py-10 px-6 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Trusted by thousands of investors
        </h2>
        <div className="mt-6 flex justify-center gap-6">
          <Image src="/trust1.png" alt="Trust" width={120} height={40} />
          <Image src="/trust2.png" alt="Trust" width={120} height={40} />
          <Image src="/trust3.png" alt="Trust" width={120} height={40} />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 sm:px-20">
        <h2 className="text-3xl font-bold text-center">How It Works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Step 1</h3>
            <p className="text-gray-600 mt-2">Sign up and verify your account.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Step 2</h3>
            <p className="text-gray-600 mt-2">Choose a fractional property.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold">Step 3</h3>
            <p className="text-gray-600 mt-2">Start earning rental income.</p>
          </div>
        </div>
      </section>

      {/* Investment Opportunities */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center">Available Investments</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <Image src="/property1.jpg" alt="Property" width={300} height={200} />
            <h3 className="text-xl font-semibold mt-4">Luxury Apartment</h3>
            <p className="text-gray-600">Expected ROI: 10% p.a.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Invest Now
            </button>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <Image src="/property2.jpg" alt="Property" width={300} height={200} />
            <h3 className="text-xl font-semibold mt-4">Office Space</h3>
            <p className="text-gray-600">Expected ROI: 12% p.a.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Invest Now
            </button>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg text-center">
            <Image src="/property3.jpg" alt="Property" width={300} height={200} />
            <h3 className="text-xl font-semibold mt-4">Retail Store</h3>
            <p className="text-gray-600">Expected ROI: 9% p.a.</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
              Invest Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="mt-10 space-y-6">
          <details className="bg-white shadow-md p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">What is fractional real estate?</summary>
            <p className="mt-2 text-gray-600">Fractional real estate allows multiple investors to own a portion of a property and earn rental income.</p>
          </details>
          <details className="bg-white shadow-md p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">How do I start investing?</summary>
            <p className="mt-2 text-gray-600">Sign up, verify your account, and choose a property to invest in.</p>
          </details>
          <details className="bg-white shadow-md p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">What is the minimum investment amount?</summary>
            <p className="mt-2 text-gray-600">You can start investing with as little as ₹100.</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <h2 className="text-xl font-semibold">FracProp</h2>
        <p className="mt-2 text-gray-400">Invest in real estate the smart way.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
