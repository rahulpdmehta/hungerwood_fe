import BackButton from '@components/common/BackButton';
import BottomNavBar from '@components/layout/BottomNavBar';

const PrivacyPolicy = () => {
  const lastUpdated = 'January 26, 2025';

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#f8f7f6] dark:bg-[#211811] p-4 justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 shadow-md">
        <BackButton className="w-12 h-12 shrink-0 max-h-[40px] max-w-[40px]" />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Privacy Policy
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Last Updated */}
          <p className="text-[#887263] dark:text-gray-400 text-sm text-center">
            Last updated: {lastUpdated}
          </p>

          {/* Introduction */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              1. Introduction
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
              Welcome to HungerWood. We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              2. Information We Collect
            </h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2">
                  2.1 Personal Information
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 mt-2 space-y-1">
                  <li>Name and contact information (phone number, email address)</li>
                  <li>Delivery addresses</li>
                  <li>Profile picture (optional)</li>
                  <li>Payment information (processed securely through third-party payment gateways)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2">
                  2.2 Order Information
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  We collect information related to your orders, including:
                </p>
                <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 mt-2 space-y-1">
                  <li>Order history and preferences</li>
                  <li>Cooking instructions and special requests</li>
                  <li>Transaction details and payment records</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[#181411] dark:text-white text-base font-semibold mb-2">
                  2.3 Device and Usage Information
                </h3>
                <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                  We automatically collect certain information when you use our app:
                </p>
                <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 mt-2 space-y-1">
                  <li>Device information (device type, operating system, unique device identifiers)</li>
                  <li>App usage data and analytics</li>
                  <li>Location data (with your permission, for delivery purposes)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              3. How We Use Your Information
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-2">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 space-y-1">
              <li>Process and fulfill your orders</li>
              <li>Manage your account and provide customer support</li>
              <li>Send you order confirmations, updates, and delivery notifications</li>
              <li>Process payments and manage your wallet transactions</li>
              <li>Improve our services and personalize your experience</li>
              <li>Send promotional offers and updates (with your consent)</li>
              <li>Detect and prevent fraud or abuse</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-2">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 space-y-1">
              <li><strong>Service Providers:</strong> With third-party service providers who perform services on our behalf (payment processing, delivery partners, analytics)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              5. Data Security
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              6. Your Rights and Choices
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-2">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-[#887263] dark:text-gray-400 text-sm leading-relaxed ml-4 space-y-1">
              <li>Access and review your personal information</li>
              <li>Update or correct your information through your profile settings</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of promotional communications</li>
              <li>Request a copy of your data</li>
              <li>Withdraw consent for location services</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience, analyze app usage, and improve our services. You can control cookie preferences through your device settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              8. Children's Privacy
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically.
            </p>
          </section>

          {/* Contact Us */}
          <section>
            <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-3">
              10. Contact Us
            </h2>
            <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-2">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-white dark:bg-[#2d221a] rounded-xl p-4 border-2 border-gray-200 dark:border-gray-700 mt-3">
              <p className="text-[#181411] dark:text-white text-sm font-semibold mb-1">
                HungerWood
              </p>
              <p className="text-[#887263] dark:text-gray-400 text-sm">
                Gaya, Bihar, India
              </p>
              <p className="text-[#887263] dark:text-gray-400 text-sm mt-2">
                Email: support@hungerwood.com
              </p>
              <p className="text-[#887263] dark:text-gray-400 text-sm">
                Phone: +91-XXXX-XXXXXX
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default PrivacyPolicy;
