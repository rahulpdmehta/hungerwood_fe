import { useState } from 'react';
import BackButton from '@components/common/BackButton';
import BottomNavBar from '@components/layout/BottomNavBar';

const Help = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, browse our menu, add items to your cart, and proceed to checkout. You can customize your order with special instructions and choose your delivery address. Once you confirm the order and make payment, we\'ll start preparing your food!'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including credit/debit cards, UPI, net banking, and wallet payments. You can also pay cash on delivery for your convenience.'
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Delivery time typically ranges from 30-45 minutes depending on your location and order complexity. You can track your order in real-time through the app once it\'s confirmed.'
    },
    {
      id: 4,
      question: 'Can I cancel my order?',
      answer: 'Orders can be cancelled within 5 minutes of placement. Once the kitchen starts preparing your order, cancellation may not be possible to avoid food waste. Please contact support for urgent cancellations.'
    },
    {
      id: 5,
      question: 'What if I receive the wrong order?',
      answer: 'If you receive an incorrect order, please contact our support team immediately. We\'ll arrange for a replacement or refund as per our policy. Your satisfaction is our priority!'
    },
    {
      id: 6,
      question: 'How do I track my order?',
      answer: 'You can track your order in real-time from the "Orders" section in the app. You\'ll receive updates at each stage: confirmed, preparing, out for delivery, and delivered.'
    },
    {
      id: 7,
      question: 'Do you offer discounts or promotions?',
      answer: 'Yes! We regularly offer discounts, special promotions, and combo deals. Check the app for current offers, and don\'t forget to use your referral code to earn rewards!'
    },
    {
      id: 8,
      question: 'How do I update my delivery address?',
      answer: 'You can manage your delivery addresses in the "Saved Addresses" section of your profile. Add, edit, or set a default address anytime before placing an order.'
    }
  ];

  const supportOptions = [
    {
      id: 'phone',
      icon: 'phone',
      label: 'Call Us',
      description: 'Speak with our support team',
      action: () => window.open('tel:+91-XXXX-XXXXXX')
    },
    {
      id: 'email',
      icon: 'email',
      label: 'Email Us',
      description: 'Send us an email',
      action: () => window.open('mailto:support@hungerwood.com')
    },
    {
      id: 'whatsapp',
      icon: 'chat',
      label: 'WhatsApp',
      description: 'Chat with us on WhatsApp',
      action: () => window.open('https://wa.me/91XXXXXXXXXX?text=Hello%20HungerWood%20Support')
    }
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f7f6] dark:bg-[#211811] pb-20">
      {/* Top App Bar */}
      <div className="flex items-center bg-[#f8f7f6] dark:bg-[#211811] p-4 justify-between sticky top-0 z-10 border-b-2 border-gray-200 dark:border-gray-700 shadow-md">
        <BackButton className="w-12 h-12 shrink-0 max-h-[40px] max-w-[40px]" />
        <h2 className="text-[#181411] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Help & Support
        </h2>
        <div className="w-12"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-white dark:bg-[#2d221a] rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 shadow-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-[#7f4f13]/10 dark:bg-[#7f4f13]/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl text-[#7f4f13]">support_agent</span>
              </div>
              <div>
                <h2 className="text-[#181411] dark:text-white text-xl font-bold mb-1">
                  We're here to help!
                </h2>
                <p className="text-[#887263] dark:text-gray-400 text-sm">
                  Find answers to common questions or contact our support team
                </p>
              </div>
            </div>
          </div>

          {/* Contact Support Section */}
          <section>
            <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">
              Contact Support
            </h3>
            <div className="space-y-3">
              {supportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#2d221a] rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-[#7f4f13] dark:hover:border-[#7f4f13] transition-colors shadow-md"
                >
                  <div className="w-12 h-12 bg-[#7f4f13]/10 dark:bg-[#7f4f13]/20 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-xl text-[#7f4f13]">
                      {option.icon}
                    </span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-[#181411] dark:text-white text-base font-semibold">
                      {option.label}
                    </p>
                    <p className="text-[#887263] dark:text-gray-400 text-sm">
                      {option.description}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-[#887263]">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* FAQs Section */}
          <section>
            <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-3">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#2d221a] rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <p className="text-[#181411] dark:text-white text-base font-semibold flex-1 pr-4">
                      {faq.question}
                    </p>
                    <span
                      className={`material-symbols-outlined text-[#7f4f13] transition-transform shrink-0 ${
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4">
                      <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Additional Help Section */}
          <section>
            <div className="bg-gradient-to-r from-[#7f4f13]/10 to-[#887263]/10 dark:from-[#7f4f13]/20 dark:to-[#887263]/20 rounded-xl p-6 border-2 border-[#7f4f13]/20 dark:border-[#7f4f13]/30">
              <h3 className="text-[#181411] dark:text-white text-lg font-bold mb-2">
                Still need help?
              </h3>
              <p className="text-[#887263] dark:text-gray-400 text-sm leading-relaxed mb-4">
                Our support team is available 24/7 to assist you. Don't hesitate to reach out if you have any questions or concerns.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] text-sm">
                    schedule
                  </span>
                  <p className="text-[#887263] dark:text-gray-400 text-sm">
                    Support Hours: 24/7
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7f4f13] text-sm">
                    location_on
                  </span>
                  <p className="text-[#887263] dark:text-gray-400 text-sm">
                    Gaya, Bihar, India
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <BottomNavBar />
    </div>
  );
};

export default Help;
