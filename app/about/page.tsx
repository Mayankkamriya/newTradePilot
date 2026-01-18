
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About TradePilot</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              TradePilot is a premier platform connecting talented sellers with buyers seeking quality project solutions. 
              We believe in creating meaningful partnerships that drive success for both parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Our platform facilitates seamless project bidding, allowing buyers to post their requirements and 
              sellers to submit competitive bids. We ensure transparency, security, and efficiency in every transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Verified and skilled professionals</li>
              <li>Secure payment processing</li>
              <li>Transparent bidding system</li>
              <li>24/7 customer support</li>
              <li>Quality assurance on all projects</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 leading-relaxed">
              Founded by passionate entrepreneurs, TradePilot is built by a team dedicated to revolutionizing 
              how businesses connect and collaborate on projects.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
