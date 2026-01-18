export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>

          <p className="text-gray-700 mb-6 leading-relaxed">
            We’re here to help. Whether you have a question about the platform,
            need support, or want to discuss a potential collaboration, feel
            free to reach out using the details below.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Email
              </h2>
              <p className="text-gray-700">
                support@tradepilot.com
              </p>
              <p className="text-sm text-gray-500">
                We usually respond within 24–48 business hours.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Phone
              </h2>
              <p className="text-gray-700">
                +91 82530 38815
              </p>
              <p className="text-sm text-gray-500">
                Available Monday to Friday, 10 AM – 6 PM IST
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Address
              </h2>
              <p className="text-gray-700">
                Trade Pilot<br />
                Indore, Madhya Pradesh<br />
                India
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Support & Queries
              </h2>
              <p className="text-gray-700">
                For technical issues, account-related questions, or project
                disputes, please contact us via email with a clear description
                of the issue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
